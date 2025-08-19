"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestsRouter = void 0;
/*Импортируем express для создания роутеров.*/
const express_1 = __importDefault(require("express"));
/*Импортируем локальную БД.*/
const db_local_1 = require("../db/db-local");
/*Импортируем HTTP-статусы.*/
const utils_1 = require("../utils/utils");
/*Создаем функцию "getTestsRouter()" для создания роутинга для тестирования. Конфигурируем один DELETE-запрос, который
используется в тестах для очистки данных по книгам в локальной БД перед запуском тестов.*/
const getTestsRouter = () => {
    /*Создаем роутер из Express.*/
    const router = express_1.default.Router();
    /*Конфигурируем DELETE-запрос для удаления данных о всех книгах в локальной БД.*/
    router.delete('/wipe-data', (req, res) => {
        db_local_1.localDB.books = [];
        res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
    });
    /*Возвращаем этот роутер, чтобы использовать его для тестирования в файле "back.api.test.ts".*/
    return router;
};
exports.getTestsRouter = getTestsRouter;
