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
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const users_service_1 = require("../domain/users-service");
exports.usersRouter = express_1.default.Router();
exports.usersRouter
    /*Создание нового пользователя на UI уровне.*/
    .post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*Отправляем данные на BLL уровень.*/
    const newUser = yield users_service_1.usersService.createUser(req.body.login, req.body.email, req.body.password);
    res.status(201).send(newUser);
    /*В консоли можно использовать такую команду:
        fetch('http://localhost:3000/registration', {method: 'POST', body: JSON.stringify({login: 'ddd', email: 'd', password: 'd4'}),
        headers: {
            'content-type': 'application/json'
        }})
            .then(res => res.json())
            .then(json => console.log(json))
    */
}));
