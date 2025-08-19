"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.titleValidationMiddleware = exports.titleIsOfCorrectLengthValidationMiddleware = exports.titleIsNotEmptyValidationMiddleware = void 0;
/*Импортируем middleware "body" из библиотеки express-validator, который позволяет проверять "req.body" и устанавливать
для него ограничения. Импортируем "validationResult" из библиотеки express-validator, который позволяет проверять
наличие накопленных ошибок валидации.*/
const express_validator_1 = require("express-validator");
/*Импортируем HTTP-статусы.*/
const utils_1 = require("../utils/utils");
/*Используем middleware "body" из библиотеки "express-validator", чтобы проверить наличие "req.body.title" и установить
для него ограничения.*/
/*Создаем middleware, проверяющий, чтобы название книги не было пустым. Если проверка не пройдена, то будет добавлена
ошибка валидации.*/
exports.titleIsNotEmptyValidationMiddleware = (0, express_validator_1.body)('title')
    .not().isEmpty({ ignore_whitespace: true }).withMessage('title must not be empty');
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
exports.titleIsOfCorrectLengthValidationMiddleware = (0, express_validator_1.body)('title')
    .isLength({ min: 3, max: 20 }).withMessage('title must be min: 3, max: 20');
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
const titleValidationMiddleware = (req, res, next) => {
    /*Проверяем наличие ошибок валидации.*/
    const errors = (0, express_validator_1.validationResult)(req);
    /*Если есть ошибки валидации, то отправляет код статуса 400, иначе запускаем следующую handler-функцию.*/
    if (!errors.isEmpty()) {
        return res.sendStatus(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
    }
    else {
        next();
    }
};
exports.titleValidationMiddleware = titleValidationMiddleware;
