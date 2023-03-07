"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterestingRouter = exports.getBooksRouter = exports.mapDBBookToViewModel = void 0;
/*В целях типизации импортируем Response из Express.*/
const express_1 = __importDefault(require("express"));
const utils_1 = require("../utils");
const mapDBBookToViewModel = (book) => {
    return {
        id: book.id,
        title: book.title
    };
};
exports.mapDBBookToViewModel = mapDBBookToViewModel;
const getBooksRouter = (db) => {
    /*Используем роутинг, который предоставляется в Express. Создаем роутер, которые далее конфигурируем, то есть
    описываем различные запросы, которые этот роутер должен будет обрабатывать. В конце возвращаем этот роутер,
    чтобы его можно было использовать в нашем приложении. Такой роутинг позволяет декомпозировать наше backend
    приложение удобным образом.*/
    const router = express_1.default.Router();
    /*R - Read*/
    /*У req есть свое свойство res, которое скорее всего ссылается на второй параметр res. Для уточнения generic-типов в
    Webstorm можно использовать Ctrl+P внутри "<>". При типизации запроса "req" на первом месте идут URI-параметры, мы их не
    указываем, так как не используем URI-параметры. На втором месте идет Response Body, то есть то, что мы будем возвращать,
    но этот Response Body относится к тому res внутри запроса, пока его не трогаем. На третьем месте Request Body то есть
    то, что к нам прилетает в body на запрос, но так как у нас GET-запрос, то в body ничего интересного прилетать не будет.
    На четвертом месте query-параметры, то есть req.query.

    Далее типизируем res. Там можно типизировать Response Body, то есть можно типизировать то, что должно вернуться в ответе
    на запрос.*/
    router.get('/', (req, res) => {
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
        /*Метод "map()" создает новый массив с результатом вызова указанной функции для каждого элемента массива. Хоть мы и
        указали, что в ответе клиенту должен возвращаться массив типов "BookViewModel", TypeScript все равно не рушается,
        если мы ответе отправляем клиенту массив типов "BookType", когда тип "BookType" на одно свойство больше типа
        "BookViewModel". Это утинная типизация. Чтобы избежать из-за такого поведения TypeScript проблем, перед отправкой
        клиенту данных, мы избавляемся от ненужных для него свойств при помощи метода "map()".*/
        // res.json(foundBooks.map(dbBook => mapDBBookToViewModel(dbBook)));
        res.json(foundBooks.map(exports.mapDBBookToViewModel));
        /*
        В консоли можно использовать такую команду:
        fetch('http://localhost:3000/page-one?title=two', {method: 'GET'})
            .then(res => res.json())
            .then(json => console.log(json))
        */
    });
    /*Здесь при типизации req нас интересует только первое, то есть URI-параметры, поэтому остальное можно не указывать.
    Нужно помнить, что хоть наш id является цифрой, сами URI-параметры являются строками.*/
    router.get('/:id', (req, res) => {
        /*Используем здесь ":id", чтобы работать с URI-параметром в адресной строке. Метод "find()" возвращает значение
        первого найденного в массиве элемента, которое удовлетворяет условию переданному в callback-функции. В противном
        случае возвращается undefined. То есть здесь мы ищем такой объект в массиве "db.books", у которого свойство "id"
        совпадает с URI-параметром "id", который в свою очередь находится в "req", то есть в содержащем данные о запросе,
        внутри свойства "params". Этот URI-параметр изначально строкой, поэтому приводим его числу при помощи "+".*/
        const foundBook = db.books.find(c => c.id === +req.params.id);
        /*Если нужного объекта не было найдено, то мы получим undefined, соотвественно делаем проверку на такой случай, в
        которой отправляем код сервера и выходим из функции.*/
        if (!foundBook) {
            res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.json((0, exports.mapDBBookToViewModel)(foundBook));
        /*
        В консоли можно использовать такую команду:
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
        const newBook = {
            /*"+(new Date())" - таким образом генерируем случайно число. На самом деле генерация новых id это задача
            сервера, то есть клиент не должен их сам указывать при создании нового ресурса.*/
            id: +(new Date()),
            /*Если какое-то свойство в объекте undefined, то при переводе его в JSON оно отбрасывается.*/
            title: req.body.title,
            customersCount: 0
        };
        db.books.push(newBook);
        /*При помощи метода "status()" уставливаем код ответа сервера при помощи чейнинга.*/
        res
            .status(utils_1.HTTP_STATUSES.CREATED_201)
            .json((0, exports.mapDBBookToViewModel)(newBook));
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
    router.delete('/:id', (req, res) => {
        /*Здесь мы ищем такой объект в массиве "db.books", у которого свойство "id" не совпадает с URI-параметром "id", и
        отфильтровываем его так, чтобы получился массив без этого объекта. Тем самым мы осуществляем удаление элемента.*/
        db.books = db.books.filter(c => c.id !== +req.params.id);
        res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
        /*
        В консоли можно использовать такую команду:
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
        const foundBook = db.books.find(c => c.id === +req.params.id);
        if (!foundBook) {
            res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        foundBook.title = req.body.title;
        res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
        /*
        В консоли можно использовать такую команду:
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
