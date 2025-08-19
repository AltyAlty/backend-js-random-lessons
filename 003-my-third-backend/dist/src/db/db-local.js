"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localDB = void 0;
/*Импортируем ObjectId из MongoDB для создания ID.*/
const mongodb_1 = require("mongodb");
/*Формируем локальную БД. Чтобы ее использовать нужно в файле "books-service.ts" импортировать "booksRepository" из
файла "books-repository-db-local.ts".*/
exports.localDB = {
    mainPageContent: { content: '<h1>Hello!</h1>' },
    books: [
        { id: 1, title: 'book-one', customersCount: 5 },
        { id: 2, title: 'book-two', customersCount: 6 },
        { id: 3, title: 'book-three', customersCount: 7 },
        { id: 4, title: 'book-four', customersCount: 8 },
        { id: 5, title: 'book-five', customersCount: 4 },
        { id: 6, title: 'book-six', customersCount: 2 },
        { id: 7, title: 'book-seven', customersCount: 18 },
        { id: 8, title: 'book-eight', customersCount: 1 },
        { id: 9, title: 'book-nine', customersCount: 28 },
        { id: 10, title: 'book-ten', customersCount: 5 },
        { id: 11, title: 'book-eleven', customersCount: 3 },
        { id: 12, title: 'book-twelve', customersCount: 4 },
        { id: 13, title: 'book-thirteen', customersCount: 6 },
        { id: 14, title: 'book-fourteen', customersCount: 13 },
        { id: 15, title: 'book-fifteen', customersCount: 16 },
        { id: 16, title: 'book-sixteen', customersCount: 21 },
        { id: 17, title: 'book-seventeen', customersCount: 8 },
        { id: 18, title: 'book-eighteen', customersCount: 2 },
        { id: 19, title: 'book-nineteen', customersCount: 4 },
        { id: 20, title: 'book-twenty', customersCount: 22 }
    ],
    users: [
        {
            _id: new mongodb_1.ObjectId,
            userName: 'aaa',
            email: 'a',
            passwordHash: '',
            passwordSalt: '',
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: (+(new Date())).toString(),
                expirationDate: new Date(new Date().getTime() + (3 * 60 * 1000)),
                isConfirmed: true,
            }
        },
        {
            _id: new mongodb_1.ObjectId,
            userName: 'bbb',
            email: 'b',
            passwordHash: '',
            passwordSalt: '',
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: (+(new Date())).toString(),
                expirationDate: new Date(new Date().getTime() + (3 * 60 * 1000)),
                isConfirmed: true,
            }
        },
        {
            _id: new mongodb_1.ObjectId,
            userName: 'ccc',
            email: 'c',
            passwordHash: '',
            passwordSalt: '',
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: (+(new Date())).toString(),
                expirationDate: new Date(new Date().getTime() + (3 * 60 * 1000)),
                isConfirmed: true,
            }
        },
    ],
    feedbacks: [
        { _id: new mongodb_1.ObjectId, userID: new mongodb_1.ObjectId, bookID: 1, comment: 'not OK', createdAt: new Date() },
        { _id: new mongodb_1.ObjectId, userID: new mongodb_1.ObjectId, bookID: 2, comment: 'fine', createdAt: new Date() }
    ]
};
