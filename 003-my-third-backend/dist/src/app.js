"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonBodyMiddleware = exports.app = void 0;
/*Импортируем express из Express для создания приложения на Express.*/
const express_1 = __importDefault(require("express"));
/*Импортируем функции, создающие роутеры.*/
const books_routes_1 = require("./routes/books-routes");
const tests_routes_1 = require("./routes/tests-routes");
const requests_order_routes_1 = require("./routes/requests-order-routes");
const main_page_routes_1 = require("./routes/main-page-routes");
const users_routes_1 = require("./routes/users-routes");
const auth_routes_1 = require("./routes/auth-routes");
const feedbacks_routes_1 = require("./routes/feedbacks-routes");
const email_routes_1 = require("./routes/email-routes");
/*Импортируем middlewares.*/
const request_counter_middleware_1 = require("./middlewares/request-counter-middleware");
const useless_info_middleware_1 = require("./middlewares/useless-info-middleware");
/*Создаем приложение на Express.*/
exports.app = (0, express_1.default)();
/*Подключаем специальный middleware из Express, который позволяет работать с body для отправки данных на сервер. При
использовании метода "fetch()" нужно использовать метод "JSON.stringify()" для body, чтобы передавать его не в виде
простого объекта, а в виде объекта превращенного в строку. Превращение объекта в строку или в массив битов называется
сериализацией (строковой или бинарной соответственно).*/
exports.jsonBodyMiddleware = express_1.default.json();
exports.app.use(exports.jsonBodyMiddleware);
/*Подключаем middlewares. Порядок подключения middlewares важен.*/
exports.app.use(request_counter_middleware_1.requestCounterMiddleware);
exports.app.use(useless_info_middleware_1.uselessInfoMiddleware);
// app.use(fakeAuthMiddleware);
/*Подключаем роутеры. Здесь нужно указывать корневой путь адреса, к которому роутеры будут дописывать подпути в
зависимости от их конфигурации.*/
exports.app.use('/books', (0, books_routes_1.getBooksRouter)());
exports.app.use('/tests', (0, tests_routes_1.getTestsRouter)());
exports.app.use('/requests-order', (0, requests_order_routes_1.getRequestsOrderRouter)());
exports.app.use('/', (0, main_page_routes_1.getMainPageRouter)());
exports.app.use('/users', (0, users_routes_1.getUsersRouter)());
exports.app.use('/auth', (0, auth_routes_1.getAuthRouter)());
exports.app.use('/feedbacks', (0, feedbacks_routes_1.getFeedbacksRouter)());
exports.app.use('/email', (0, email_routes_1.getEmailRouter)());
