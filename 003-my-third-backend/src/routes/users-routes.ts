/*Импортируем express из Express для создания роутеров. Импортируем NextFunction, Request и Response из Express для типизации.*/
import express, {NextFunction, Request, Response} from 'express';
/*Импортируем сервисы.*/
import {usersService} from '../domain/users-service';
/*Импортируем HTTP-статусы.*/
import {HTTP_STATUSES} from '../utils/utils';
/*Импортируем типы.*/
import {RequestWithBodyType, RequestWithQueryParamsType, RequestWithURIParamsType} from './types/routes-types';
/*Импортируем модели.*/
import {UserViewModel} from '../models/views/UserViewModel';
import {GetUserByIDWithURIParamsInputModel} from '../models/inputs/GetUserByIDWithURIParamsInputModel';
import {
    GetUserByLoginOrEmailWithQueryParamsInputModel
} from '../models/inputs/GetUserByLoginOrEmailWithQueryParamsInputModel';
import {
    CreateUserByLoginEmailPasswordWithBodyInputModel
} from '../models/inputs/CreateUserByLoginEmailPasswordWithBodyInputModel';

/*Создаем функцию "getUsersRouter()" для создания роутинга для работы с пользователями.*/
export const getUsersRouter = () => {
    /*Создаем роутер из Express.*/
    const router = express.Router();

    /*Конфигурируем GET-запросы для получения пользователя по логину или почте.*/
    router.get('/', async (req: RequestWithQueryParamsType<GetUserByLoginOrEmailWithQueryParamsInputModel>,
                           res: Response<UserViewModel | unknown>, next: NextFunction): Promise<void> => {
        /*Если не было указано ни логина, ни пароля, то запускаем следующий маршрут.*/
        if (!req.query.login && !req.query.email) {
            next();
            return;
        }

        /*Просим сервис "usersService" найти пользователя по логину или почте. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 пользователь был найден - возвращаются клиенту данные по найденному пользователю.
        1.2 пользователь не был найден - сообщается клиенту, что пользователя не было найдено.
        2. Если сервер Mongo БД не работает - сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
        try {
            const loginOrEmail: GetUserByLoginOrEmailWithQueryParamsInputModel = {
                login: req.query.login?.toString(),
                email: req.query.email?.toString()
            }

            const foundUser: UserViewModel | unknown = await usersService.findUserByLoginOrEmail(loginOrEmail);

            if (!foundUser) {
                res.status(HTTP_STATUSES.OK_200).json('No users found');
                return;
            }

            res.status(HTTP_STATUSES.OK_200).json(foundUser);
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
        }

        /*
        Для проверки в консоли можно использовать такую команду:

        1. Логин был указан верно:
        fetch('http://localhost:3000/users?login=aaa', {method: 'GET'})
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json().then(json => console.log(json)) } else { return }
            })

        2. Логин был указан неверно:
        fetch('http://localhost:3000/users?login=xxx', {method: 'GET'})
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json().then(json => console.log(json)) } else { return }
            })
        */
    });

    /*Конфигурируем GET-запросы для получения данных по всем пользователям.*/
    router.get('/', async (req: Request, res: Response<UserViewModel | unknown>): Promise<void> => {
        /*Просим сервис "usersService" найти всех пользователей. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 пользователи были найдены - возвращаются клиенту данные по найденным пользователям.
        1.2 пользователи не были найдены - сообщается клиенту, что пользователей не было найдено.
        2. Если сервер Mongo БД не работает - сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
        try {
            const foundUsers: UserViewModel[] = await usersService.findAllUsers();

            if (foundUsers.length === 0) {
                res.status(HTTP_STATUSES.OK_200).json('No users found');
                return;
            }

            res.status(HTTP_STATUSES.OK_200).json(foundUsers);
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
        }

        /*
        Для проверки в консоли можно использовать такую команду:

        1. Запрос всех пользователей:
        fetch('http://localhost:3000/users', {method: 'GET'})
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json().then(json => console.log(json)) } else { return }
            })
        */
    });

    /*Конфигурируем GET-запросы для получения пользователя по ID.*/
    router.get('/:id', async (req: RequestWithURIParamsType<GetUserByIDWithURIParamsInputModel>,
                              res: Response<UserViewModel | unknown>): Promise<void> => {
        /*Просим сервис "usersService" найти пользователя по ID. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 пользователь был найден - возвращаются клиенту данные по найденному пользователю.
        1.2 пользователь не был найден - сообщается клиенту, что пользователя не было найдено.
        2. Если сервер Mongo БД не работает - сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
        try {
            const foundUser: UserViewModel | null = await usersService.findUserByID(req.params.id);

            if (!foundUser) {
                res.status(HTTP_STATUSES.OK_200).json('No users found');
                return;
            }

            res.status(HTTP_STATUSES.OK_200).json(foundUser);
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
        }

        /*
        Для проверки в консоли можно использовать такие команды:

        1. ID был указан верно (бери ID из Mongo БД):
        fetch('http://localhost:3000/users/68a109b63d81063b0444153a', {method: 'GET'})
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json().then(json => console.log(json)) } else { return }
            })

        2. ID был указан неверно:
        fetch('http://localhost:3000/users/68a109b63d81063b0444153x', {method: 'GET'})
            .then(res => console.log(res.status))
        */
    });

    /*Конфигурируем POST-запросы для создания нового пользователя с логином, почтой и паролем.*/
    router.post('/registration', async (req: RequestWithBodyType<CreateUserByLoginEmailPasswordWithBodyInputModel>,
                                        res: Response<UserViewModel | unknown>): Promise<void> => {
        /*Если не было указано логина, почты или пароля, то сообщаем клиенту об отказе в создании нового пользователя.*/
        if (!req.body.login || !req.body.email || !req.body.password) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json('No login, email or password');
            return;
        }

        /*Просим сервис "usersService" создать нового пользователя с логином, почтой и паролем. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 пользователь был создан - возвращаются клиенту данные по созданному пользователю.
        1.2 пользователь не был создан - сообщается клиенту, что пользователя не было создано.
        2. Если сервер Mongo БД не работает - сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
        try {
            const createdUser: UserViewModel | null = await
                usersService.createUser(req.body.login, req.body.email, req.body.password);

            if (!createdUser) {
                res.status(HTTP_STATUSES.BAD_REQUEST_400).json('Wrong login, email or password');
                return;
            }

            res.status(HTTP_STATUSES.CREATED_201).json(createdUser);
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
        }

        /*
        Для проверки в консоли можно использовать такие команды:

        1. Логин, почта (ненастоящая, не использовать nodemailer) и пароль были указаны.
        fetch('http://localhost:3000/users/registration', {
            method: 'POST',
            body: JSON.stringify({login: 'ddd', email: 'd', password: 'd4'}),
            headers: {'content-type': 'application/json'}
        })
            .then(res => {
                console.log(res.status);
                if (res.status === 201) { return res.json().then(json => console.log(json)) } else { return }
            })

        fetch('http://localhost:3000/users', {method: 'GET'})
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json().then(json => console.log(json)) } else { return }
            })

        2. Логин не был указан, а почта (ненастоящая, не использовать nodemailer) и пароль были указаны.
        fetch('http://localhost:3000/users/registration', {
            method: 'POST',
            body: JSON.stringify({logins: 'ddd', email: 'd', password: 'd4'}),
            headers: {'content-type': 'application/json'}
        })
            .then(res => console.log(res.status))

        3. Почта не была указана, а логин и пароль были указаны.
        fetch('http://localhost:3000/users/registration', {
            method: 'POST',
            body: JSON.stringify({login: 'ddd', emails: 'd', password: 'd4'}),
            headers: {'content-type': 'application/json'}
        })
            .then(res => console.log(res.status))

        4. Пароль не был указан, а логин и почта (ненастоящая, не использовать nodemailer) были указаны.
        fetch('http://localhost:3000/users/registration', {
            method: 'POST',
            body: JSON.stringify({login: 'ddd', email: 'd', passwords: 'd4'}),
            headers: {'content-type': 'application/json'}
        })
            .then(res => console.log(res.status))

        5. Создание пользователя с логином, почтой (настоящей, нужно будет подтвердить) и паролем:
        fetch('http://localhost:3000/users/registration', {
            method: 'POST',
            body: JSON.stringify({login: 'eee', email: '__mail@mail.ru__', password: 'e5'}),
            headers: {'content-type': 'application/json'}
        })
            .then(res => {
                console.log(res.status);
                if (res.status === 201) { return res.json().then(json => console.log(json)) } else { return }
            })
        */
    });

    /*Возвращаем этот роутер, чтобы использовать его в приложении.*/
    return router;
};