"use strict";
/*
routes - UI - Presentation Layer
services - BLL - Business Logic Layer
repositories - DAL - Data Access Layer
db - Data Source
*/
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
exports.db = exports.mainPageContentCollection = exports.booksCollection = exports.runDB = void 0;
/*
Создание документов в коллекции в БД для MongoDB:
db.getCollection('books').insertMany(
    [
        {id: 1, title: 'book-one', customersCount: 5},
        {id: 2, title: 'book-two', customersCount: 6},
        {id: 3, title: 'book-three', customersCount: 7},
        {id: 4, title: 'book-four', customersCount: 8}
    ]
)

db.getCollection('mainpage').insertMany(
    [
        {content: '<h1>Hello!</h1>'}
    ]
)

Проверка создания документов в коллекции в БД для MongoDB:
db.getCollection('books').find({})
db.getCollection('mainpage').find({})

Очистка документов в коллекции в БД для MongoDB:
db.getCollection('books').deleteMany({})
db.getCollection('mainpage').deleteMany({})
*/
const mongodb_1 = require("mongodb");
/*Делаем так, чтобы URI определялся автоматически от окружения.*/
const mongoURI = process.env.mongoURI || 'mongodb://0.0.0.0:27017';
/*Создаем клиент для MongoDB.*/
const client = new mongodb_1.MongoClient(mongoURI);
function runDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            /*Пытаемся присоединить клиента к серверу.*/
            yield client.connect();
            /*Устанавливаем и проверяем соединение.*/
            yield client.db('bookshop').command({ ping: 1 });
            console.log('Successfully connected to a mongo server');
        }
        catch (_a) {
            console.log('Cannot connect to a mongo server');
            /*Закрываем соединение в случае неудачной попытки подключения к серверу.*/
            yield client.close();
        }
    });
}
exports.runDB = runDB;
;
const remoteDB = client.db('bookshop');
/*Получаем коллекцию из MongoDB. При помощи "<BookViewModel>" типизировали документы из коллекции.*/
exports.booksCollection = remoteDB.collection('books');
exports.mainPageContentCollection = remoteDB.collection('mainpage');
exports.db = {
    mainPageContent: { content: '<h1>Hello!</h1>' },
    books: [
        { id: 1, title: 'book-one', customersCount: 5 },
        { id: 2, title: 'book-two', customersCount: 6 },
        { id: 3, title: 'book-three', customersCount: 7 },
        { id: 4, title: 'book-four', customersCount: 8 }
    ]
};
