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
exports.authRouter = void 0;
const express_1 = require("express");
const users_service_1 = require("../../domain/users-service");
const jwt_service_1 = require("../../application/jwt-service");
exports.authRouter = (0, express_1.Router)({});
/*Логинизация пользователя на UI уровне.*/
exports.authRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*Отправляем данные на BLL уровень.*/
    const user = yield users_service_1.usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
    /*При нахождении пользователя пытаемся создать для него токен.*/
    if (user) {
        /*Создаем токен.*/
        const token = yield jwt_service_1.jwtService.createJWT(user);
        /*Отправляем токен клиенту.*/
        res.status(201).send({ message: 'Access granted', token: token });
        // res.status(201).send(token);
    }
    else {
        res.status(401).send({ message: 'Access denied' });
    }
    /*В консоли можно использовать такую команду:
        fetch('http://localhost:3000/login', {method: 'POST', body: JSON.stringify({loginOrEmail: 'ddd', password: 'd4'}),
        headers: {
            'content-type': 'application/json'
        }})
            .then(res => res.json())
            .then(json => console.log(json))
    */
}));
