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
exports.db = exports.usersCollection = exports.mainPageContentCollection = exports.booksCollection = exports.runDB = void 0;
/*
Создание документов в коллекции в БД для MongoDB:
db.getCollection('books').insertMany(
    [
        {id: 1, title: 'book-one', customersCount: 5},
        {id: 2, title: 'book-two', customersCount: 6},
        {id: 3, title: 'book-three', customersCount: 7},
        {id: 4, title: 'book-four', customersCount: 8},
        {id: 5, title: 'book-five', customersCount: 4},
        {id: 6, title: 'book-six', customersCount: 2},
        {id: 7, title: 'book-seven', customersCount: 18},
        {id: 8, title: 'book-eight', customersCount: 1},
        {id: 9, title: 'book-nine', customersCount: 28},
        {id: 10, title: 'book-ten', customersCount: 5},
        {id: 11, title: 'book-eleven', customersCount: 3},
        {id: 12, title: 'book-twelve', customersCount: 4},
        {id: 13, title: 'book-thirteen', customersCount: 6},
        {id: 14, title: 'book-fourteen', customersCount: 13},
        {id: 15, title: 'book-fifteen', customersCount: 16},
        {id: 16, title: 'book-sixteen', customersCount: 21},
        {id: 17, title: 'book-seventeen', customersCount: 8},
        {id: 18, title: 'book-eighteen', customersCount: 2},
        {id: 19, title: 'book-nineteen', customersCount: 4},
        {id: 20, title: 'book-twenty', customersCount: 22}
    ]
)

db.getCollection('mainpage').insertMany(
    [
        {content: '<h1>Hello!</h1>'}
    ]
)

db.getCollection('users').insertMany(
    [
        {userName: 'aaa', email: 'a', passwordHash: '', passwordSalt: '', createdAt: ''},
        {userName: 'bbb', email: 'b', passwordHash: '', passwordSalt: '', createdAt: ''},
        {userName: 'ccc', email: 'c', passwordHash: '', passwordSalt: '', createdAt: ''},
    ]
)

Проверка создания документов в коллекции в БД для MongoDB:
db.getCollection('books').find({})
db.getCollection('mainpage').find({})
db.getCollection('users').find({})

Очистка документов в коллекции в БД для MongoDB:
db.getCollection('books').deleteMany({})
db.getCollection('mainpage').deleteMany({})
db.getCollection('users').deleteMany({})
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
exports.usersCollection = remoteDB.collection('users');
exports.db = {
    mainPageContent: { content: '<h1>Hello!</h1>' },
    books: [
        { id: 1, title: 'book-one', customersCount: 5 },
        { id: 2, title: 'book-two', customersCount: 6 },
        { id: 3, title: 'book-three', customersCount: 7 },
        { id: 4, title: 'book-four', customersCount: 8 }
    ],
    users: [
        { _id: new mongodb_1.ObjectId, userName: 'aaa', email: 'a', passwordHash: '', passwordSalt: '', createdAt: new Date() },
        { _id: new mongodb_1.ObjectId, userName: 'bbb', email: 'b', passwordHash: '', passwordSalt: '', createdAt: new Date() },
        { _id: new mongodb_1.ObjectId, userName: 'ccc', email: 'c', passwordHash: '', passwordSalt: '', createdAt: new Date() },
    ]
};
