/*Импортируем объект "request", который позволяет делать запросы к серверу. Библиотека supertest сама поднимет сервер во
время тестирования.*/
import request from 'supertest';
/*Импортируем наше приложение на Express.*/
import {app} from '../../src/app';
/*Импортируем HTTP-статусы.*/
import {HTTP_STATUSES} from '../../src/utils/utils';
/*Импортируем модели.*/
import {CreateBookByTitleWithBodyInputModel} from '../../src/models/inputs/CreateBookByTitleWithBodyInputModel';
import {UpdateBookTitleWithBodyInputModel} from '../../src/models/inputs/UpdateBookTitleWithBodyInputModel';

/*Это тесты для локальной версии БД. Чтобы тесты отработали нужно в файле "books-service.ts" импортировать
"booksRepository" из файла "books-repository-db-local.ts".*/
describe('/books', () => {
    /*Метод "beforeAll()" позволяет запустить какой-то код перед выполнением всех тестов.*/
    beforeAll(async () => {
        /*Выполняем DELETE-запрос для очистки тестовых данных. Поскольку запрос на сервер асинхронный, поэтому
        используем async/await.*/
        await request(app).delete('/tests/wipe-data');
    });

    it('should return 404 for an empty db', async () => {
        /*Метод "expect()" сравнивает полученные данные с ожидаемыми и на основе этого сообщает пройден ли тест.*/
        await request(app)
            .get('/books')
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    });

    it('should return 404 for a non-existing book', async () => {
        await request(app)
            .get('/books/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    });

    it('should not create a book with incorrect input data', async () => {
        const data: CreateBookByTitleWithBodyInputModel = {title: ''};

        await request(app)
            .post('/books')
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400);

        await request(app)
            .get('/books')
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    });

    let createdBookOne: any = null;

    it('should create a book with correct input data', async () => {
        const data: CreateBookByTitleWithBodyInputModel = {title: 'book-five'};

        /*Запрос вернет ответ, который сохраняем в отдельную переменную.*/
        const createdResponse = await request(app)
            .post('/books')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201);

        createdBookOne = createdResponse.body;

        /*Метод "toEqual()" рекурсивно сравнивает все свойства экземпляров объектов. Он вызывает метод "Object.is()" для
        сравнения примитивных значений, что даже лучше для тестирования, чем оператор "===".*/
        expect(createdBookOne).toEqual({
            /*При помощи вызова метода "expect.any(Number)" указываем, что ожидаем любое число.*/
            id: expect.any(Number),
            title: data.title
        })

        await request(app)
            .get('/books')
            .expect(HTTP_STATUSES.OK_200, [createdBookOne]);
    });

    let createdBookTwo: any = null;

    it('create one more book with correct data', async () => {
        const data: CreateBookByTitleWithBodyInputModel = {title: 'book-six'};

        const createdResponse = await request(app)
            .post('/books')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201);

        createdBookTwo = createdResponse.body;

        expect(createdBookTwo).toEqual({
            id: expect.any(Number),
            title: data.title
        })

        await request(app)
            .get('/books')
            .expect(HTTP_STATUSES.OK_200, [createdBookOne, createdBookTwo]);
    });

    it('should not update a book with incorrect input data', async () => {
        const data: UpdateBookTitleWithBodyInputModel = {title: ''};

        await request(app)
            .put(`/books/` + createdBookOne.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400);

        await request(app)
            .get(`/books/` + createdBookOne.id)
            .expect(HTTP_STATUSES.OK_200, createdBookOne);
    });

    it('should not update a book that does not exist', async () => {
        const data: UpdateBookTitleWithBodyInputModel = {title: 'book-six'};

        await request(app)
            .put(`/books/` + 200)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400);
    });

    it('should update a book with correct input data', async () => {
        const data: UpdateBookTitleWithBodyInputModel = {title: 'book-five'};

        await request(app)
            .put(`/books/` + createdBookOne.id)
            .send(data)
            .expect(HTTP_STATUSES.OK_200);

        await request(app)
            .get(`/books/` + createdBookOne.id)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdBookOne,
                title: data.title
            });

        await request(app)
            .get(`/books/` + createdBookTwo.id)
            .expect(HTTP_STATUSES.OK_200, createdBookTwo);
    });

    it('should delete both books', async () => {
        await request(app)
            .delete(`/books/` + createdBookOne.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get(`/books/` + createdBookOne.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404);

        await request(app)
            .delete(`/books/` + createdBookTwo.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get(`/books/` + createdBookTwo.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404);

        await request(app)
            .get('/books/')
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    });
});