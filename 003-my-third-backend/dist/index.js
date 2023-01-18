"use strict";
/*
Установка "yarn" (после его установки, лучше не использоват одновременно с npm): npm install --global yarn
Файл "package.json" с точки зрения Node.js эта файл является определяющей какой-либо проект.
Чтобы этот файл появился нужно написать: yarn init
Если написать "yarn", то произойдет попытка определить зависимости в проекте.

Чтобы установить фреймворк "Express" нужно ввести: yarn add express

"nodemon" это программа-пакет, которая отслеживает изменение файлов и автоматически меняет сервер в браузере без
необходимости его постоянно перезапускать. Такой пакет лучше устанавливать локально и для разработки, то указывая
"--save-dev" для npm или "-D" для yarn. Для его установки нужно ввести: yarn add nodemon -D
Чтобы локально запустить nodemon нужно ввести: yarn nodemon имя_файла

Чтобы отладить программу по шагам нужно использовать флаг "--inspect": yarn nodemon --inspect имя_файла
После этого в Chrome можно открыть DevTools - Node.js

Установка Typescript, утилиты ts-node, которая нужна для полноценной работе nodemon и другого, типы для Express, типы
для Node.js (все это только для разработки):
yarn add typescript ts-node @types/express @types/node -D
Чтобы запустить компилятор Typescript локалько нужно ввести: yarn tsc имя_файла
Эта команда скомпилирует файл .ts в .js
Чтобы Typescript правильно работал, его нужно настроить при помощи команды: yarn tsc --init
После этой команды появится файл "tsconfig.js". В этом файле можно найти раздел "outDir" и указать там куда складывать
все скомпилированные файлы. Например, так: "outDir": "./dist". После этого если ввести команду "yarn tsc", то все, что
компилятор скомпилирует он положит в указанную папку.
Далее уже можно запустить скомпилированные файлы: yarn nodemon --inspect имя_файла
То есть теперь нужно каждый раз запускать команду "yarn tsc", чтобы nodemon обновил программу. Но чтобы не писать эту
команду постоянно вручную, можно указать флаг -w в отдельном терминале: yarn tsc -w
В другом терминале уже нужно запускать нужный файл .js.
Чтобы запускать сразу две эти команды, то в файл "package.json" перед разделом "dependencies" нужно добавить:
"scripts": {
    "watch": "tsc -w",
    "dev": "nodemon .\\dist\\index.js"
  },
Теперь либо можно запускать эти команды прямо из этого файла, либо нажать ПКМ на него и выбрать "Show npm Scripts",
чтобы можно было запускать эти команды в отдельном окне.
Или же можно в двух терминалах ввести "yarn watch" и "yarn dev".
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*Подключаем Express.*/
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
/*Подключаем специальный middleware из Express. Он позволит нам работать с body для отправки данных на сервер. Нужно
здесь помнить, что при использовании метода "fetch()" нужно использовать метод "JSON.stringify()" для body, чтобы
передавать его не ввиде просто объекта, а объекта превращенного в строку. Когда мы превращаем объект в строку или в
массив битов, это называется сериализация (строковая или бинарная соотвественно).*/
const jsonBodyMiddleware = express_1.default.json();
app.use(jsonBodyMiddleware);
const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    NOT_FOUND_404: 404,
    BAD_REQUEST_400: 400,
};
const db = {
    books: [
        { id: 1, title: 'book-one' },
        { id: 2, title: 'book-two' },
        { id: 3, title: 'book-three' },
        { id: 4, title: 'book-four' }
    ]
};
/*R - Read*/
/*Если будет запрос по адресу '/', то запустится указанная callback-функция. Метод "send()" это аналог "write()"
из библиотеки "http". Этот метод в зависимости от передаваемых данных сам меняет заголовок "Content-Type" в ответе. Если
передать число, то оно будет интерпретировано как код ответа от сервера.*/
app.get('/', (req, res) => {
    /*
    В консоли можно использовать такую команду:
    fetch('http://localhost:3000/', {method: 'GET'})
        .then(res => res.json())
        .then(json => console.log(json))
    */
    /*Передаем объект, чтобы можно было работать с форматом JSON.*/
    // res.send({message: 'Hello!'});
    // res.send('Hello!');
    res.send('<h1>Hello!</h1>');
    // res.send(404);
    /*Для передачи JSON-данных можно использовать метод "json()". Этот метод преобразовывать данные в JSON сам.*/
    // res.json({message: 'Hello!'});
    // res.json('Hello!');
    // res.json(404);
    /*Для отправки кодов ответов сервер нужно использовать метод "sendStatus()".*/
    // res.sendStatus(404);
});
app.get('/page-one', (req, res) => {
    let foundBooks = db.books;
    /*Метод "filter()" создает новый массив со всеми элементами, прошедшими проверку, задаваемую в передаваемой
    функции. Метод "indexOf()" возвращает первый индекс, по которому данный элемент может быть найден в массиве или -1,
    если такого индекса нет. Здесь мы берем каждый объект из массива "db.books", у каждого этого объекта берем свойство
    "title", которое является строкой. Потом смотрим в этой строке с какого символа начинается текст, переданный в
    параметре метода "indexOf()". Если указанный текст будет имется, то всегда будет возвращать число отлично от -1,
    соотственно метод "filter()" в нашем случае не возьмет те объекты в массиве "db.books", в которых было возвращено
    методом "indexOf()" числа равные или меньшие -1. То есть в итоге мы получим массив только с теми книгами, чей
    заголовок совпадает указанным нами query-параметром, который находится в находится в "req", то есть в содержащем
    данные о запросе объекте, внутри свойства "query".*/
    if (req.query.title) {
        foundBooks = foundBooks
            .filter(c => c.title.indexOf(req.query.title) > -1);
    }
    res.json(foundBooks);
    /*
    В консоли можно использовать такую команду:
    fetch('http://localhost:3000/page-one?title=two', {method: 'GET'})
        .then(res => res.json())
        .then(json => console.log(json))
    */
});
app.get('/page-one/:id', (req, res) => {
    /*Используем здесь ":id", чтобы работать с URI-параметром в адресной строке. Метод "find()" возвращает значение
    первого найденного в массиве элемента, которое удовлетворяет условию переданному в callback-функции. В противном
    случае возвращается undefined. То есть здесь мы ищем такой объект в массиве "db.books", у которого свойство "id"
    совпадает с URI-параметром "id", который в свою очередь находится в "req", то есть в содержащем данные о запросе,
    внутри свойства "params". Этот URI-параметр изначально строкой, поэтому приводим его числу при помощи "+".*/
    const foundBook = db.books.find(c => c.id === +req.params.id);
    /*Если нужного объекта не было найдено, то мы получим undefined, соотвественно делаем проверку на такой случай, в
    которой отправляем код сервера и выходим из функции.*/
    if (!foundBook) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(foundBook);
    /*
    В консоли можно использовать такую команду:
    fetch('http://localhost:3000/page-one/2', {method: 'GET'})
        .then(res => res.json())
        .then(json => console.log(json))
    */
});
/*C - Create*/
app.post('/page-one', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const newBook = {
        /*"+(new Date())" - таким образом генерируем случайно число. На самом деле генерация новых id это задача
        сервера, то есть клиент не должен их сам указывать при создании нового ресурса.*/
        id: +(new Date()),
        /*Если какое-то свойство в объекте undefined, то при переводе его в JSON оно отбрасывается.*/
        title: req.body.title
    };
    db.books.push(newBook);
    /*При помощи метода "status()" уставливаем код ответа сервера при помощи чейнинга.*/
    res
        .status(HTTP_STATUSES.CREATED_201)
        .json(newBook);
    // res.status(201);
    // res.json(newBook);
    /*
    В консоли можно использовать такую команду:
    fetch('http://localhost:3000/page-one', {method: 'POST', body: JSON.stringify({title: 'book-five'}),
    headers: {
        'content-type': 'application/json'
    }})
        .then(res => res.json())
        .then(json => console.log(json))
    */
});
/*D - Delete*/
app.delete('/page-one/:id', (req, res) => {
    /*Здесь мы ищем такой объект в массиве "db.books", у которого свойство "id" не совпадает с URI-параметром "id", и
    отфильтровываем его так, чтобы получился массив без этого объекта. Тем самым мы осуществляем удаление элемента.*/
    db.books = db.books.filter(c => c.id !== +req.params.id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    /*
    В консоли можно использовать такую команду:
    fetch('http://localhost:3000/page-one/1', {method: 'DELETE'})
        .then(res => res.json())
        .then(json => console.log(json))
    */
});
/*U - Update*/
app.put('/page-one/:id', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const foundBook = db.books.find(c => c.id === +req.params.id);
    if (!foundBook) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    foundBook.title = req.body.title;
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    /*
    В консоли можно использовать такую команду:
    fetch('http://localhost:3000/page-one/1', {method: 'PUT', body: JSON.stringify({title: 'book-one-one'}),
    headers: {
        'content-type': 'application/json'
    }})
        .then(res => res.json())
        .then(json => console.log(json))
    */
});
/*Устанавлиаем какой порт прослушивается.*/
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
