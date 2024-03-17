import {NextFunction, Request, Response} from 'express';
import {jwtService} from '../../application/jwt-service';
import {usersService} from '../../domain/users-service';

/*Промежуточный слой для проверки пользователя по токену.*/
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    /*Проверяем есть ли в загаловках запроса от клиента токен.*/
    if (!req.headers.authorization) {
        res.send(401);
        return;
    }

    /*Если в загаловках запроса от клиента есть токен, то получаем токен, так как в заголовке будет находится строка по
    типу: Bearer token.*/
    const token = req.headers.authorization.split(' ')[1];

    /*Получаем ID пользователя по токену.*/
    const userID = await jwtService.getUserIDByToken(token);

    /*Если ID пользователя было найдено, то кладем данные о пользователе в запрос.*/
    if (userID) {
        /*Желательно так не вставлять напрямую пользователя в запрос. Лучше подготовить в запросе отдельный объект для
        передачи такой дополнительной информации.*/
        req.user = await usersService.findUserByID(userID);
        next();
    } else {
        res.send(401);
    }

    /*Если ID пользователя не было найдено, то отправляем код 401. Этот код приводит к ошибке "Cannot set headers after
    they are sent to the client", так как после успешной проверки токена и установки req.user, мы все равно отправляем
    ответ клиенту с кодом состояния 401. Это приводит к конфликту, так как уже был отправлен ответ клиенту. Для решения
    этой проблемы, например, можно добавить return в блок if или поместить в блок else код со статусом 401.*/
    // res.send(401);
};