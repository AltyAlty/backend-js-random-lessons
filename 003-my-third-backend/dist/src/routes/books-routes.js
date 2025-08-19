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
exports.getBooksRouter = void 0;
/*Импортируем express из Express для создания роутеров. Импортируем объекты для типизации.*/
const express_1 = __importDefault(require("express"));
/*Импортируем сервисы.*/
const books_service_1 = require("../domain/books-service");
/*Импортируем middlewares.*/
const books_middlewares_1 = require("../middlewares/books-middlewares");
/*Импортируем HTTP-статусы.*/
const utils_1 = require("../utils/utils");
/*Используем роутинг, предоставляемый Express. Создаем функцию "getBooksRouter()" для создания роутинга для книг. Внутри
создаем роутер и конфигурируем его, то есть описываем различные CRUD-запросы, которые этот роутер должен обрабатывать.
Такой подход к созданию роутеров позволяет декомпозировать backend-приложение удобным образом.

При конфигурации роутера обращаемся к его методам "get()", "post()", "delete()" и "put()" для настройки CRUD-операций.
Первым параметром эти методы получают подпуть, который будет отслеживаться какой-то CRUD-операцией. Последним параметром
эти методы принимают асинхронную функцию, которая будет срабатывать во время какой-то CRUD-операции. Используем
асинхронность, чтобы то, что возвращается функцией, оборачивалось в промис. Между первым и последним параметрами эти
методы могут принимать middlewares.

У параметра в виде асинхронной функции указываются два параметра - объекты "req" и "res". Эти параметры будут отправлены
в эти асинхронные функции автоматически при их запуске. Параметр "req" - это объект, который содержит информацию о
HTTP-запросе, поступившем от клиента. Параметр "res" - это объект, который позволяет управлять ответом сервера.

При типизации параметра "res" нужно уточнять "Response" из Express данными, которые должны возвращаться в ответе на
запрос.*/
const getBooksRouter = () => {
    /*Создаем роутер из Express.*/
    const router = express_1.default.Router();
    /*R - READ*/
    /*Конфигурируем GET-запросы для получения книг по названию при помощи Query-параметров.*/
    router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        /*Проверка работы middleware "uselessInfoMiddleware".*/
        // @ts-ignore
        console.log(req.uselessInfo);
        /*Просим сервис "booksService" найти книги по названию. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 по параметру "title" были найдены книги - используя чейнинг, при помощи метода "status()" устанавливается
        код ответа сервера, а затем при помощи метода "json()" отправляются клиенту данные по найденным книгам.
        1.2 по параметру "title" не были найдены книги - сообщается клиенту, что книг не было найдено.
        1.3 параметр "title" не был указан - возвращается клиенту данные по всем имеющимся книгам.
        2. Если сервер Mongo БД не работает - сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
        try {
            const foundBooks = yield books_service_1.booksService.findBooksByTitle((_a = req.query.title) === null || _a === void 0 ? void 0 : _a.toString());
            if (!foundBooks) {
                res.status(utils_1.HTTP_STATUSES.OK_200).json('No books found');
                return;
            }
            res.status(utils_1.HTTP_STATUSES.OK_200).json(foundBooks);
        }
        catch (error) {
            res.sendStatus(utils_1.HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
        }
        /*
        Для проверки в консоли можно использовать такие команды:

        1. Название было указано верно:
        fetch('http://localhost:3000/books?title=two', {method: 'GET'})
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json().then(json => console.log(json)) } else { return }
            })

        2. Название было указано неверно:
        fetch('http://localhost:3000/books?title=asdasdstwo', {method: 'GET'})
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json().then(json => console.log(json)) } else { return }
            })

        3. Название не было указано:
        fetch('http://localhost:3000/books', {method: 'GET'})
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json().then(json => console.log(json)) } else { return }
            })
        */
    }));
    /*Конфигурируем GET-запросы для получения книги по ID при помощи URI-параметров. При помощи ":" Express позволяет
    указывать переменные в пути. Такие переменные доступны через объект "req.params".*/
    router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        /*Просим сервис "booksService" найти книгу по ID. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 книга была найдена - возвращаются клиенту данные по найденной книге.
        1.2 книга не была найдена - сообщается клиенту, что книги не было найдено.
        2. Если сервер Mongo БД не работает - сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
        try {
            const foundBook = yield books_service_1.booksService.findBookByID(req.params.id);
            if (!foundBook) {
                res.status(utils_1.HTTP_STATUSES.OK_200).json('No books found');
                return;
            }
            res.status(utils_1.HTTP_STATUSES.OK_200).json(foundBook);
        }
        catch (error) {
            res.sendStatus(utils_1.HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
        }
        /*
        Для проверки в консоли можно использовать такие команды:

        1. ID был указан верно:
        fetch('http://localhost:3000/books/2', {method: 'GET'})
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json().then(json => console.log(json)) } else { return }
            })

        2. ID был указан неверно:
        fetch('http://localhost:3000/books/222', {method: 'GET'})
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json().then(json => console.log(json)) } else { return }
            })
        */
    }));
    /*C - CREATE*/
    /*Конфигурируем POST-запросы, содержащие тело, для создания книги, указывая название.*/
    router.post('/', books_middlewares_1.titleIsNotEmptyValidationMiddleware, books_middlewares_1.titleIsOfCorrectLengthValidationMiddleware, books_middlewares_1.titleValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        /*Просим сервис "booksService" создать новую книгу с указанным названием. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 книга была добавлена - сообщается клиенту, что книга была создана.
        1.2 книга не была добавлена - сообщается клиенту, что книга не была создана.
        2. Если сервер Mongo БД не работает - сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
        try {
            const result = yield books_service_1.booksService.createBookWithTitle(req.body.title);
            if (!result) {
                res.sendStatus(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
                return;
            }
            res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
        }
        catch (error) {
            res.sendStatus(utils_1.HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
        }
        /*
        Для проверки в консоли можно использовать такие команды:

        1. Название книги было указано:
        fetch('http://localhost:3000/books', {
            method: 'POST',
            body: JSON.stringify({title: 'book-thirty'}),
            headers: {'content-type': 'application/json'}
        })
            .then(res => console.log(res.status))

        fetch('http://localhost:3000/books', {method: 'GET'})
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json().then(json => console.log(json)) } else { return }
            })

        2. Название книги не было указано:
        fetch('http://localhost:3000/books', {
            method: 'POST',
            body: JSON.stringify({name: 'book-thirty'}),
            headers: {'content-type': 'application/json'}
        })
            .then(res => console.log(res.status))
        */
    }));
    /*D - DELETE*/
    /*Конфигурируем DELETE-запросы для удаления книги по ID при помощи URI-параметров.*/
    router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        /*Просим сервис "booksService" удалить книгу по ID. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 книга была удалена - сообщается клиенту, что книга была удалена.
        1.2 книга не была удалена - сообщается клиенту, что книга не была удалена.
        2. Если сервер Mongo БД не работает - сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
        try {
            const result = yield books_service_1.booksService.deleteBookByID(req.params.id);
            if (!result) {
                res.sendStatus(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
                return;
            }
            res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
        }
        catch (error) {
            res.sendStatus(utils_1.HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
        }
        /*
        Для проверки в консоли можно использовать такие команды:

        1. ID был указан верно:
        fetch('http://localhost:3000/books/1', {method: 'DELETE'})
            .then(res => console.log(res.status))

        fetch('http://localhost:3000/books', {method: 'GET'})
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json().then(json => console.log(json)) } else { return }
            })

        2. ID был указан неверно:
        fetch('http://localhost:3000/books/222', {method: 'DELETE'})
            .then(res => console.log(res.status))

        3. ID не был указан:
        fetch('http://localhost:3000/books', {method: 'DELETE'})
            .then(res => console.log(res.status))
        */
    }));
    /*U - UPDATE*/
    /*Конфигурируем PUT-запросы, содержащие тело, для изменения названия книги по ID при помощи URI-параметров.*/
    router.put('/:id', books_middlewares_1.titleIsNotEmptyValidationMiddleware, books_middlewares_1.titleIsOfCorrectLengthValidationMiddleware, books_middlewares_1.titleValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        /*Просим сервис "booksService" обновить название книги по ID. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 книга была обновлена - сообщается клиенту, что книга была обновлена.
        1.2 книга не была обновлена - сообщается клиенту, что книга не была обновлена.
        2. Если сервер Mongo БД не работает - сообщается клиенту об ошибке при работе с сервером Mongo БД.*/
        try {
            const result = yield books_service_1.booksService.updateBookTitleByID(req.body.title, req.params.id);
            /*Если книга не была обновления, то вернется null. Делаем проверку на такой случай.*/
            if (!result) {
                res.sendStatus(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
                return;
            }
            /*Если книга была обновления, то отправляем клиенту данные по обновленной книге по ID.*/
            res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
        }
        catch (error) {
            res.sendStatus(utils_1.HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
        }
        /*
        Для проверки в консоли можно использовать такие команды:

        1. Название и ID были указаны верно:
        fetch('http://localhost:3000/books/3', {
            method: 'PUT',
            body: JSON.stringify({title: 'book-three-three-one'}),
            headers: {'content-type': 'application/json'}
        })
            .then(res => console.log(res.status))

        fetch('http://localhost:3000/books', {method: 'GET'})
            .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json().then(json => console.log(json)) } else { return }
            })

        2. Название было указано, а ID было указано неверно:
        fetch('http://localhost:3000/books/333', {
            method: 'PUT',
            body: JSON.stringify({title: 'book-three-three-two'}),
            headers: {'content-type': 'application/json'}
        })
            .then(res => console.log(res.status))

        3. ID было указано верно, а название не было указано:
        fetch('http://localhost:3000/books/3', {
            method: 'PUT',
            body: JSON.stringify({name: 'book-three-three-three'}),
            headers: {'content-type': 'application/json'}
        })
            .then(res => console.log(res.status))

        4. Название было указано, а ID не было указано:
        fetch('http://localhost:3000/books', {
            method: 'PUT',
            body: JSON.stringify({title: 'book-three-three-four'}),
            headers: {'content-type': 'application/json'}
        })
            .then(res => console.log(res.status))

        5. Название и ID не были указаны:
        fetch('http://localhost:3000/books', {
            method: 'PUT',
            body: JSON.stringify({name: 'book-three-three-five'}),
            headers: {'content-type': 'application/json'}
        })
            .then(res => console.log(res.status))
        */
    }));
    /*Возвращаем этот роутер, чтобы использовать его в приложении.*/
    return router;
};
exports.getBooksRouter = getBooksRouter;
