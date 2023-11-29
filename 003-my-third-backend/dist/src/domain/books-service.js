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
exports.booksService = exports.mapDBBookToViewModel = void 0;
const books_repository_db_1 = require("../repositories/books-repository-db");
// import {booksRepository} from '../repositories/books-repository-local'
const mapDBBookToViewModel = (book) => {
    return {
        id: book.id,
        title: book.title
    };
};
exports.mapDBBookToViewModel = mapDBBookToViewModel;
/*Здесь используется "db" только, чтобы была возможность быстро переключиться на "local" версию репозитория.*/
exports.booksService = {
    /*Используем "async", чтобы то, что возвращается функцией, обворачивалось в промис.*/
    findBooksByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            return books_repository_db_1.booksRepository.findBooksByTitle(title);
        });
    },
    findBookByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return books_repository_db_1.booksRepository.findBookByID(id);
        });
    },
    createBookWithTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBook = {
                /*"+(new Date())" - таким образом генерируем случайно число. На самом деле генерация новых id это задача
                сервера, то есть клиент не должен их сам указывать при создании нового ресурса.*/
                id: +(new Date()),
                /*Если какое-то свойство в объекте undefined, то при переводе его в JSON оно отбрасывается.*/
                title: title,
                customersCount: 0
            };
            const result = yield books_repository_db_1.booksRepository.createBookWithTitle(newBook);
            return ((0, exports.mapDBBookToViewModel)(newBook));
        });
    },
    deleteBookByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield books_repository_db_1.booksRepository.deleteBookByID(id);
        });
    },
    updateBookTitleByID(title, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield books_repository_db_1.booksRepository.updateBookTitleByID(title, id);
        });
    }
};
