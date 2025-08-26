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
exports.getFeedbacksRouter = void 0;
/*Импортируем express из Express для создания роутеров. Импортируем объекты для типизации.*/
const express_1 = __importDefault(require("express"));
/*Импортируем сервисы.*/
const feedbacks_service_1 = require("../domain/feedbacks-service");
/*Импортируем middlewares.*/
const authorization_middleware_1 = require("../middlewares/authorization-middleware");
/*Импортируем HTTP-статусы.*/
const utils_1 = require("../utils/utils");
/*Создаем функцию "getFeedbacksRouter()" для создания роутинга для работы с отзывами.*/
const getFeedbacksRouter = () => {
    /*Создаем роутер из Express.*/
    const router = express_1.default.Router();
    /*Конфигурируем GET-запросы для получения данных по всем отзывам.*/
    router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        /*Просим сервис "feedbacksService" найти все отзывы. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 отзывы были найдены - возвращаются клиенту данные по найденным отзывам.
        1.2 отзывы не были найдены - сообщается клиенту, что отзывов не было найдено.
        2. Если сервер Mongo БД не работает - сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
        try {
            const foundFeedbacks = yield feedbacks_service_1.feedbacksService.findAllFeedbacks();
            if (foundFeedbacks.length === 0) {
                res.status(utils_1.HTTP_STATUSES.OK_200).json('No feedbacks found');
                return;
            }
            res.status(utils_1.HTTP_STATUSES.OK_200).json(foundFeedbacks);
        }
        catch (error) {
            res.sendStatus(utils_1.HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
        }
        /*
        Для проверки в консоли можно использовать такую команду:

        1. Запрос всех отзывов:
        fetch('http://localhost:3000/feedbacks', {method: 'GET'})
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json().then(json => console.log(json)) } else { return }
            })
        */
    }));
    /*Конфигурируем POST-запросы для создания отзывов. Используем промежуточный слой "authorizationMiddleware" для
    проверки авторизации пользователя.*/
    router.post('/', authorization_middleware_1.authorizationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        /*Если не было указано комментария к отзыву или ID книги, или пользователь не был авторизован, то сообщаем
        клиенту об отказе в создании нового отзыва.*/
        if (!req.body.comment || !req.user || !req.body.bookID) {
            res.status(utils_1.HTTP_STATUSES.BAD_REQUEST_400).json('No comment/book or user is not authorized');
            return;
        }
        /*Просим сервис "feedbacksService" создать новый отзыв. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 отзыв был добавлен - сообщается клиенту, что отзыв был создан.
        1.2 отзыв не был добавлен - сообщается клиенту, что отзыв не был создан.
        2. Если сервер Mongo БД не работает - сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
        try {
            const result = yield feedbacks_service_1.feedbacksService.createFeedback(req.body.comment, req.user.id, req.body.bookID);
            if (!result) {
                res.sendStatus(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
                return;
            }
            res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
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
            body: JSON.stringify({email: '__mail@mail.ru__', code: '__code__'}),
            headers: {'content-type': 'application/json'}
        })
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json().then(json => console.log(json)) } else { return }
            })

        1.3 Аутентификация созданного пользователя:
        fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            body: JSON.stringify({loginOrEmail: 'eee', password: 'e5'}),
            headers: {'content-type': 'application/json'}
        })
            .then(res => {
                console.log(res.status);
                if (res.status === 201) { return res.json().then(json => console.log(json)) } else { return }
            })

        1.4 Добавление нового отзыва (токен смотри в консоли после шага 1.3):
        fetch('http://localhost:3000/feedbacks', {
            method: 'POST',
            body: JSON.stringify({comment: 'OK', bookID: 3}),
            headers: {
                'authorization': 'Bearer __token__',
                'content-type': 'application/json'
            }
        })
            .then(res => console.log(res.status))
            .then(() => {
                fetch('http://localhost:3000/feedbacks', {method: 'GET'})
                    .then(res => {
                        console.log(res.status);
                        if (res.status === 200) { return res.json().then(json => console.log(json)) } else { return }
                    })
            })
        */
    }));
    /*Возвращаем этот роутер, чтобы использовать его в приложении.*/
    return router;
};
exports.getFeedbacksRouter = getFeedbacksRouter;
