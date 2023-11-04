"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterestingRouter = exports.getBooksRouter = void 0;
/*В целях типизации импортируем Response из Express.*/
const express_1 = __importDefault(require("express"));
const utils_1 = require("../utils");
const books_repository_1 = require("../repositories/books-repository");
const getBooksRouter = (db) => {
    /*Используем роутинг, который предоставляется в Express. Создаем роутер, которые далее конфигурируем, то есть
    описываем различные запросы, которые этот роутер должен будет обрабатывать. В конце возвращаем этот роутер,
    чтобы его можно было использовать в нашем приложении. Такой роутинг позволяет декомпозировать наше backend
    приложение удобным образом.*/
    const router = express_1.default.Router();
    /*R - Read*/
    /*У req есть свое свойство res, которое скорее всего ссылается на второй параметр res. Для уточнения generic-типов в
    Webstorm можно использовать Ctrl+P внутри "<>". При типизации запроса "req" на первом месте идут URI-параметры, мы
    их не указываем, так как не используем URI-параметры. На втором месте идет Response Body, то есть то, что мы будем
    возвращать, но этот Response Body относится к тому res внутри запроса, пока его не трогаем. На третьем месте Request
    Body то есть то, что к нам прилетает в body на запрос, но так как у нас GET-запрос, то в body ничего интересного
    прилетать не будет. На четвертом месте query-параметры, то есть req.query.

    Далее типизируем res. Там можно типизировать Response Body, то есть можно типизировать то, что должно вернуться в
    ответе на запрос.*/
    router.get('/', (req, res) => {
        var _a;
        const foundBooks = books_repository_1.booksRepository.findBooksByTitle((_a = req.query.title) === null || _a === void 0 ? void 0 : _a.toString(), db);
        res.json(foundBooks);
        /*В консоли можно использовать такую команду:
        fetch('http://localhost:3000/page-one?title=two', {method: 'GET'})
            .then(res => res.json())
            .then(json => console.log(json))
        */
    });
    /*Здесь при типизации req нас интересует только первое, то есть URI-параметры, поэтому остальное можно не указывать.
    Нужно помнить, что хоть наш id является цифрой, сами URI-параметры являются строками.*/
    router.get('/:id', (req, res) => {
        const foundBook = books_repository_1.booksRepository.findBookByID(req.params.id, db);
        /*Если нужного объекта не было найдено, то мы получим undefined, соотвественно делаем проверку на такой случай,
        в которой отправляем код сервера и выходим из функции.*/
        if (!foundBook) {
            res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.json(foundBook);
        /*В консоли можно использовать такую команду:
        fetch('http://localhost:3000/page-one/2', {method: 'GET'})
            .then(res => res.json())
            .then(json => console.log(json))
        */
    });
    /*C - Create*/
    router.post('/', (req, res) => {
        if (!req.body.title) {
            res.sendStatus(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        const createdBook = books_repository_1.booksRepository.createBookWithTitle(req.body.title, db);
        /*При помощи метода "status()" уставливаем код ответа сервера при помощи чейнинга.*/
        res
            .status(utils_1.HTTP_STATUSES.CREATED_201)
            .json(createdBook);
        // res.status(201);
        // res.json(createdBook);
        /*В консоли можно использовать такую команду:
        fetch('http://localhost:3000/page-one', {method: 'POST', body: JSON.stringify({title: 'book-five'}),
        headers: {
            'content-type': 'application/json'
        }})
            .then(res => res.json())
            .then(json => console.log(json))
        */
    });
    /*D - Delete*/
    router.delete('/:id', (req, res) => {
        books_repository_1.booksRepository.deleteBookByID(req.params.id, db);
        res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
        /*В консоли можно использовать такую команду:
        fetch('http://localhost:3000/page-one/1', {method: 'DELETE'})
            .then(res => res.json())
            .then(json => console.log(json))

        Для проверки удаления можно использовать такую команду:
        fetch('http://localhost:3000/page-one', {method: 'GET'})
            .then(res => res.json())
            .then(json => console.log(json))
        */
    });
    /*U - Update*/
    router.put('/:id', (req, res) => {
        if (!req.body.title) {
            res.sendStatus(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        const foundBook = books_repository_1.booksRepository.updateBookTitleByID(req.body.title, req.params.id, db);
        if (!foundBook) {
            res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
        /*В консоли можно использовать такую команду:
        fetch('http://localhost:3000/page-one/3', {method: 'PUT', body: JSON.stringify({title: 'book-one-one'}),
            headers: {
                'content-type': 'application/json'
            }})
                .then(res => res.json())
                .then(json => console.log(json))

        Для проверки изменения можно использовать такую команду:
        fetch('http://localhost:3000/page-one', {method: 'GET'})
            .then(res => res.json())
            .then(json => console.log(json))
        */
    });
    return router;
};
exports.getBooksRouter = getBooksRouter;
const getInterestingRouter = () => {
    const router = express_1.default.Router();
    /*Создали специальный роутер, который обслуживает два запроса. Если перейти по адресу "/interesting/books", то
    мы попадем во второй запрос, то есть увидим "data by id: books", хотя возможно мы хотели бы увидеть по этому
    адресу "books handler". Но если поменять местами указанные ниже запросы, то мы уже увидим "books handler", что
    скорее всего, является желаемым поведением. Из этого следует, что порядок регистрации маршрутов важен. В данном
    случае первый запрос будет проверяться приложением первым и покрывать любой указанный текст после "/interesting/",
    тем самым не давая возможности сработать второму запросу. Если же эти два запроса указать в обратном порядке, то
    сначала будет проверяться приложением запрос с "books handler", и только если он не удовлетворит приложение, уже
    после этого сработает запрос с "data by id: ".
    Чтобы ограничить использование параметров, можно использовать регулярные выражения. Например, если в первом запросе
    указать "/:id([0-9]+)" вместо "/:id", то он будет обрабатывать параметры, состоящие только из цифр, что тоже решит
    ранее указанную нашу проблему.*/
    router.get('/:id', (req, res) => {
        res.json({ title: 'data by id: ' + req.params.id });
    });
    router.get('/books', (req, res) => {
        res.json({ title: 'books handler' });
    });
    return router;
};
exports.getInterestingRouter = getInterestingRouter;
