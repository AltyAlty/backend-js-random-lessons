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

/*Импортируем MongoClient из MongoDB для создания клиента для MongoDB.*/
import {MongoClient} from 'mongodb';
/*Импортируем mongoose из Mongoose для работы с MongoDB через Mongoose.*/
import mongoose from 'mongoose';
/*Импортируем типы.*/
import {BookDBType, FeedbackDBType, mainPageContentDBType, UserDBType} from './types/db-types';

/*Делаем так, чтобы URI определялся автоматически от окружения.*/
const mongoURI = process.env.mongoURI || 'mongodb://0.0.0.0:27017';
/*Создаем клиента для MongoDB.*/
const client = new MongoClient(mongoURI);

/*Создаем функцию "connectDB()" для присоединения к Mongo БД.*/
export async function connectDB() {
    try {
        /*Присоединяем клиента для MongoDB к серверу, где развернута Mongo БД, и проверяем соединение.*/
        // await client.connect();
        // await client.db('bookshop').command({ping: 1});
        /*Аналог через Mongoose.*/
        await mongoose.connect(mongoURI + '/' + 'bookshop');
        console.log('Successfully connected to the Mongo server');
    } catch {
        console.log('Cannot connect to the Mongo server');
        /*Закрываем соединение в случае неудачной попытки подключения к серверу, где развернута Mongo БД.*/
        // await client.close();
        /*Аналог через Mongoose.*/
        await mongoose.disconnect();
    }
}

/*Выбираем БД "bookshop" из Mongo БД.*/
const remoteDB = client.db('bookshop');
/*Получаем коллекции из БД "bookshop". У этих коллекций будут методы, копирующие функционал команд из MongoDB.*/
export const mainPageContentCollection = remoteDB.collection<mainPageContentDBType>('main-page');
export const booksCollection = remoteDB.collection<BookDBType>('books');
export const usersCollection = remoteDB.collection<UserDBType>('users');
export const feedbacksCollection = remoteDB.collection<FeedbackDBType>('feedbacks');