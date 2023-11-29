import {booksCollection, BookType} from '../db/db';
import {BookViewModel} from '../models/BookViewModel';
import {DeleteResult, InsertOneResult} from 'mongodb';
import {mapDBBookToViewModel} from '../domain/books-service';

export const booksRepository = {
    /*Используем "async", чтобы то, что возвращается функцией, обворачивалось в промис.*/
    async findBooksByTitle(title: string | undefined): Promise<BookViewModel[]> {
        let foundBooks: BookType[];

        if (title) {
            /*Метод "toArray()" (работает не во всех браузерах) экземпляров Iterator, который создает новый экземпляр
            массива, заполненный элементами, полученными из итератора.*/
            foundBooks = await booksCollection.find({title: {$regex: title}}).toArray();
        } else {
            foundBooks = await booksCollection.find({}).toArray();
        }

        /*Метод "map()" создает новый массив с результатом вызова указанной функции для каждого элемента массива. Хоть
        мы и указали, что в ответе клиенту должен возвращаться массив типов "BookViewModel", TypeScript все равно не
        ругается, если мы ответе отправляем клиенту массив типов "BookType", когда тип "BookType" на одно свойство
        больше типа "BookViewModel". Это утинная типизация. Чтобы избежать из-за такого поведения TypeScript проблем,
        перед отправкой клиенту данных, мы избавляемся от ненужных для него свойств при помощи метода "map()".*/
        return foundBooks.map(mapDBBookToViewModel);
    },

    async findBookByID(id: string): Promise<BookViewModel | null> {
        const foundBook: BookType | null = await booksCollection.findOne({id: +id});

        /*Если нужного объекта не было найдено, то мы получим undefined, соотвественно делаем проверку на такой случай,
        в которой выходим из функции.*/
        if (!foundBook) return null;
        return mapDBBookToViewModel(foundBook);
    },

    async createBookWithTitle(newBook: BookType): Promise<InsertOneResult<BookType>> {
        return await booksCollection.insertOne(newBook);
    },

    async deleteBookByID(id: string): Promise<DeleteResult> {
        return await booksCollection.deleteOne({id: +id});
    },

    async updateBookTitleByID(title: string, id: string): Promise<BookViewModel | null> {
        const result = await booksCollection.updateOne({id: +id}, {$set: {title: title}});

        const foundBook: BookType | null = await booksCollection.findOne({id: +id});

        if (!foundBook) return null;
        return mapDBBookToViewModel(foundBook);
    }
};