/*Импортируем сервисы.*/
import {usersService} from '../domain/users-service';
/*Импортируем приложения.*/
import {jwtApplication} from '../applications/jwt-application';
/*Импортируем HTTP-статусы.*/
import {HTTP_STATUSES} from '../utils/utils';
/*Импортируем для типизации.*/
import {NextFunction, Request, Response} from 'express';
/*Импортируем для типизации.*/
import {ObjectId} from 'mongodb';

/*Создаем middleware для авторизации пользователей по токену. Этот слой при успешной авторизации добавляет данные о
пользователе в запрос.*/
export const authorizationMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    /*Если в заголовках запроса от клиента нет раздела "authorization", то сообщаем клиенту об отказе в авторизации.*/
    if (!req.headers.authorization) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }

    /*Если в заголовках запроса от клиента есть раздел "authorization", содержащий токен, то берем этот токен, так как в
    разделе "authorization", скорее всего, будет находиться строка примерно такого вида: "Bearer token".*/
    const token = req.headers.authorization.split(' ')[1];
    /*Просим приложение "jwtApplication" найти по токену ID пользователя.*/
    const userID: ObjectId | null = await jwtApplication.getUserIDByToken(token);

    /*Если ID пользователя не было найдено, то сообщаем клиенту об отказе в авторизации.*/
    if (!userID) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }

    /*Если ID пользователя было найдено, то кладем данные о пользователе в запрос. Желательно напрямую не вставлять
    данные пользователя в запрос. Лучше подготовить в запросе отдельный объект для передачи такой дополнительной
    информации.*/
    try {
        req.user = await usersService.findUserByID(userID.toString());
        next();
    } catch (error) {
        /*Если сервер Mongo БД не работает, то сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
    }
};