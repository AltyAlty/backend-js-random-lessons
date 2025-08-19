/*Импортируем middleware "body" из библиотеки express-validator, который позволяет проверять "req.body" и устанавливать
для него ограничения. Импортируем "validationResult" из библиотеки express-validator, который позволяет проверять
наличие накопленных ошибок валидации.*/
import {body, validationResult} from 'express-validator';
/*Импортируем HTTP-статусы.*/
import {HTTP_STATUSES} from '../utils/utils';
/*Импортируем для типизации.*/
import {NextFunction, Request, Response} from 'express';

/*Используем middleware "body" из библиотеки "express-validator", чтобы проверить наличие "req.body.title" и установить
для него ограничения.*/

/*Создаем middleware, проверяющий, чтобы название книги не было пустым. Если проверка не пройдена, то будет добавлена
ошибка валидации.*/
export const titleIsNotEmptyValidationMiddleware = body('title')
    .not().isEmpty({ignore_whitespace: true}).withMessage('title must not be empty');
/*
Для проверки в консоли можно использовать такую команду:

1. Название было указано из нескольких пробелов.
fetch('http://localhost:3000/books', {
    method: 'POST',
    body: JSON.stringify({title: '   '}),
    headers: {'content-type': 'application/json'}
})
*/

/*Создаем middleware, проверяющий, чтобы название книги не было слишком коротким или слишком длинным. Если проверка не
пройдена, то будет добавлена ошибка валидации.*/
export const titleIsOfCorrectLengthValidationMiddleware = body('title')
    .isLength({min: 3, max: 20}).withMessage('title must be min: 3, max: 20');
/*
Для проверки в консоли можно использовать такую команду:

1. Название было указано из 30 символов.
fetch('http://localhost:3000/books', {
    method: 'POST',
    body: JSON.stringify({title: '012345678901234567890123456789'}),
    headers: {'content-type': 'application/json'}
})
*/

/*Создаем middleware, проверяющий наличие ошибок валидации, добавленных предыдущими middlewares.*/
export const titleValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    /*Проверяем наличие ошибок валидации.*/
    const errors = validationResult(req);
    /*Если есть ошибки валидации, то отправляет код статуса 400, иначе запускаем следующую handler-функцию.*/
    if (!errors.isEmpty()) { return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400) } else { next() }
};