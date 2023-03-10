/*Подключаем Express.*/
import express from 'express';
/*Импортируем ДБ.*/
import {db} from './db/db';
/*Импортируем роутеры нашего приложения.*/
import {getBooksRouter, getInterestingRouter} from './routes/books';
import {getTestsRouter} from './routes/tests';
import {getMainPageRouter} from './routes/mainpage';

/*Создаем приложение на Express.*/
export const app = express();

/*Подключаем специальный middleware из Express. Он позволит нам работать с body для отправки данных на сервер. Нужно
здесь помнить, что при использовании метода "fetch()" нужно использовать метод "JSON.stringify()" для body, чтобы
передавать его не ввиде просто объекта, а объекта превращенного в строку. Когда мы превращаем объект в строку или в
массив битов, это называется сериализация (строковая или бинарная соотвественно).*/
export const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

/*Подключаем к нашему приложению на Express роутеры. Здесь нужно указать какой-то корневой путь адреса, к которому
роутеры будут дописывать какие-то подпути в зависимости от их конфигурации.*/
app.use('/page-one', getBooksRouter(db));
app.use('/__test__', getTestsRouter(db));
app.use('/', getMainPageRouter());
app.use('/interesting', getInterestingRouter());