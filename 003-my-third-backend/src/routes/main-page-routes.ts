/*Импортируем express из Express для создания роутеров. Импортируем объекты для типизации.*/
import express, {Request, Response} from 'express';
/*Импортируем сервисы.*/
import {mainPageService} from '../domain/main-page-service';
/*Импортируем HTTP-статусы.*/
import {HTTP_STATUSES} from '../utils/utils';
/*Импортируем для типизации.*/
import {Document, WithId} from 'mongodb';

/*Создаем функцию "getMainPageRouter()" для создания роутинга по адресу http://localhost:3000.*/
export const getMainPageRouter = () => {
    /*Создаем роутер из Express.*/
    const router = express.Router();

    /*Конфигурируем GET-запросы по адресу http://localhost:3000.*/
    router.get('/', async (req: Request, res: Response): Promise<void> => {
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
            const mainPageContent: WithId<Document> | string | null = await mainPageService.getMainPageContent();

            if (!mainPageContent) {
                res.status(HTTP_STATUSES.OK_200).send('No main page content found');
                return;
            }

            res.status(HTTP_STATUSES.OK_200).send(mainPageContent);
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
        }

        /*
        Для проверки можно перейти на http://localhost:3000 или в консоли использовать такую команду:

        fetch('http://localhost:3000', {method: 'GET'})
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.text().then(text => console.log(text)) } else { return }
            })
        */
    });

    /*Возвращаем этот роутер, чтобы использовать его в приложении.*/
    return router;
};