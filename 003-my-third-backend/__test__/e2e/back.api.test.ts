/*Импортируем библиотеку "request", которая позволяет делать запросы к серверу. supertest сам поднимет наш сервер во
время тестирования.*/
import request from 'supertest';
import {CreateBookModel} from '../../src/models/CreateBookModel';
import {UpdateBookModel} from '../../src/models/UpdateBookModel';
import {HTTP_STATUSES} from '../../src/utils/utils';
import {app} from '../../src/app';

/*Это тесты для локальной версии БД.*/
describe('/page-one', () => {
    /*Метод "beforeAll()" позволяет запустить какой-то код перед выполнением всех тестов.*/
    beforeAll(async () => {
        await request(app).delete('/__test__/data');
    });

    it('should return 200 and an empty array', async () => {
        /*Поскольку запрос на сервер ассинхронный, то используем async/await. Метод "get" позволяет делать GET-запрос на
        указанный URL. Метод "expect()" сравнивает, что он получили с тем, что мы указали, и на основе этого говорит
        пройден ли был тест. В данном случае придет код ответа сервера и какие-то данные.*/
        await request(app)
            .get('/page-one')
            .expect(HTTP_STATUSES.OK_200, []);
    });

    it('should return 404 for non-existing book', async () => {
        /*Поскольку запрос на сервер ассинхронный, то используем async/await. Метод "get" позволяет делать GET-запрос на
        указанный URL. Метод "expect()" сравнивает, что он получили с тем, что мы указали, и на основе этого говорит
        пройден ли был тест. В данном случае придет код ответа сервера и какие-то данные.*/
        await request(app)
            .get('/page-one/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    });

    it('should not create a book with incorrect input data', async () => {
        const data: CreateBookModel = {title: ''};

        /*Поскольку запрос на сервер ассинхронный, то используем async/await. Метод "get" позволяет делать GET-запрос на
        указанный URL. Метод "expect()" сравнивает, что он получили с тем, что мы указали, и на основе этого говорит
        пройден ли был тест. В данном случае придет код ответа сервера и какие-то данные.*/
        await request(app)
            .post('/page-one')
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400);

        await request(app)
            .get('/page-one')
            .expect(HTTP_STATUSES.OK_200, []);
    });

    let createdBookOne: any = null;

    it('should create a book with correct input data', async () => {
        const data: CreateBookModel = {title: 'book-five'};

        /*Запрос вернет ответ, который мы сохраняем в отдельную переменную.*/
        const createdResponse = await request(app)
            .post('/page-one')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201);

        createdBookOne = createdResponse.body;

        /*Метод "toEqual()" рекурсивно сравнивает все свойства экземпляров объектов. Он вызывает Object.is для сравнения
        примитивных значений, что даже лучше для тестирования, чем оператор "===" строгого равенства.*/
        expect(createdBookOne).toEqual({
            /*При помощи "expect.any(Number)" указываем, что ожидаем любое число.*/
            id: expect.any(Number),
            title: data.title
        })

        await request(app)
            .get('/page-one')
            .expect(HTTP_STATUSES.OK_200, [createdBookOne]);
    });

    let createdBookTwo: any = null;

    it('create one more book with correct data', async () => {
        const data: CreateBookModel = {title: 'book-six'};

        const createdResponse = await request(app)
            .post('/page-one')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201);

        createdBookTwo = createdResponse.body;

        expect(createdBookTwo).toEqual({
            id: expect.any(Number),
            title: data.title
        })

        await request(app)
            .get('/page-one')
            .expect(HTTP_STATUSES.OK_200, [createdBookOne, createdBookTwo]);
    });

    it('should not update a book with incorrect input data', async () => {
        const data: UpdateBookModel = {title: ''};

        await request(app)
            .put(`/page-one/` + createdBookOne.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400);

        await request(app)
            .get(`/page-one/` + createdBookOne.id)
            .expect(HTTP_STATUSES.OK_200, createdBookOne);
    });

    it('should not update a book that does not exist', async () => {
        const data: UpdateBookModel = {title: 'book-six'};

        await request(app)
            .put(`/page-one/` + 200)
            .send(data)
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    });

    it('should update a book with correct input data', async () => {
        const data: UpdateBookModel = {title: 'book-five'};

        await request(app)
            .put(`/page-one/` + createdBookOne.id)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get(`/page-one/` + createdBookOne.id)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdBookOne,
                title: data.title
            });

        await request(app)
            .get(`/page-one/` + createdBookTwo.id)
            .expect(HTTP_STATUSES.OK_200, createdBookTwo);
    });

    it('should delete both books', async () => {
        await request(app)
            .delete(`/page-one/` + createdBookOne.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get(`/page-one/` + createdBookOne.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404);

        await request(app)
            .delete(`/page-one/` + createdBookTwo.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get(`/page-one/` + createdBookTwo.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404);

        await request(app)
            .get('/page-one/')
            .expect(HTTP_STATUSES.OK_200, []);
    });
});