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
exports.booksRepository = void 0;
/*Импортируем локальную БД.*/
const db_local_1 = require("../db/db-local");
/*Создаем вспомогательную функцию "mapDBBookToViewModel()" для преобразования объектов типа "BookType" в объекты типа
"BookViewModel".*/
const mapDBBookToViewModel = (book) => {
    return {
        id: book.id,
        title: book.title
    };
};
/*Создаем репозиторий для работы с данными по книгам из локальной БД.*/
exports.booksRepository = {
    /*Создаем метод "findBooksByTitle()" для поиска книг по названию в локальной БД. Используем "async", чтобы то, что
    возвращается функцией, оборачивалось в промис.*/
    findBooksByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Берем данные по всем книгам из локальной БД.*/
            let foundBooks = db_local_1.localDB.books;
            /*Метод "filter()" создает новый массив со всеми элементами, прошедшими проверку, задаваемую в передаваемой
            callback-функции. Метод "indexOf()" возвращает первый индекс, по которому указанный элемент может быть найден в
            массиве или -1, если такого индекса нет.
    
            Перебираем каждый объект из массива "foundBooks" и у каждого этого объекта берем свойство "title", являющееся
            строкой. Ищем в этом свойстве с какого индекса начинается текст, переданный в параметре методу "indexOf()". Если
            указанный текст имеется, то всегда возвращается число отличное от -1. Соответственно метод "filter()" не возьмет
            те объекты в массиве "foundBooks", при переборе которых были возвращены методом "indexOf()" числа равные или
            меньше -1. В итоге будет получен массив с данными только тех книг, чьи заголовки совпадают с указанным
            Query-параметром.*/
            if (title)
                foundBooks = foundBooks.filter(c => c.title.indexOf(title) > -1);
            /*Указано, что в ответе клиенту должен возвращаться массив с объектами типа "BookViewModel", но TypeScript не
            ругается, если в ответе клиенту отправляется массив с объектами типа "BookType", когда тип "BookType" на одно
            свойство больше типа "BookViewModel". Это называется утиная типизация. Чтобы избежать проблем из-за такого
            поведения TypeScript, перед отправкой клиенту данных избавляемся от ненужных для него свойств при помощи метода
            "map()" и callback-функции "mapDBBookToViewModel()".*/
            return foundBooks.map(mapDBBookToViewModel);
        });
    },
    /*Создаем метод "findBookByID()" для поиска книги в локальной БД по ID.*/
    findBookByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Используем здесь "id", чтобы работать с URI-параметром в адресной строке. Метод "find()" возвращает значение
            первого найденного в массиве элемента, которое удовлетворяет условию переданному в callback-функции. В противном
            случае возвращается undefined.
    
            В массиве "localDB.books" ищем объект, у которого свойство "id" совпадает с URI-параметром "id". Этот
            URI-параметр изначально является строкой, поэтому приводим его к числу при помощи "+".*/
            const foundBook = db_local_1.localDB.books.find(c => c.id === +id);
            /*Если нужного объекта не было найдено, то будет получен undefined, соответственно делаем проверку на такой
            случай.*/
            if (!foundBook)
                return null;
            return mapDBBookToViewModel(foundBook);
        });
    },
    /*Создаем метод "createBookWithTitle()" для создания книги, с указанным названием, в локальной БД.*/
    createBookWithTitle(newBook) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Добавляем книгу в локальную БД.*/
            db_local_1.localDB.books.push(newBook);
        });
    },
    /*Создаем метод "deleteBookByID()" для удаления книги в локальной БД по ID.*/
    deleteBookByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Ищем такой объект в массиве "localDB.books", у которого свойство "id" не совпадает с URI-параметром "id", и
            отфильтровываем его, чтобы получился массив без этого объекта. Тем самым осуществляем удаление элемента в
            локально БД.*/
            db_local_1.localDB.books = db_local_1.localDB.books.filter(c => c.id !== +id);
        });
    },
    /*Создаем метод "updateBookTitleByID()" для обновления названия книги, имеющей какой-то ID, в локальной БД.*/
    updateBookTitleByID(title, id) {
        return __awaiter(this, void 0, void 0, function* () {
            /*В массиве "localDB.books" ищем объект, у которого свойство "id" совпадает с URI-параметром "id".*/
            const foundBook = db_local_1.localDB.books.find(c => c.id === +id);
            /*Если нужного объекта не было найдено, то будет получен undefined, соответственно делаем проверку на такой
            случай.*/
            if (!foundBook)
                return null;
            /*Обновляем заголовок книги в локальной БД.*/
            foundBook.title = title;
            /*Преобразовываем объект "foundBook" типа "BookType" в объект типа "BookViewModel" при помощи метода "map()" и
            callback-функции "mapDBBookToViewModel()"*/
            return (mapDBBookToViewModel(foundBook));
        });
    }
};
