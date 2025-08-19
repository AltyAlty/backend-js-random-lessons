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
exports.getMainPageRouter = void 0;
/*Импортируем express из Express для создания роутеров. Импортируем объекты для типизации.*/
const express_1 = __importDefault(require("express"));
/*Импортируем сервисы.*/
const main_page_service_1 = require("../domain/main-page-service");
/*Импортируем HTTP-статусы.*/
const utils_1 = require("../utils/utils");
/*Создаем функцию "getMainPageRouter()" для создания роутинга по адресу http://localhost:3000.*/
const getMainPageRouter = () => {
    /*Создаем роутер из Express.*/
    const router = express_1.default.Router();
    /*Конфигурируем GET-запросы по адресу http://localhost:3000.*/
    router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        /*Метод "send()" - это аналог метода "write()" из библиотеки "http". Этот метод в зависимости от передаваемых
        данных сам меняет заголовок "Content-Type" в ответе. Если передать число, то оно будет интерпретировано как код
        ответа от сервера. Передаем объект, чтобы можно было работать с форматом JSON.*/
        // res.send({message: 'Hello!'});
        // res.send('Hello!');
        // res.send(404);
        /*Для передачи JSON-данных можно использовать метод "json()". Этот метод преобразовывает данные в JSON и
        отправляет их.*/
        // res.json({message: 'Hello!'});
        // res.json('Hello!');
        // res.json(404);
        /*Для отправки кодов ответов сервер нужно использовать метод "sendStatus()".*/
        // res.sendStatus(404);
        /*Просим сервис "mainPageService" найти данные для главной страницы. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 данные для главной страницы были найдены - возвращаются клиенту данные для главной страницы.
        1.2 данные для главной страницы не были найдены - сообщается клиенту, что данных для главной страницы не было
        найдено.
        2. Если сервер Mongo БД не работает - сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
        try {
            const mainPageContent = yield main_page_service_1.mainPageService.getMainPageContent();
            if (!mainPageContent) {
                res.status(utils_1.HTTP_STATUSES.OK_200).send('No main page content found');
                return;
            }
            res.status(utils_1.HTTP_STATUSES.OK_200).send(mainPageContent);
        }
        catch (error) {
            res.sendStatus(utils_1.HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
        }
        /*
        Для проверки можно перейти на http://localhost:3000 или в консоли использовать такую команду:

        fetch('http://localhost:3000', {method: 'GET'})
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.text().then(text => console.log(text)) } else { return }
            })
        */
    }));
    /*Возвращаем этот роутер, чтобы использовать его в приложении.*/
    return router;
};
exports.getMainPageRouter = getMainPageRouter;
