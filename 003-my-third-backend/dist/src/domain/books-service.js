"use strict";
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
exports.booksService = exports.mapBookDBTypeToViewModel = void 0;
/*Импортируем репозитории.*/
const books_repository_db_mongo_1 = require("../repositories/mongo/books-repository-db-mongo");
/*Создаем вспомогательную функцию "mapDBBookToViewModel()" для преобразования объектов типа "BookDBType" в объекты типа
"BookViewModel".*/
const mapBookDBTypeToViewModel = (book) => {
    return {
        id: book.id,
        title: book.title
    };
};
exports.mapBookDBTypeToViewModel = mapBookDBTypeToViewModel;
/*Создаем сервис "booksService" для работы с данными по книгам.*/
exports.booksService = {
    /*Создаем метод "findBooksByTitle()" для поиска книг по названию.*/
    findBooksByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Просим репозиторий "booksRepository" найти книги по названию. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 по параметру "title" были найдены книги - возвращается массив с найденными книгами в UI.
            1.2 по параметру "title" не были найдены книги - возвращается null в UI.
            1.3 параметр "title" не был указан - возвращается массив со всеми книгами в UI.
            2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
            try {
                return books_repository_db_mongo_1.booksRepository.findBooksByTitle(title);
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "findBookByID()" для поиска книги по ID.*/
    findBookByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Просим репозиторий "booksRepository" найти книгу по ID. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 книга была найдена - возвращаются данные по найденной книге в UI.
            1.2 книга не была найдена - возвращается null в UI.
            2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
            try {
                return books_repository_db_mongo_1.booksRepository.findBookByID(id);
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "createBookWithTitle()" для создания книги с указанным названием.*/
    createBookWithTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Если названия для создания книги не было указано, то возвращается false в UI.*/
            if (!title)
                return false;
            /*Формируем объект для новой книги с указанным названием.*/
            const newBook = {
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
            try {
                return yield books_repository_db_mongo_1.booksRepository.createBookWithTitle(newBook);
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "deleteBookByID()" для удаления книги по ID.*/
    deleteBookByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Если ID книги для удаления не было указано, то возвращается false в UI.*/
            if (!id)
                return false;
            /*Просим репозиторий "booksRepository" удалить книгу по ID. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 книга была удалена - возвращается true в UI.
            1.2 книга не была удалена - возвращается false в UI.
            2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
            try {
                return yield books_repository_db_mongo_1.booksRepository.deleteBookByID(id);
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "updateBookTitleByID()" для обновления названия книги по ID.*/
    updateBookTitleByID(title, id) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Если названия или ID книги для удаления не было указано, то возвращается false в UI.*/
            if (!title || !id)
                return false;
            /*Просим репозиторий "booksRepository" обновить название книги по ID. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 книга была обновлена - возвращается true в UI.
            1.2 книга не была обновлена - возвращается false в UI.
            2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
            try {
                return yield books_repository_db_mongo_1.booksRepository.updateBookTitleByID(title, id);
            }
            catch (error) {
                throw error;
            }
        });
    }
};
