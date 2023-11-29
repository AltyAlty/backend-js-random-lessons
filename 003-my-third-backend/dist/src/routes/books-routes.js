"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthorsRouter = exports.requestCounterMiddleware = exports.authGuardMiddleware = exports.uselessMiddleware = exports.getInterestingRouter = exports.getBooksRouter = void 0;
/*В целях типизации импортируем Response из Express.*/
const express_1 = __importDefault(require("express"));
const utils_1 = require("../utils");
const books_service_1 = require("../domain/books-service");
const books_middlewares_1 = require("../middlewares/books-middlewares");
const getBooksRouter = () => {
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
    router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        /*Используем "await", чтобы дождаться, когда зарезольвиться промис, чтобы получить найденные книги. Для
        этого нашу функцию сделали асинхронной при помощи "async".*/
        const foundBooks = yield books_service_1.booksService.findBooksByTitle((_a = req.query.title) === null || _a === void 0 ? void 0 : _a.toString());
        /*"performance.now()" это метод из Node.js, который возвращает текущую метку времени в миллисекундах, где 0
        представляет начало текущего процесса Node.js. Имитируем задержку в 3 секунды. Если после этого запроса,
        сразу сделать какой-то другой запрос, то оба запроса будут ждать эту задержку в 3 секунды.*/
        // let start = performance.now();
        // console.log(start);
        // while (performance.now() - start < 3000) {
        //     console.log(performance.now() - start);
        // }
        /*Здесь же поскольку метод "setInterval()" работает асинхронно, то 3-х секундная задержка повлияет только
        на этот запрос.*/
        // setInterval(() => {
        //     res.json(foundBooks);
        // }, 3000);
        res.json(foundBooks);
        /*В консоли можно использовать такую команду:
        fetch('http://localhost:3000/page-one?title=two', {method: 'GET'})
            .then(res => res.json())
            .then(json => console.log(json))
        */
    }));
    /*Здесь при типизации req нас интересует только первое, то есть URI-параметры, поэтому остальное можно не указывать.
    Нужно помнить, что хоть наш id является цифрой, сами URI-параметры являются строками.*/
    router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const foundBook = yield books_service_1.booksService.findBookByID(req.params.id);
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
    }));
    /*C - Create*/
    router.post('/', books_middlewares_1.titleIsNotEmptyValidationMiddleware, books_middlewares_1.titleIsOfCorrectLengthValidationMiddleware, books_middlewares_1.titleValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const createdBook = yield books_service_1.booksService.createBookWithTitle(req.body.title);
        /*При помощи метода "status()" устанавливаем код ответа сервера при помощи чейнинга.*/
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
    }));
    /*D - Delete*/
    router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield books_service_1.booksService.deleteBookByID(req.params.id);
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
    }));
    /*U - Update*/
    router.put('/:id', books_middlewares_1.titleIsNotEmptyValidationMiddleware, books_middlewares_1.titleIsOfCorrectLengthValidationMiddleware, books_middlewares_1.titleValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const foundBook = yield books_service_1.booksService.updateBookTitleByID(req.body.title, req.params.id);
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
    }));
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
/*Создаем свой middleware, который предоставляет дополнительные данные.*/
const uselessMiddleware = (req, res, next) => {
    // @ts-ignore
    req.someInfo = 'Ok';
    next(); // Этот метод нужен для работы цепочки handler-функций.
};
exports.uselessMiddleware = uselessMiddleware;
/*Создаем свой middleware, который имитирует проверку на логинизацию, чтобы ее пройти нужно использовать query-параметр
?token=123*/
const authGuardMiddleware = (req, res, next) => {
    if (req.query.token === '123') {
        next();
    }
    else {
        res.sendStatus(utils_1.HTTP_STATUSES.UNAUTHORIZED_401);
    }
};
exports.authGuardMiddleware = authGuardMiddleware;
let requestCounter = 0;
/*Создаем свой middleware, который считает количество запросов.*/
const requestCounterMiddleware = (req, res, next) => {
    requestCounter++;
    next();
};
exports.requestCounterMiddleware = requestCounterMiddleware;
const getAuthorsRouter = () => {
    const router = express_1.default.Router();
    /*Можно задавать больше одной handler-функции, тем самым реализуя middleware.*/
    // router.get('/', uselessMiddleware, (req: Request, res: Response) => {
    //         // @ts-ignore
    //         const someInfo = req.someInfo;
    //         res.json({someInfo: someInfo + ` let's go`});
    //     }
    // );
    /*Также можно указать свой middleware в "app.use()".*/
    router.get('/', (req, res) => {
        // @ts-ignore
        const someInfo = req.someInfo;
        res.json({ someInfo: someInfo + ` let's go` + ` requests: ` + requestCounter });
    });
    return router;
};
exports.getAuthorsRouter = getAuthorsRouter;
