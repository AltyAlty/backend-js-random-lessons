/*
routes - UI
repositories - DAL
db - BLL
*/

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
import {MongoClient} from 'mongodb';

/*Делаем так, чтобы URI определялся автоматически от окружения.*/
const mongoURI = process.env.mongoURI || 'mongodb://0.0.0.0:27017';
/*Создаем клиент для MongoDB.*/
const client = new MongoClient(mongoURI);

export async function runDB() {
    try {
        /*Пытаемся присоединить клиента к серверу.*/
        await client.connect();
        /*Устанавливаем и проверяем соединение.*/
        await client.db('bookshop').command({ping: 1});
        console.log('Successfully connected to a mongo server');
    } catch {
        console.log('Cannot connect to a mongo server');
        /*Закрываем соединение в случае неудачной попытки подключения к серверу.*/
        await client.close();
    }
};

const remoteDB = client.db('bookshop');
/*Получаем коллекцию из MongoDB. При помощи "<BookViewModel>" типизировали документы из коллекции.*/
export const booksCollection = remoteDB.collection<BookType>('books');
export const mainPageContentCollection = remoteDB.collection('mainpage');

export type BookType = {
    id: number
    title: string
    customersCount: number
};

export type DBType = {
    mainPageContent: string
    books: BookType[]
};

export const db: DBType = {
    mainPageContent: '<h1>Hello!</h1>',

    books: [
        {id: 1, title: 'book-one', customersCount: 5},
        {id: 2, title: 'book-two', customersCount: 6},
        {id: 3, title: 'book-three', customersCount: 7},
        {id: 4, title: 'book-four', customersCount: 8}
    ]
};