/*Импортируем коллекции из Mongo БД.*/
import {booksCollection} from '../../db/db-mongo';
/*Импортируем функцию "mapBookDBTypeToViewModel()" для преобразования объектов типа "BookDBType" в объекты типа
"BookViewModel".*/
import {mapBookDBTypeToViewModel} from '../../domain/books-service';
/*Импортируем Mongoose модели.*/
import {BookModel} from '../../db/schemas/schemas';
/*Импортируем типы.*/
import {BookDBType} from '../../db/types/db-types';
/*Импортируем модели.*/
import {BookViewModel} from '../../models/views/BookViewModel';

/*Создаем репозиторий "booksRepository" для работы с данными по книгам из Mongo БД.*/
export const booksRepository = {
    /*Создаем метод "findBooksByTitle()" для поиска книг по названию в Mongo БД.*/
    async findBooksByTitle(title: string | undefined): Promise<BookViewModel[] | null> {
        /*Создаем переменную "foundBooks" для хранения найденных книг по названию.*/
        let foundBooks: BookDBType[];

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
                foundBooks = await BookModel.find({title: {$regex: title, $options: 'i'}});
                if (foundBooks.length === 0) return null;
            } else {
                foundBooks = await BookModel.find();
            }

            /*Возвращаем данные по найденным книгам по названию в BLL. Указано, что в ответе клиенту должен возвращаться
            массив с объектами типа "BookViewModel", но TypeScript не ругается, если в ответе клиенту отправляется
            массив с объектами типа "BookDBType", когда тип "BookDBType" на одно свойство больше модели "BookViewModel".
            Это называется утиная типизация. Чтобы избежать проблем из-за такого поведения TypeScript, перед отправкой
            клиенту данных избавляемся от ненужных для него свойств при помощи метода "map()" и callback-функции
            "mapBookDBTypeToViewModel()".*/
            return foundBooks.map(mapBookDBTypeToViewModel);
        } catch (error) {
            throw error;
        }
    },

    /*Создаем метод "findBookByID()" для поиска книги по ID в Mongo БД.*/
    async findBookByID(id: string): Promise<BookViewModel | null> {
        /*Ищем книгу по ID в Mongo БД. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 книга была найдена - возвращаются данные по найденной книге в BLL.
        1.2 книга не была найдена - возвращается null в BLL.
        2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
        try {
            // const foundBook: BookDBType | null = await booksCollection.findOne({id: +id});
            /*Аналог через Mongoose.*/
            const foundBook: BookDBType | null = await BookModel.findOne({id: +id});
            if (!foundBook) return null;
            return mapBookDBTypeToViewModel(foundBook);
        } catch (error) {
            throw error;
        }
    },

    /*Создаем метод "createBookWithTitle()" для создания книги с указанным названием в Mongo БД.*/
    async createBookWithTitle(newBook: BookDBType): Promise<boolean> {
        /*Добавляем книгу в Mongo БД. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 книга была добавлена - возвращается true в BLL.
        1.2 книга не была добавлена - возвращается false в BLL.
        2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
        try {
            // const result = await booksCollection.insertOne(newBook);
            // return !!result.insertedId;
            /*Аналог через Mongoose.*/
            const result = await BookModel.create(newBook);
            return !!result;
        } catch (error) {
            throw error;
        }
    },

    /*Создаем метод "deleteBookByID()" для удаления книги в Mongo БД по ID.*/
    async deleteBookByID(id: string): Promise<boolean> {
        /*Удаляем книгу в Mongo БД. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 книга была удалена - возвращается true в BLL.
        1.2 книга не была удалена - возвращается false в BLL.
        2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
        try {
            // const result = await booksCollection.deleteOne({id: +id});
            /*Аналог через Mongoose.*/
            const result = await BookModel.deleteOne({id: +id});
            console.log(result);
            return !!result.deletedCount;
        } catch (error) {
            throw error;
        }
    },

    /*Создаем метод "updateBookTitleByID()" для обновления названия книги по ID в Mongo БД.*/
    async updateBookTitleByID(title: string, id: string): Promise<boolean> {
        /*Обновляем название книги по ID в Mongo БД. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 книга была обновлена - возвращается true в BLL.
        1.2 книга не была обновлена - возвращается false в BLL.
        2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
        try {
            // await booksCollection.updateOne({id: +id}, {$set: {title: title}});
            // const updatedBook: BookDBType | null = await booksCollection.findOne({id: +id});
            /*Аналог через Mongoose.*/
            await BookModel.updateOne({id: +id}, {$set: {title: title}});
            const updatedBook: BookDBType | null = await BookModel.findOne({id: +id});
            return !!updatedBook;
        } catch (error) {
            throw error;
        }
    }
};