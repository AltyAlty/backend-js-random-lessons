/*Подключаем Express.*/
import express from 'express';
/*Импортируем ДБ.*/
import {db} from './db/db';
import {addBooksRoutes} from './routes/books';
import {addTestsRoutes} from './routes/tests';


export const app = express();

/*Подключаем специальный middleware из Express. Он позволит нам работать с body для отправки данных на сервер. Нужно
здесь помнить, что при использовании метода "fetch()" нужно использовать метод "JSON.stringify()" для body, чтобы
передавать его не ввиде просто объекта, а объекта превращенного в строку. Когда мы превращаем объект в строку или в
массив битов, это называется сериализация (строковая или бинарная соотвественно).*/
export const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

addBooksRoutes(app, db);
addTestsRoutes(app, db);