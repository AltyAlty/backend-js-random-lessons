/*Импортируем для типизации.*/
import {NextFunction, Request, Response} from 'express';

let requestCounter = 0;

/*Создаем middleware, подсчитывающий количество запросов.*/
export const requestCounterMiddleware = (req: Request, res: Response, next: NextFunction) => {
    requestCounter++;
    console.log('Request Counter Middleware: ' + requestCounter);
    next();
};