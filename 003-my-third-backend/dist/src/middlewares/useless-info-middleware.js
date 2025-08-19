"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uselessInfoMiddleware = void 0;
/*Создаем middleware, предоставляющий дополнительные данные.*/
const uselessInfoMiddleware = (req, res, next) => {
    // @ts-ignore
    req.uselessInfo = 'Some useless info';
    /*Метод "next()" нужен для работы цепочки handler-функций.*/
    next();
};
exports.uselessInfoMiddleware = uselessInfoMiddleware;
