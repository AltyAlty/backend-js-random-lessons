/*Подключаем Express.*/
import express from 'express';
/*Импортируем роутеры нашего приложения.*/
import {
    authGuardMiddleware,
    getAuthorsRouter,
    getBooksRouter,
    getInterestingRouter, requestCounterMiddleware,
    uselessMiddleware
} from './routes/books-routes';
import {getTestsRouter} from './routes/tests-routes';
import {getMainPageRouter} from './routes/mainpage-routes';

/*Создаем приложение на Express.*/
export const app = express();

/*Подключаем специальный middleware из Express. Он позволит нам работать с body для отправки данных на сервер. Нужно
здесь помнить, что при использовании метода "fetch()" нужно использовать метод "JSON.stringify()" для body, чтобы
передавать его не ввиде просто объекта, а объекта превращенного в строку. Когда мы превращаем объект в строку или в
массив битов, это называется сериализация (строковая или бинарная соотвественно).*/
export const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

/*Подключаем наши собственные middleware. Порядок middleware важен.*/
app.use(requestCounterMiddleware);
app.use(uselessMiddleware);
// app.use(authGuardMiddleware);

/*Подключаем к нашему приложению на Express роутеры. Здесь нужно указать какой-то корневой путь адреса, к которому
роутеры будут дописывать какие-то подпути в за висимости от их конфигурации.*/
app.use('/page-one', getBooksRouter());
app.use('/__test__', getTestsRouter());
app.use('/', getMainPageRouter());
app.use('/interesting', getInterestingRouter());
app.use('/authors', getAuthorsRouter());