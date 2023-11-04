"use strict";
/*
routes - UI
repositories - DAL
db - BLL
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRepository = void 0;
const mapDBBookToViewModel = (book) => {
    return {
        id: book.id,
        title: book.title
    };
};
exports.booksRepository = {
    findBooksByTitle(title, db) {
        let foundBooks = db.books;
        /*Метод "filter()" создает новый массив со всеми элементами, прошедшими проверку, задаваемую в передаваемой
        функции. Метод "indexOf()" возвращает первый индекс, по которому данный элемент может быть найден в массиве или
        -1, если такого индекса нет. Здесь мы берем каждый объект из массива "db.books", у каждого этого объекта берем
        свойство "title", которое является строкой. Потом смотрим в этой строке с какого символа начинается текст,
        переданный в параметре метода "indexOf()". Если указанный текст будет имется, то всегда будет возвращать число
        отличное от -1, соответственно метод "filter()" в нашем случае не возьмет те объекты в массиве "db.books", в
        которых было возвращено методом "indexOf()" числа равные или меньшие -1. То есть в итоге мы получим массив
        только с теми книгами, чей заголовок совпадает указанным нами query-параметром, который находится в находится в
        "req", то есть в содержащем данные о запросе объекте, внутри свойства "query".*/
        if (title) {
            foundBooks = foundBooks.filter(c => c.title.indexOf(title) > -1);
        }
        /*Метод "map()" создает новый массив с результатом вызова указанной функции для каждого элемента массива. Хоть
        мы и указали, что в ответе клиенту должен возвращаться массив типов "BookViewModel", TypeScript все равно не
        ругается, если мы ответе отправляем клиенту массив типов "BookType", когда тип "BookType" на одно свойство
        больше типа "BookViewModel". Это утинная типизация. Чтобы избежать из-за такого поведения TypeScript проблем,
        перед отправкой клиенту данных, мы избавляемся от ненужных для него свойств при помощи метода "map()".*/
        // foundBooks.map(dbBook => mapDBBookToViewModel(dbBook));
        return foundBooks.map(mapDBBookToViewModel);
    },
    findBookByID(id, db) {
        /*Используем здесь ":id", чтобы работать с URI-параметром в адресной строке. Метод "find()" возвращает значение
        первого найденного в массиве элемента, которое удовлетворяет условию переданному в callback-функции. В противном
        случае возвращается undefined. То есть здесь мы ищем такой объект в массиве "db.books", у которого свойство "id"
        совпадает с URI-параметром "id", который в свою очередь находится в "req", то есть в содержащем данные о
        запросе, внутри свойства "params". Этот URI-параметр изначально строкой, поэтому приводим его числу при помощи
        "+".*/
        const foundBook = db.books.find(c => c.id === +id);
        /*Если нужного объекта не было найдено, то мы получим undefined, соотвественно делаем проверку на такой случай,
        в которой выходим из функции.*/
        if (!foundBook) {
            return undefined;
        }
        return mapDBBookToViewModel(foundBook);
    },
    createBookWithTitle(title, db) {
        const newBook = {
            /*"+(new Date())" - таким образом генерируем случайно число. На самом деле генерация новых id это задача
            сервера, то есть клиент не должен их сам указывать при создании нового ресурса.*/
            id: +(new Date()),
            /*Если какое-то свойство в объекте undefined, то при переводе его в JSON оно отбрасывается.*/
            title: title,
            customersCount: 0
        };
        db.books.push(newBook);
        return (mapDBBookToViewModel(newBook));
    },
    deleteBookByID(id, db) {
        /*Здесь мы ищем такой объект в массиве "db.books", у которого свойство "id" не совпадает с URI-параметром "id",
        и отфильтровываем его так, чтобы получился массив без этого объекта. Тем самым мы осуществляем удаление
        элемента.*/
        db.books = db.books.filter(c => c.id !== +id);
    },
    updateBookTitleByID(title, id, db) {
        const foundBook = db.books.find(c => c.id === +id);
        if (!foundBook) {
            return undefined;
        }
        foundBook.title = title;
        return foundBook;
    }
};
