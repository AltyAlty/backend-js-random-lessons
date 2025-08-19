/*Импортируем express для создания роутеров.*/
import express from 'express';
/*Импортируем локальную БД.*/
import {localDB} from '../db/db-local';
/*Импортируем HTTP-статусы.*/
import {HTTP_STATUSES} from '../utils/utils';

/*Создаем функцию "getTestsRouter()" для создания роутинга для тестирования. Конфигурируем один DELETE-запрос, который
используется в тестах для очистки данных по книгам в локальной БД перед запуском тестов.*/
export const getTestsRouter = () => {
    /*Создаем роутер из Express.*/
    const router = express.Router();

    /*Конфигурируем DELETE-запрос для удаления данных о всех книгах в локальной БД.*/
    router.delete('/wipe-data', (req, res) => {
        localDB.books = [];
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });

    /*Возвращаем этот роутер, чтобы использовать его для тестирования в файле "back.api.test.ts".*/
    return router;
};