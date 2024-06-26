"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonBodyMiddleware = exports.app = void 0;
/*Подключаем Express.*/
const express_1 = __importDefault(require("express"));
/*Импортируем роутеры нашего приложения.*/
const books_routes_1 = require("./routes/books-routes");
const tests_routes_1 = require("./routes/tests-routes");
const mainpage_routes_1 = require("./routes/mainpage-routes");
const users_routes_1 = require("./routes/users-routes");
const auth_routes_1 = require("./routes/auth/auth-routes");
const feedbacks_routes_1 = require("./routes/feedbacks-routes");
const email_router_1 = require("./routes/email-router");
/*Создаем приложение на Express.*/
exports.app = (0, express_1.default)();
/*Подключаем специальный middleware из Express. Он позволит нам работать с body для отправки данных на сервер. Нужно
здесь помнить, что при использовании метода "fetch()" нужно использовать метод "JSON.stringify()" для body, чтобы
передавать его не ввиде просто объекта, а объекта превращенного в строку. Когда мы превращаем объект в строку или в
массив битов, это называется сериализация (строковая или бинарная соотвественно).*/
exports.jsonBodyMiddleware = express_1.default.json();
exports.app.use(exports.jsonBodyMiddleware);
/*Подключаем наши собственные middleware. Порядок middleware важен.*/
exports.app.use(books_routes_1.requestCounterMiddleware);
exports.app.use(books_routes_1.uselessMiddleware);
// app.use(authGuardMiddleware);
/*Подключаем к нашему приложению на Express роутеры. Здесь нужно указать какой-то корневой путь адреса, к которому
роутеры будут дописывать какие-то подпути в за висимости от их конфигурации.*/
exports.app.use('/page-one', (0, books_routes_1.getBooksRouter)());
exports.app.use('/__test__', (0, tests_routes_1.getTestsRouter)());
exports.app.use('/', (0, mainpage_routes_1.getMainPageRouter)());
exports.app.use('/interesting', (0, books_routes_1.getInterestingRouter)());
exports.app.use('/authors', (0, books_routes_1.getAuthorsRouter)());
exports.app.use('/registration', (0, users_routes_1.getUsersRouter)());
exports.app.use('/auth', (0, auth_routes_1.getAuthRouter)());
exports.app.use('/feedback', (0, feedbacks_routes_1.getFeedbacksRouter)());
exports.app.use('/email', (0, email_router_1.getEmailRouter)());
