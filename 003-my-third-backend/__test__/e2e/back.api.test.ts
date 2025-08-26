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

    it('should return 200 for an empty db', async () => {
        /*Метод "expect()" сравнивает полученные данные с ожидаемыми и на основе этого сообщает пройден ли тест.*/
        const createdResponse = await request(app)
            .get('/books')
            .expect(HTTP_STATUSES.OK_200);

        expect(createdResponse.body).toBe('No books found');
    });

    it('should return 200 for a non-existing book', async () => {
        const createdResponse = await request(app)
            .get('/books/1')
            .expect(HTTP_STATUSES.OK_200);

        expect(createdResponse.body).toBe('No books found');
    });

    it('should not create a book with incorrect input data', async () => {
        const data: CreateBookByTitleWithBodyInputModel = {title: ''};

        await request(app)
            .post('/books')
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400);
    });

    it('should create a book with correct input data', async () => {
        const data: CreateBookByTitleWithBodyInputModel = {title: 'book-five'};

        await request(app)
            .post('/books')
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        const createdResponse = await request(app)
            .get('/books')
            .expect(HTTP_STATUSES.OK_200);

        expect(createdResponse.body).toHaveLength(1);
        expect(createdResponse.body[0].title).toBe('book-five');
    });

    it('should create one more book with correct data', async () => {
        const data: CreateBookByTitleWithBodyInputModel = {title: 'book-six'};

        await request(app)
            .post('/books')
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        const createdResponse = await request(app)
            .get('/books')
            .expect(HTTP_STATUSES.OK_200);

        expect(createdResponse.body).toHaveLength(2);
        expect(createdResponse.body[1].title).toBe('book-six');
    });

    it('should not update a book with incorrect input data', async () => {
        const data: UpdateBookTitleWithBodyInputModel = {title: ''};

        await request(app)
            .put(`/books/` + +(new Date()))
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400);
    });

    it('should update a book with correct input data', async () => {
        const data: UpdateBookTitleWithBodyInputModel = {title: 'book-seven'};

        const createdResponse = await request(app)
            .get('/books')
            .expect(HTTP_STATUSES.OK_200);

        const bookFiveID = createdResponse.body[0].id;

        await request(app)
            .put(`/books/` + bookFiveID)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get(`/books/` + bookFiveID)
            .expect(HTTP_STATUSES.OK_200, {
                id: bookFiveID,
                title: data.title
            });
    });

    it('should delete both books', async () => {
        const createdResponse = await request(app)
            .get('/books')
            .expect(HTTP_STATUSES.OK_200);

        const bookFiveID = createdResponse.body[0].id;
        const bookSixID = createdResponse.body[1].id;

        await request(app)
            .delete(`/books/` + bookFiveID)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get(`/books/` + bookFiveID)
            .expect(HTTP_STATUSES.OK_200);

        await request(app)
            .delete(`/books/` + bookSixID)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get(`/books/` + bookSixID)
            .expect(HTTP_STATUSES.OK_200);

        const createdResponseTwo = await request(app)
            .get('/books')
            .expect(HTTP_STATUSES.OK_200);

        expect(createdResponseTwo.body).toBe('No books found');
    });
});