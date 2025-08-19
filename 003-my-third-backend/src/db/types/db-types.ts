/*Импортируем для типизации.*/
import {ObjectId} from 'mongodb';

/*Тип для данных для главной страницы в локальной БД и Mongo БД.*/
export type mainPageContentDBType = { content: string };

/*Тип для книг в локальной БД и Mongo БД.*/
export type BookDBType = {
    id: number
    title: string
    customersCount: number
};

/*Тип для пользователей в локальной БД и Mongo БД.*/
export type UserDBType = {
    _id: ObjectId,
    userName: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt: Date,
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean,
    }
};

/*Тип для фидбеков в локальной БД и Mongo БД.*/
export type FeedbackDBType = {
    _id: ObjectId,
    userID: ObjectId,
    bookID: number,
    comment: string
    createdAt: Date
};

/*Тип для локальной БД и Mongo БД.*/
export type DBType = {
    mainPageContent: mainPageContentDBType
    books: BookDBType[]
    users: UserDBType[]
    feedbacks: FeedbackDBType[]
};