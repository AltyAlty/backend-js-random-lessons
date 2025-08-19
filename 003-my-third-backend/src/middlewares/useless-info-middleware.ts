/*Импортируем для типизации.*/
import {NextFunction, Request, Response} from 'express';

/*Создаем middleware, предоставляющий дополнительные данные.*/
export const uselessInfoMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    req.uselessInfo = 'Some useless info';
    /*Метод "next()" нужен для работы цепочки handler-функций.*/
    next();
};