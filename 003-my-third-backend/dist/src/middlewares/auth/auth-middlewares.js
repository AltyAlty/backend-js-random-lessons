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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
/*Импортируем сервисы.*/
const users_service_1 = require("../../domain/users-service");
/*Импортируем приложения.*/
const jwt_application_1 = require("../../applications/jwt-application");
/*Импортируем HTTP-статусы.*/
const utils_1 = require("../../utils/utils");
/*Создаем middleware для авторизации пользователя по токену. Этот слой при успешной авторизации добавляет данные о
пользователе в запрос.*/
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /*Если в заголовках запроса от клиента нет раздела "authorization", то сообщаем клиенту об отказе в авторизации.*/
    if (!req.headers.authorization) {
        res.sendStatus(utils_1.HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    /*Если в заголовках запроса от клиента есть раздел "authorization", содержащий токен, то берем этот токен, так как в
    разделе "authorization", скорее всего, будет находиться строка примерно такого вида: "Bearer token".*/
    const token = req.headers.authorization.split(' ')[1];
    /*Просим приложение "jwtApplication" найти по токену ID пользователя.*/
    const userID = yield jwt_application_1.jwtApplication.getUserIDByToken(token);
    /*Если ID пользователя не было найдено, то сообщаем клиенту об отказе в авторизации.*/
    if (!userID) {
        res.sendStatus(utils_1.HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    /*Если ID пользователя было найдено, то кладем данные о пользователе в запрос. Желательно напрямую не вставлять
    данные пользователя в запрос. Лучше подготовить в запросе отдельный объект для передачи такой дополнительной
    информации.*/
    try {
        req.user = yield users_service_1.usersService.findUserByID(userID.toString());
        next();
    }
    catch (error) {
        /*Если сервер Mongo БД не работает, то сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
        res.sendStatus(utils_1.HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
    }
});
exports.authMiddleware = authMiddleware;
