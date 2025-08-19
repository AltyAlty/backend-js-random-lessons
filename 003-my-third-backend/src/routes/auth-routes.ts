/*Импортируем express из Express для создания роутеров. Импортируем объекты для типизации.*/
import express, {Response} from 'express';
/*Импортируем сервисы.*/
import {authService} from '../domain/auth-service';
/*Импортируем приложения.*/
import {jwtApplication} from '../applications/jwt-application';
/*Импортируем HTTP-статусы.*/
import {HTTP_STATUSES} from '../utils/utils';
/*Импортируем типы.*/
import {UserDBType} from '../db/types/db-types';
import {RequestWithBodyType} from './types/routes-types';
/*Импортируем модели.*/
import {ConfirmEmailByCodeWithBodyInputModel} from '../models/inputs/ConfirmEmailByCodeWithBodyInputModel';
import {AuthByLoginEmailPasswordWithBodyInputModel} from '../models/inputs/AuthByLoginEmailPasswordWithBodyInputModel';

/*Создаем функцию "getAuthRouter()" для создания роутинга для процессов, связанных с аутентификацией пользователей.*/
export const getAuthRouter = () => {
    /*Создаем роутер из Express.*/
    const router = express.Router();

    /*Конфигурируем POST-запросы для подтверждения почт пользователей при регистрации.*/
    router.post('/confirm-email', async (req: RequestWithBodyType<ConfirmEmailByCodeWithBodyInputModel>,
                                         res: Response): Promise<void> => {
        /*Просим сервис "authService" подтвердить почту пользователя. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 почта была подтверждена - сообщается клиенту, почта была подтверждена.
        1.2 почта не была подтверждена - сообщается клиенту, почта не была подтверждена.
        2. Если сервер Mongo БД не работает - сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
        try {
            const result: boolean = await authService.confirmEmail(req.body.email, req.body.code);
            if (!result) res.status(HTTP_STATUSES.UNAUTHORIZED_401).send({message: 'Access denied'});
            res.status(HTTP_STATUSES.OK_200).send({message: 'Email confirmed'});
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
        }

        /*
        Для проверки в консоли можно использовать такие команды:

        1.1 Создание пользователя с логином, почтой (настоящей, нужно будет подтвердить) и паролем:
        fetch('http://localhost:3000/users/registration', {
            method: 'POST',
            body: JSON.stringify({login: 'eee', email: '__mail@mail.ru__', password: 'e5'}),
            headers: {'content-type': 'application/json'}
        })
            .then(res => {
                console.log(res.status);
                if (res.status === 201) { return res.json().then(json => console.log(json)) } else { return }
            })

        1.2 Подтверждение почты пользователя (код смотри в Mongo БД и в почте):
        fetch('http://localhost:3000/auth/confirm-email', {
            method: 'POST',
            body: JSON.stringify({email: 'realemail@mail.ru', code: '__code__'}),
            headers: {'content-type': 'application/json'}
        })
            .then(res => {
                console.log(res.status);
                if (res.status === 200 || 401) { return res.json().then(json => console.log(json)) } else { return }
            })
        */
    });

    /*Конфигурируем POST-запросы для аутентификации пользователей по логину/почте и паролю.*/
    router.post('/login', async (req: RequestWithBodyType<AuthByLoginEmailPasswordWithBodyInputModel>,
                                 res: Response): Promise<void> => {
        /*Если не было указано логина, почты или пароля, то сообщаем клиенту об отказе в аутентификации.*/
        if (!req.body.loginOrEmail || !req.body.password) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json('No login, email or password');
            return;
        }

        try {
            /*Просим сервис "authService" проверить наличие пользователя в БД и корректность указанного пароля при
            аутентификации.*/
            const user: UserDBType | false = await
                authService.checkCredentials(req.body.loginOrEmail, req.body.password);

            /*Если нет проблем с учетными данными пользователя, то просим приложение "jwtApplication" создать для
            JWT-токен для пользователя. Иначе сообщаем клиенту об отказе в аутентификации.*/
            if (user) {
                const token = await jwtApplication.createJWT(user);
                res.status(HTTP_STATUSES.CREATED_201).send({message: 'Access granted', token: token});
            } else {
                res.status(HTTP_STATUSES.UNAUTHORIZED_401).send({message: 'Access denied'});
            }
        } catch (error) {
            /*Если сервер Mongo БД не работает, то сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
            res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
        }

        /*
        Для проверки в консоли можно использовать такие команды:

        1.1 Создание пользователя с логином, почтой (настоящей, нужно будет подтвердить) и паролем:
        fetch('http://localhost:3000/users/registration', {
            method: 'POST',
            body: JSON.stringify({login: 'eee', email: '__mail@mail.ru__', password: 'e5'}),
            headers: {'content-type': 'application/json'}
        })
            .then(res => {
                console.log(res.status);
                if (res.status === 201) { return res.json().then(json => console.log(json)) } else { return }
            })

        1.2 Подтверждение почты пользователя (код смотри в Mongo БД и в почте):
        fetch('http://localhost:3000/auth/confirm-email', {
            method: 'POST',
            body: JSON.stringify({email: 'realemail@mail.ru', code: '__code__'}),
            headers: {'content-type': 'application/json'}
        })
            .then(res => {
                console.log(res.status);
                if (res.status === 200 || 401) { return res.json().then(json => console.log(json)) } else { return }
            })

        1.3 Аутентификация созданного пользователя:
        fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            body: JSON.stringify({loginOrEmail: 'eee', password: 'e5'}),
            headers: {'content-type': 'application/json'}
        })
            .then(res => {
                console.log(res.status);
                if (res.status === 201 || 401) { return res.json().then(json => console.log(json)) } else { return }
            })
        */
    });

    /*Возвращаем этот роутер, чтобы использовать его в приложении.*/
    return router;
};