/*Импортируем express из Express для создания приложения на Express.*/
import express from 'express';
/*Импортируем функции, создающие роутеры.*/
import {getBooksRouter} from './routes/books-routes';
import {getTestsRouter} from './routes/tests-routes';
import {getRequestsOrderRouter} from './routes/requests-order-routes';
import {getMainPageRouter} from './routes/main-page-routes';
import {getUsersRouter} from './routes/users-routes';
import {getAuthRouter} from './routes/auth-routes';
import {getFeedbacksRouter} from './routes/feedbacks-routes';
import {getEmailRouter} from './routes/email-routes';
/*Импортируем middlewares.*/
import {requestCounterMiddleware} from './middlewares/request-counter-middleware';
import {uselessInfoMiddleware} from './middlewares/useless-info-middleware';
import {fakeAuthorizationMiddleware} from './middlewares/fake-authorization-middleware';

/*Создаем приложение на Express.*/
export const app = express();

/*Подключаем специальный middleware из Express, который позволяет работать с body для отправки данных на сервер. При
использовании метода "fetch()" нужно использовать метод "JSON.stringify()" для body, чтобы передавать его не в виде
простого объекта, а в виде объекта превращенного в строку. Превращение объекта в строку или в массив битов называется
сериализацией (строковой или бинарной соответственно).*/
export const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

/*Подключаем middlewares. Порядок подключения middlewares важен.*/
app.use(requestCounterMiddleware);
app.use(uselessInfoMiddleware);
// app.use(fakeAuthorizationMiddleware);

/*Подключаем роутеры. Здесь нужно указывать корневой путь адреса, к которому роутеры будут дописывать подпути в
зависимости от их конфигурации.*/
app.use('/books', getBooksRouter());
app.use('/tests', getTestsRouter());
app.use('/requests-order', getRequestsOrderRouter());
app.use('/', getMainPageRouter());
app.use('/users', getUsersRouter());
app.use('/auth', getAuthRouter());
app.use('/feedbacks', getFeedbacksRouter());
app.use('/email', getEmailRouter());