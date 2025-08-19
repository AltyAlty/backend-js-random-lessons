"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestCounterMiddleware = void 0;
let requestCounter = 0;
/*Создаем middleware, подсчитывающий количество запросов.*/
const requestCounterMiddleware = (req, res, next) => {
    requestCounter++;
    console.log('Request Counter Middleware: ' + requestCounter);
    next();
};
exports.requestCounterMiddleware = requestCounterMiddleware;
