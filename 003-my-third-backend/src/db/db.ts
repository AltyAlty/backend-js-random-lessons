/*
routes - UI - Presentation Layer
services - BLL - Business Logic Layer
repositories - DAL - Data Access Layer
db - Data Source
*/

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

export type mainPageContentType = { content: string };

export type DBType = {
    mainPageContent: mainPageContentType
    books: BookType[]
};

export const db: DBType = {
    mainPageContent: {content: '<h1>Hello!</h1>'},

    books: [
        {id: 1, title: 'book-one', customersCount: 5},
        {id: 2, title: 'book-two', customersCount: 6},
        {id: 3, title: 'book-three', customersCount: 7},
        {id: 4, title: 'book-four', customersCount: 8}
    ]
};