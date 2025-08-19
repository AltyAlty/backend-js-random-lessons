/*Импортируем HTTP-статусы.*/
import {HTTP_STATUSES} from '../utils/utils';
/*Импортируем для типизации.*/
import {NextFunction, Request, Response} from 'express';

/*Создаем middleware, имитирующий авторизацию пользователей по токену. Чтобы ее пройти нужно использовать Query-параметр
"?token=123". Проверка: http://localhost:3000/books и http://localhost:3000/books?token=123.*/
export const fakeAuthorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.query.token === '123') {
        next();
    } else {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
};