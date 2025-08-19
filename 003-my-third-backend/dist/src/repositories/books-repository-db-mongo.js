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
const db_mongo_1 = require("../db/db-mongo");
const books_service_1 = require("../domain/books-service");
exports.booksRepository = {
    /*Используем "async", чтобы то, что возвращается функцией, обворачивалось в промис.*/
    findBooksByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundBooks;
            if (title) {
                /*Метод "toArray()" (работает не во всех браузерах) экземпляров Iterator, который создает новый экземпляр
                массива, заполненный элементами, полученными из итератора.*/
                foundBooks = yield db_mongo_1.booksCollection.find({ title: { $regex: title } }).toArray();
            }
            else {
                foundBooks = yield db_mongo_1.booksCollection.find({}).toArray();
            }
            /*Метод "map()" создает новый массив с результатом вызова указанной функции для каждого элемента массива. Хоть
            мы и указали, что в ответе клиенту должен возвращаться массив типов "BookViewModel", TypeScript все равно не
            ругается, если мы ответе отправляем клиенту массив типов "BookType", когда тип "BookType" на одно свойство
            больше типа "BookViewModel". Это утинная типизация. Чтобы избежать из-за такого поведения TypeScript проблем,
            перед отправкой клиенту данных, мы избавляемся от ненужных для него свойств при помощи метода "map()".*/
            return foundBooks.map(books_service_1.mapDBBookToViewModel);
        });
    },
    findBookByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBook = yield db_mongo_1.booksCollection.findOne({ id: +id });
            /*Если нужного объекта не было найдено, то мы получим undefined, соотвественно делаем проверку на такой случай,
            в которой выходим из функции.*/
            if (!foundBook)
                return null;
            return (0, books_service_1.mapDBBookToViewModel)(foundBook);
        });
    },
    createBookWithTitle(newBook) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_mongo_1.booksCollection.insertOne(newBook);
        });
    },
    deleteBookByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_mongo_1.booksCollection.deleteOne({ id: +id });
        });
    },
    updateBookTitleByID(title, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_mongo_1.booksCollection.updateOne({ id: +id }, { $set: { title: title } });
            const foundBook = yield db_mongo_1.booksCollection.findOne({ id: +id });
            if (!foundBook)
                return null;
            return (0, books_service_1.mapDBBookToViewModel)(foundBook);
        });
    }
};
