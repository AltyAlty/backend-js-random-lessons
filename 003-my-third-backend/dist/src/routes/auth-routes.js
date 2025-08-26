"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthRouter = void 0;
/*Импортируем express из Express для создания роутеров. Импортируем объекты для типизации.*/
const express_1 = __importDefault(require("express"));
/*Импортируем сервисы.*/
const auth_service_1 = require("../domain/auth-service");
/*Импортируем приложения.*/
const jwt_application_1 = require("../applications/jwt-application");
/*Импортируем HTTP-статусы.*/
const utils_1 = require("../utils/utils");
/*Создаем функцию "getAuthRouter()" для создания роутинга для процессов, связанных с аутентификацией пользователей.*/
const getAuthRouter = () => {
    /*Создаем роутер из Express.*/
    const router = express_1.default.Router();
    /*Конфигурируем POST-запросы для подтверждения почт пользователей при регистрации.*/
    router.post('/confirm-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        /*Просим сервис "authService" подтвердить почту пользователя. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 почта была подтверждена - сообщается клиенту, почта была подтверждена.
        1.2 почта не была подтверждена - сообщается клиенту, почта не была подтверждена.
        2. Если сервер Mongo БД не работает - сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
        try {
            const result = yield auth_service_1.authService.confirmEmail(req.body.email, req.body.code);
            if (!result)
                res.status(utils_1.HTTP_STATUSES.UNAUTHORIZED_401).send({ message: 'Access denied' });
            res.status(utils_1.HTTP_STATUSES.OK_200).send({ message: 'Email confirmed' });
        }
        catch (error) {
            res.sendStatus(utils_1.HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
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
    }));
    /*Конфигурируем POST-запросы для аутентификации пользователей по логину/почте и паролю.*/
    router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        /*Если не было указано логина, почты или пароля, то сообщаем клиенту об отказе в аутентификации.*/
        if (!req.body.loginOrEmail || !req.body.password) {
            res.status(utils_1.HTTP_STATUSES.BAD_REQUEST_400).json('No login, email or password');
            return;
        }
        try {
            /*Просим сервис "authService" проверить наличие пользователя в БД и корректность указанного пароля при
            аутентификации.*/
            const user = yield auth_service_1.authService.checkCredentials(req.body.loginOrEmail, req.body.password);
            /*Если нет проблем с учетными данными пользователя, то просим приложение "jwtApplication" создать для
            JWT-токен для пользователя. Иначе сообщаем клиенту об отказе в аутентификации.*/
            if (user) {
                const token = yield jwt_application_1.jwtApplication.createJWT(user);
                res.status(utils_1.HTTP_STATUSES.CREATED_201).send({ message: 'Access granted', token: token });
            }
            else {
                res.status(utils_1.HTTP_STATUSES.UNAUTHORIZED_401).send({ message: 'Access denied' });
            }
        }
        catch (error) {
            /*Если сервер Mongo БД не работает, то сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
            res.sendStatus(utils_1.HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
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
            .then(() => {
                fetch('http://localhost:3000/users', {method: 'GET'})
                    .then(res => {
                        console.log(res.status);
                        if (res.status === 200) { return res.json().then(json => console.log(json)) } else { return }
                    })
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
    }));
    /*Возвращаем этот роутер, чтобы использовать его в приложении.*/
    return router;
};
exports.getAuthRouter = getAuthRouter;
