/*Импортируем репозитории.*/
import {booksRepository} from '../repositories/mongo/books-repository-db-mongo';
// import {booksRepository} from '../repositories/local/books-repository-db-local';
/*Импортируем типы.*/
import {BookDBType} from '../db/types/db-types';
/*Импортируем модели.*/
import {BookViewModel} from '../models/views/BookViewModel';

/*Создаем вспомогательную функцию "mapDBBookToViewModel()" для преобразования объектов типа "BookDBType" в объекты типа
"BookViewModel".*/
export const mapBookDBTypeToViewModel = (book: BookDBType): BookViewModel => {
    return {
        id: book.id,
        title: book.title
    };
};

/*Создаем сервис "booksService" для работы с данными по книгам.*/
export const booksService = {
    /*Создаем метод "findBooksByTitle()" для поиска книг по названию.*/
    async findBooksByTitle(title: string | undefined): Promise<BookViewModel[] | null> {
        /*Просим репозиторий "booksRepository" найти книги по названию. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 по параметру "title" были найдены книги - возвращается массив с найденными книгами в UI.
        1.2 по параметру "title" не были найдены книги - возвращается null в UI.
        1.3 параметр "title" не был указан - возвращается массив со всеми книгами в UI.
        2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
        try { return booksRepository.findBooksByTitle(title) } catch (error) { throw error }
    },

    /*Создаем метод "findBookByID()" для поиска книги по ID.*/
    async findBookByID(id: string): Promise<BookViewModel | null> {
        /*Просим репозиторий "booksRepository" найти книгу по ID. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 книга была найдена - возвращаются данные по найденной книге в UI.
        1.2 книга не была найдена - возвращается null в UI.
        2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
        try { return booksRepository.findBookByID(id) } catch (error) { throw error }
    },

    /*Создаем метод "createBookWithTitle()" для создания книги с указанным названием.*/
    async createBookWithTitle(title: string): Promise<boolean> {
        /*Если названия для создания книги не было указано, то возвращается false в UI.*/
        if (!title) return false;

        /*Формируем объект для новой книги с указанным названием.*/
        const newBook: BookDBType = {
            /*При помощи "+(new Date())" генерируем "случайное" ID. Но генерация ID должна быть задачей сервера.*/
            id: +(new Date()),
            /*Если некое свойство является undefined, то при переводе в JSON это свойство отбрасывается.*/
            title: title,
            customersCount: 0
        };

        /*Просим репозиторий "booksRepository" создать новую книгу с указанным названием. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 книга была добавлена - возвращается true в UI.
        1.2 книга не была добавлена - возвращается false в UI.
        2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
        try { return await booksRepository.createBookWithTitle(newBook) } catch (error) { throw error }
    },

    /*Создаем метод "deleteBookByID()" для удаления книги по ID.*/
    async deleteBookByID(id: string): Promise<boolean> {
        /*Если ID книги для удаления не было указано, то возвращается false в UI.*/
        if (!id) return false;
        /*Просим репозиторий "booksRepository" удалить книгу по ID. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 книга была удалена - возвращается true в UI.
        1.2 книга не была удалена - возвращается false в UI.
        2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
        try { return await booksRepository.deleteBookByID(id) } catch (error) { throw error }
    },

    /*Создаем метод "updateBookTitleByID()" для обновления названия книги по ID.*/
    async updateBookTitleByID(title: string, id: string): Promise<boolean> {
        /*Если названия или ID книги для удаления не было указано, то возвращается false в UI.*/
        if (!title || !id) return false;
        /*Просим репозиторий "booksRepository" обновить название книги по ID. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 книга была обновлена - возвращается true в UI.
        1.2 книга не была обновлена - возвращается false в UI.
        2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
        try {return await booksRepository.updateBookTitleByID(title, id)} catch (error) {throw error}
    }
};