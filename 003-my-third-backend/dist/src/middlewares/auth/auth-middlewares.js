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
const jwt_service_1 = require("../../application/jwt-service");
const users_service_1 = require("../../domain/users-service");
/*Промежуточный слой для проверки пользователя по токену.*/
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /*Проверяем есть ли в загаловках запроса от клиента токен.*/
    if (!req.headers.authorization) {
        res.send(401);
        return;
    }
    /*Если в загаловках запроса от клиента есть токен, то получаем токен, так как в заголовке будет находится строка по
    типу: Bearer token.*/
    const token = req.headers.authorization.split(' ')[1];
    /*Получаем ID пользователя по токену.*/
    const userID = yield jwt_service_1.jwtService.getUserIDByToken(token);
    /*Если ID пользователя было найдено, то кладем данные о пользователе в запрос.*/
    if (userID) {
        /*Желательно так не вставлять напрямую пользователя в запрос. Лучше подготовить в запросе отдельный объект для
        передачи такой дополнительной информации.*/
        req.user = yield users_service_1.usersService.findUserByID(userID);
        next();
    }
    else {
        res.send(401);
    }
    /*Если ID пользователя не было найдено, то отправляем код 401. Этот код приводит к ошибке "Cannot set headers after
    they are sent to the client", так как после успешной проверки токена и установки req.user, мы все равно отправляем
    ответ клиенту с кодом состояния 401. Это приводит к конфликту, так как уже был отправлен ответ клиенту. Для решения
    этой проблемы, например, можно добавить return в блок if или поместить в блок else код со статусом 401.*/
    // res.send(401);
});
exports.authMiddleware = authMiddleware;
