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
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRepository = void 0;
/*Импортируем функцию "mapBookDBTypeToViewModel()" для преобразования объектов типа "BookDBType" в объекты типа
"BookViewModel".*/
const books_service_1 = require("../../domain/books-service");
/*Импортируем Mongoose модели.*/
const schemas_1 = require("../../db/schemas/schemas");
/*Создаем репозиторий "booksRepository" для работы с данными по книгам из Mongo БД.*/
exports.booksRepository = {
    /*Создаем метод "findBooksByTitle()" для поиска книг по названию в Mongo БД.*/
    findBooksByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Создаем переменную "foundBooks" для хранения найденных книг по названию.*/
            let foundBooks;
            /*Ищем книги по названию в Mongo БД. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 по параметру "title" были найдены книги - возвращается массив с найденными книгами в BLL.
            1.2 по параметру "title" не были найдены книги - возвращается null в BLL.
            1.3 параметр "title" не был указан - возвращается массив со всеми книгами в BLL.
            2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
            try {
                // if (title) {
                //     /*Метод "toArray()" создает новый экземпляр массива, заполненный элементами, полученными из
                //     итератора.*/
                //     foundBooks = await booksCollection.find({title: {$regex: title}}).toArray();
                //     if (foundBooks.length === 0) return null;
                // } else {
                //     foundBooks = await booksCollection.find({}).toArray();
                // }
                /*Аналог через Mongoose.*/
                if (title) {
                    /*"$options: 'i'" делает поиск регистронезависимым.*/
                    foundBooks = yield schemas_1.BookModel.find({ title: { $regex: title, $options: 'i' } });
                    if (foundBooks.length === 0)
                        return null;
                }
                else {
                    foundBooks = yield schemas_1.BookModel.find();
                }
                /*Возвращаем данные по найденным книгам по названию в BLL. Указано, что в ответе клиенту должен возвращаться
                массив с объектами типа "BookViewModel", но TypeScript не ругается, если в ответе клиенту отправляется
                массив с объектами типа "BookDBType", когда тип "BookDBType" на одно свойство больше модели "BookViewModel".
                Это называется утиная типизация. Чтобы избежать проблем из-за такого поведения TypeScript, перед отправкой
                клиенту данных избавляемся от ненужных для него свойств при помощи метода "map()" и callback-функции
                "mapBookDBTypeToViewModel()".*/
                return foundBooks.map(books_service_1.mapBookDBTypeToViewModel);
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "findBookByID()" для поиска книги по ID в Mongo БД.*/
    findBookByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Ищем книгу по ID в Mongo БД. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 книга была найдена - возвращаются данные по найденной книге в BLL.
            1.2 книга не была найдена - возвращается null в BLL.
            2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
            try {
                // const foundBook: BookDBType | null = await booksCollection.findOne({id: +id});
                /*Аналог через Mongoose.*/
                const foundBook = yield schemas_1.BookModel.findOne({ id: +id });
                if (!foundBook)
                    return null;
                return (0, books_service_1.mapBookDBTypeToViewModel)(foundBook);
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "createBookWithTitle()" для создания книги с указанным названием в Mongo БД.*/
    createBookWithTitle(newBook) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Добавляем книгу в Mongo БД. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 книга была добавлена - возвращается true в BLL.
            1.2 книга не была добавлена - возвращается false в BLL.
            2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
            try {
                // const result = await booksCollection.insertOne(newBook);
                // return !!result.insertedId;
                /*Аналог через Mongoose.*/
                const result = yield schemas_1.BookModel.create(newBook);
                return !!result;
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "deleteBookByID()" для удаления книги в Mongo БД по ID.*/
    deleteBookByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Удаляем книгу в Mongo БД. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 книга была удалена - возвращается true в BLL.
            1.2 книга не была удалена - возвращается false в BLL.
            2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
            try {
                // const result = await booksCollection.deleteOne({id: +id});
                /*Аналог через Mongoose.*/
                const result = yield schemas_1.BookModel.deleteOne({ id: +id });
                console.log(result);
                return !!result.deletedCount;
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "updateBookTitleByID()" для обновления названия книги по ID в Mongo БД.*/
    updateBookTitleByID(title, id) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Обновляем название книги по ID в Mongo БД. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 книга была обновлена - возвращается true в BLL.
            1.2 книга не была обновлена - возвращается false в BLL.
            2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
            try {
                // await booksCollection.updateOne({id: +id}, {$set: {title: title}});
                // const updatedBook: BookDBType | null = await booksCollection.findOne({id: +id});
                /*Аналог через Mongoose.*/
                yield schemas_1.BookModel.updateOne({ id: +id }, { $set: { title: title } });
                const updatedBook = yield schemas_1.BookModel.findOne({ id: +id });
                return !!updatedBook;
            }
            catch (error) {
                throw error;
            }
        });
    }
};
