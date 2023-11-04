"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMainPageRouter = void 0;
const express_1 = __importDefault(require("express"));
const mainpage_repository_1 = require("../repositories/mainpage-repository");
const getMainPageRouter = (db) => {
    const router = express_1.default.Router();
    /*Если будет запрос по адресу '/', то запустится указанная callback-функция. Метод "send()" это аналог "write()"
    из библиотеки "http". Этот метод в зависимости от передаваемых данных сам меняет заголовок "Content-Type" в ответе.
    Если передать число, то оно будет интерпретировано как код ответа от сервера.*/
    router.get('/', (req, res) => {
        /*
        В консоли можно использовать такую команду:
        fetch('http://localhost:3000/', {method: 'GET'})
            .then(res => res.json())
            .then(json => console.log(json))
        */
        /*Передаем объект, чтобы можно было работать с форматом JSON.*/
        // res.send({message: 'Hello!'});
        // res.send('Hello!');
        const mainPageContent = mainpage_repository_1.mainPageRepository.getMainPageContent(db);
        res.send(mainPageContent);
        // res.send(404);
        /*Для передачи JSON-данных можно использовать метод "json()". Этот метод преобразовывать данные в JSON сам.*/
        // res.json({message: 'Hello!'});
        // res.json('Hello!');
        // res.json(404);
        /*Для отправки кодов ответов сервер нужно использовать метод "sendStatus()".*/
        // res.sendStatus(404);
    });
    return router;
};
exports.getMainPageRouter = getMainPageRouter;
