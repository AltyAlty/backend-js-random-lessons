"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeAuthMiddleware = void 0;
/*Импортируем HTTP-статусы.*/
const utils_1 = require("../utils/utils");
/*Создаем middleware, имитирующий авторизацию пользователей по токену. Чтобы ее пройти нужно использовать Query-параметр
"?token=123". Проверка: http://localhost:3000/books и http://localhost:3000/books?token=123.*/
const fakeAuthMiddleware = (req, res, next) => {
    if (req.query.token === '123') {
        next();
    }
    else {
        res.sendStatus(utils_1.HTTP_STATUSES.UNAUTHORIZED_401);
    }
};
exports.fakeAuthMiddleware = fakeAuthMiddleware;
