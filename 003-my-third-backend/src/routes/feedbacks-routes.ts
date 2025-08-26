/*Импортируем express из Express для создания роутеров. Импортируем объекты для типизации.*/
import express, {Request, Response} from 'express';
/*Импортируем сервисы.*/
import {feedbacksService} from '../domain/feedbacks-service';
/*Импортируем middlewares.*/
import {authorizationMiddleware} from '../middlewares/authorization-middleware';
/*Импортируем HTTP-статусы.*/
import {HTTP_STATUSES} from '../utils/utils';
/*Импортируем типы.*/
import {RequestWithBodyType} from './types/routes-types';
/*Импортируем модели.*/
import {FeedbackViewModel} from '../models/views/FeedbackViewModel';
import {
    CreateUserFeedbackByCommentBookIDWithBodyInputModel
} from '../models/inputs/CreateUserFeedbackByCommentBookIDWithBodyInputModel';

/*Создаем функцию "getFeedbacksRouter()" для создания роутинга для работы с отзывами.*/
export const getFeedbacksRouter = () => {
    /*Создаем роутер из Express.*/
    const router = express.Router();

    /*Конфигурируем GET-запросы для получения данных по всем отзывам.*/
    router.get('/', async (req: Request, res: Response<FeedbackViewModel[] | unknown>): Promise<void> => {
        /*Просим сервис "feedbacksService" найти все отзывы. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 отзывы были найдены - возвращаются клиенту данные по найденным отзывам.
        1.2 отзывы не были найдены - сообщается клиенту, что отзывов не было найдено.
        2. Если сервер Mongo БД не работает - сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
        try {
            const foundFeedbacks: FeedbackViewModel[] = await feedbacksService.findAllFeedbacks();

            if (foundFeedbacks.length === 0) {
                res.status(HTTP_STATUSES.OK_200).json('No feedbacks found');
                return;
            }

            res.status(HTTP_STATUSES.OK_200).json(foundFeedbacks);
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
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
    });

    /*Конфигурируем POST-запросы для создания отзывов. Используем промежуточный слой "authorizationMiddleware" для
    проверки авторизации пользователя.*/
    router.post('/', authorizationMiddleware,
        async (req: RequestWithBodyType<CreateUserFeedbackByCommentBookIDWithBodyInputModel>,
               res: Response): Promise<void> => {
            /*Если не было указано комментария к отзыву или ID книги, или пользователь не был авторизован, то сообщаем
            клиенту об отказе в создании нового отзыва.*/
            if (!req.body.comment || !req.user || !req.body.bookID) {
                res.status(HTTP_STATUSES.BAD_REQUEST_400).json('No comment/book or user is not authorized');
                return;
            }

            /*Просим сервис "feedbacksService" создать новый отзыв. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 отзыв был добавлен - сообщается клиенту, что отзыв был создан.
            1.2 отзыв не был добавлен - сообщается клиенту, что отзыв не был создан.
            2. Если сервер Mongo БД не работает - сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
            try {
                const result: boolean =
                    await feedbacksService.createFeedback(req.body.comment, req.user.id, req.body.bookID);

                if (!result) {
                    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                    return;
                }

                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
            } catch (error) {
                res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
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
        });

    /*Возвращаем этот роутер, чтобы использовать его в приложении.*/
    return router;
};