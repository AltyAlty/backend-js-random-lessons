import {BookType, DBType} from '../db/db';
import {BookViewModel} from '../models/BookViewModel';
import {booksRepository} from '../repositories/books-repository-db';
// import {booksRepository} from '../repositories/books-repository-local'

export const mapDBBookToViewModel = (book: BookType): BookViewModel => {
    return {
        id: book.id,
        title: book.title
    };
};

/*Здесь используется "db" только, чтобы была возможность быстро переключиться на "local" версию репозитория.*/
export const booksService = {
    /*Используем "async", чтобы то, что возвращается функцией, обворачивалось в промис.*/
    async findBooksByTitle(title: string | undefined): Promise<BookViewModel[]> {
        return booksRepository.findBooksByTitle(title);
    },

    async findBookByID(id: string): Promise<BookViewModel | null> {
        return booksRepository.findBookByID(id);
    },

    async createBookWithTitle(title: string): Promise<BookViewModel> {
        const newBook: BookType = {
            /*"+(new Date())" - таким образом генерируем случайно число. На самом деле генерация новых id это задача
            сервера, то есть клиент не должен их сам указывать при создании нового ресурса.*/
            id: +(new Date()),
            /*Если какое-то свойство в объекте undefined, то при переводе его в JSON оно отбрасывается.*/
            title: title,
            customersCount: 0
        };

        const result = await booksRepository.createBookWithTitle(newBook);
        return (mapDBBookToViewModel(newBook));
    },

    async deleteBookByID(id: string): Promise<void> {
        const result = await booksRepository.deleteBookByID(id);
    },

    async updateBookTitleByID(title: string, id: string): Promise<BookViewModel | null> {
        return await booksRepository.updateBookTitleByID(title, id);
    }
};