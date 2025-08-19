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
/*Импортируем объект "request", который позволяет делать запросы к серверу. Библиотека supertest сама поднимет сервер во
время тестирования.*/
const supertest_1 = __importDefault(require("supertest"));
/*Импортируем наше приложение на Express.*/
const app_1 = require("../../src/app");
/*Импортируем HTTP-статусы.*/
const utils_1 = require("../../src/utils/utils");
/*Это тесты для локальной версии БД. Чтобы тесты отработали нужно в файле "books-service.ts" импортировать
"booksRepository" из файла "books-repository-db-local.ts".*/
describe('/books', () => {
    /*Метод "beforeAll()" позволяет запустить какой-то код перед выполнением всех тестов.*/
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        /*Выполняем DELETE-запрос для очистки тестовых данных. Поскольку запрос на сервер асинхронный, поэтому
        используем async/await.*/
        yield (0, supertest_1.default)(app_1.app).delete('/tests/wipe-data');
    }));
    it('should return 404 for an empty db', () => __awaiter(void 0, void 0, void 0, function* () {
        /*Метод "expect()" сравнивает полученные данные с ожидаемыми и на основе этого сообщает пройден ли тест.*/
        yield (0, supertest_1.default)(app_1.app)
            .get('/books')
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it('should return 404 for a non-existing book', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get('/books/1')
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it('should not create a book with incorrect input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: '' };
        yield (0, supertest_1.default)(app_1.app)
            .post('/books')
            .send(data)
            .expect(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
        yield (0, supertest_1.default)(app_1.app)
            .get('/books')
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    let createdBookOne = null;
    it('should create a book with correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'book-five' };
        /*Запрос вернет ответ, который сохраняем в отдельную переменную.*/
        const createdResponse = yield (0, supertest_1.default)(app_1.app)
            .post('/books')
            .send(data)
            .expect(utils_1.HTTP_STATUSES.CREATED_201);
        createdBookOne = createdResponse.body;
        /*Метод "toEqual()" рекурсивно сравнивает все свойства экземпляров объектов. Он вызывает метод "Object.is()" для
        сравнения примитивных значений, что даже лучше для тестирования, чем оператор "===".*/
        expect(createdBookOne).toEqual({
            /*При помощи вызова метода "expect.any(Number)" указываем, что ожидаем любое число.*/
            id: expect.any(Number),
            title: data.title
        });
        yield (0, supertest_1.default)(app_1.app)
            .get('/books')
            .expect(utils_1.HTTP_STATUSES.OK_200, [createdBookOne]);
    }));
    let createdBookTwo = null;
    it('create one more book with correct data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'book-six' };
        const createdResponse = yield (0, supertest_1.default)(app_1.app)
            .post('/books')
            .send(data)
            .expect(utils_1.HTTP_STATUSES.CREATED_201);
        createdBookTwo = createdResponse.body;
        expect(createdBookTwo).toEqual({
            id: expect.any(Number),
            title: data.title
        });
        yield (0, supertest_1.default)(app_1.app)
            .get('/books')
            .expect(utils_1.HTTP_STATUSES.OK_200, [createdBookOne, createdBookTwo]);
    }));
    it('should not update a book with incorrect input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: '' };
        yield (0, supertest_1.default)(app_1.app)
            .put(`/books/` + createdBookOne.id)
            .send(data)
            .expect(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
        yield (0, supertest_1.default)(app_1.app)
            .get(`/books/` + createdBookOne.id)
            .expect(utils_1.HTTP_STATUSES.OK_200, createdBookOne);
    }));
    it('should not update a book that does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'book-six' };
        yield (0, supertest_1.default)(app_1.app)
            .put(`/books/` + 200)
            .send(data)
            .expect(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
    }));
    it('should update a book with correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'book-five' };
        yield (0, supertest_1.default)(app_1.app)
            .put(`/books/` + createdBookOne.id)
            .send(data)
            .expect(utils_1.HTTP_STATUSES.OK_200);
        yield (0, supertest_1.default)(app_1.app)
            .get(`/books/` + createdBookOne.id)
            .expect(utils_1.HTTP_STATUSES.OK_200, Object.assign(Object.assign({}, createdBookOne), { title: data.title }));
        yield (0, supertest_1.default)(app_1.app)
            .get(`/books/` + createdBookTwo.id)
            .expect(utils_1.HTTP_STATUSES.OK_200, createdBookTwo);
    }));
    it('should delete both books', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .delete(`/books/` + createdBookOne.id)
            .expect(utils_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(app_1.app)
            .get(`/books/` + createdBookOne.id)
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
        yield (0, supertest_1.default)(app_1.app)
            .delete(`/books/` + createdBookTwo.id)
            .expect(utils_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(app_1.app)
            .get(`/books/` + createdBookTwo.id)
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
        yield (0, supertest_1.default)(app_1.app)
            .get('/books/')
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
});
