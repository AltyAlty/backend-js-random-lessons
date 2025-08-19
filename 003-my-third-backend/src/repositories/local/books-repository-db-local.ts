/*Импортируем локальную БД.*/
import {localDB} from '../../db/db-local';
/*Импортируем функцию "mapBookDBTypeToViewModel()" для преобразования объектов типа "BookDBType" в объекты типа
"BookViewModel".*/
import {mapBookDBTypeToViewModel} from '../../domain/books-service';
/*Импортируем типы.*/
import {BookDBType} from '../../db/types/db-types';
/*Импортируем модели.*/
import {BookViewModel} from '../../models/views/BookViewModel';

/*Создаем репозиторий "booksRepository" для работы с данными по книгам из локальной БД.*/
export const booksRepository = {
    /*Создаем метод "findBooksByTitle()" для поиска книг по названию в локальной БД.*/
    async findBooksByTitle(title: string | undefined): Promise<BookViewModel[] | null> {
        /*Берем данные по всем книгам из локальной БД и ищем книги по названию в полученных данных. Порядок работы такой:
        1. Если по параметру "title" были найдены книги - возвращается массив с найденными книгами в BLL.
        2. Если по параметру "title" не были найдены книги - возвращается null в BLL.
        3 Если параметр "title" не был указан - возвращается массив со всеми книгами в BLL.*/
        let foundBooks: BookDBType[] = localDB.books;
        /*Метод "filter()" создает новый массив со всеми элементами, прошедшими проверку, задаваемую в передаваемой
        callback-функции. Метод "indexOf()" возвращает первый индекс, по которому указанный элемент может быть найден в
        массиве или -1, если такого индекса нет.

        Перебираем каждый объект из массива "foundBooks" и у каждого этого объекта берем свойство "title", являющееся
        строкой. Ищем в этом свойстве с какого индекса начинается текст, переданный в параметре методу "indexOf()". Если
        указанный текст имеется, то всегда возвращается число отличное от -1. Соответственно метод "filter()" не возьмет
        те объекты в массиве "foundBooks", при переборе которых были возвращены методом "indexOf()" числа равные или
        меньше -1. В итоге будет получен массив с данными только тех книг, чьи заголовки совпадают с указанным
        Query-параметром. Если названия указано не было, то будут возвращены все книги из локальной БД.*/
        if (title) foundBooks = foundBooks.filter(c => c.title.indexOf(title as string) > -1);
        if (foundBooks.length === 0) return null;
        /*Возвращаем данные по найденным книгам по названию в BLL. Указано, что в ответе клиенту должен возвращаться
        массив с объектами типа "BookViewModel", но TypeScript не ругается, если в ответе клиенту отправляется массив с
        объектами типа "BookDBType", когда тип "BookDBType" на одно свойство больше модели "BookViewModel". Это
        называется утиная типизация. Чтобы избежать проблем из-за такого поведения TypeScript, перед отправкой клиенту
        данных избавляемся от ненужных для него свойств при помощи метода "map()" и callback-функции
        "mapBookDBTypeToViewModel()".*/
        return foundBooks.map(mapBookDBTypeToViewModel);
    },

    /*Создаем метод "findBookByID()" для поиска книги в локальной БД по ID.*/
    async findBookByID(id: string): Promise<BookViewModel | null> {
        /*Ищем книгу по ID в локальной БД. Порядок работы такой:
        1. Если нужной книги не было найдено - возвращается null в BLL.
        2. Если нужная книга была найдена - возвращаются данные по найденной книге по ID в BLL.*/

        /*Используем здесь "id", чтобы работать с URI-параметром в адресной строке. Метод "find()" возвращает значение
        первого найденного в массиве элемента, которое удовлетворяет условию переданному в callback-функции. В противном
        случае возвращается undefined.

        В массиве "localDB.books" ищем объект, у которого свойство "id" совпадает с URI-параметром "id". Этот
        URI-параметр изначально является строкой, поэтому приводим его к числу при помощи "+".*/
        const foundBook: BookDBType | undefined = localDB.books.find(c => c.id === +id);
        /*Если нужной книги не было найдено, то будет получен undefined. В таком случае возвращается null в BLL.*/
        if (!foundBook) return null;
        /*Если нужная книга была найдена, то возвращаются данные по найденной книге по ID в BLL.*/
        return mapBookDBTypeToViewModel(foundBook);
    },

    /*Создаем метод "createBookWithTitle()" для создания книги с указанным названием в локальной БД.*/
    async createBookWithTitle(newBook: BookDBType): Promise<boolean> {
        /*Создаем книгу с указанным названием в локальной БД. Порядок работы такой:
        1. Если книга не была добавлена - возвращается false в BLL.
        2. Если книга была добавлена - возвращается true в BLL.*/
        const booksLengthBefore: number = localDB.books.length;
        /*Добавляем книгу в локальную БД.*/
        localDB.books.push(newBook);
        /*Если книга не была добавлена, то возвращается false в BLL*/
        if (localDB.books.length - booksLengthBefore !== 1) return false;
        /*После добавления книги возвращается true в BLL.*/
        return true;
    },

    /*Создаем метод "deleteBookByID()" для удаления книги по ID в локальной БД.*/
    async deleteBookByID(id: string): Promise<boolean> {
        /*Удаляем книгу по ID в локальной БД. Порядок работы такой:
        1. Если книги с указанным ID не было найдено - возвращается false м в BLL.
        2. Если книга была удалена - возвращается true в BLL.*/
        /*Проверяем есть ли в локальной БД книга с указанным ID. Если нет, то возвращается false м в BLL.*/
        let result: boolean = false;
        for (const book of localDB.books) if (book.id === +id) result = true;
        if (!result) return false;
        /*Ищем такой объект в массиве "localDB.books", у которого свойство "id" не совпадает с URI-параметром "id", и
        отфильтровываем его, чтобы получился массив без этого объекта. Тем самым осуществляем удаление элемента в
        локальной БД.*/
        localDB.books = localDB.books.filter(c => c.id !== +id);
        /*После удаления книги возвращается true в BLL.*/
        return true;
    },

    /*Создаем метод "updateBookTitleByID()" для обновления названия книги по ID в локальной БД.*/
    async updateBookTitleByID(title: string, id: string): Promise<boolean> {
        /*Обновляем название книги по ID в локальной БД. Порядок работы такой:
        1. Если нужной книги не было найдено - возвращается false м в BLL.
        2. Если книга была обновлена - возвращается true в BLL.*/
        /*В массиве "localDB.books" ищем объект, у которого свойство "id" совпадает с URI-параметром "id".*/
        const foundBook: BookDBType | undefined = localDB.books.find(c => c.id === +id);
        /*Если нужной книги не было найдено, то будет получен undefined. В таком случае возвращается false в BLL.*/
        if (!foundBook) return false;
        /*Если нужная книга была найдена, то обновляем заголовок книги в локальной БД.*/
        foundBook.title = title;
        /*После обновления книги возвращается true в BLL.*/
        return true;
    }
};