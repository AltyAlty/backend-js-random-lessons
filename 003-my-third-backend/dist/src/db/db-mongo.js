"use strict";
/*Команды для работы с MongoDB:

1. Очистка документов в коллекции в MongoDB:
db.getCollection('books').deleteMany({})
db.getCollection('main-page').deleteMany({})
db.getCollection('users').deleteMany({})
db.getCollection('feedbacks').deleteMany({})

2. Создание коллекций в БД "bookshop" (MongoDB автоматически добавляет всем сущностям свойство "_id"):
db.getCollection('main-page').insertMany(
    [
        {content: '<h1>Hello!</h1>'}
    ]
)

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

db.getCollection('users').insertMany(
    [
        {
            userName: 'aaa',
            email: 'a',
            passwordHash: '',
            passwordSalt: '',
            createdAt: '',
            emailConfirmation: {
                confirmationCode: '',
                expirationDate: '',
                isConfirmed: true,
            }
        },

        {
            userName: 'bbb',
            email: 'b',
            passwordHash: '',
            passwordSalt: '',
            createdAt: '',
            emailConfirmation: {
                confirmationCode: '',
                expirationDate: '',
                isConfirmed: true,
            }
        },

        {
            userName: 'ccc',
            email: 'c',
            passwordHash: '',
            passwordSalt: '',
            createdAt: '',
            emailConfirmation: {
                confirmationCode: '',
                expirationDate: '',
                isConfirmed: true,
            }
        },
    ]
)

db.getCollection('feedbacks').insertMany(
    [
        {_id: new ObjectId, userID: new ObjectId, bookID: 1, comment: 'not OK', createdAt: ''},
        {_id: new ObjectId, userID: new ObjectId, bookID: 2, comment: 'fine', createdAt: ''},
    ]
)

3. Проверка создания коллекций:
db.getCollection('books').find({})
db.getCollection('main-page').find({})
db.getCollection('users').find({})
db.getCollection('feedbacks').find({})
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
exports.feedbacksCollection = exports.usersCollection = exports.booksCollection = exports.mainPageContentCollection = exports.connectDB = void 0;
/*Импортируем MongoClient из MongoDB для создания клиента для MongoDB.*/
const mongodb_1 = require("mongodb");
/*Делаем так, чтобы URI определялся автоматически от окружения.*/
const mongoURI = process.env.mongoURI || 'mongodb://0.0.0.0:27017';
/*Создаем клиента для MongoDB.*/
const client = new mongodb_1.MongoClient(mongoURI);
/*Создаем функцию "connectDB()" для присоединения к Mongo БД.*/
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            /*Пытаемся присоединить клиента для MongoDB к серверу, где развернута Mongo БД.*/
            yield client.connect();
            /*Проверяем соединение.*/
            yield client.db('bookshop').command({ ping: 1 });
            console.log('Successfully connected to the Mongo server');
        }
        catch (_a) {
            console.log('Cannot connect to the Mongo server');
            /*Закрываем соединение в случае неудачной попытки подключения к серверу, где развернута Mongo БД.*/
            yield client.close();
        }
    });
}
exports.connectDB = connectDB;
;
/*Выбираем БД "bookshop" из Mongo БД.*/
const remoteDB = client.db('bookshop');
/*Получаем коллекции из БД "bookshop". У этих коллекций будут методы, копирующие функционал команд из MongoDB.*/
exports.mainPageContentCollection = remoteDB.collection('main-page');
exports.booksCollection = remoteDB.collection('books');
exports.usersCollection = remoteDB.collection('users');
exports.feedbacksCollection = remoteDB.collection('feedbacks');
