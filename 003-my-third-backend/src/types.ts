/*В целях типизации импортируем Request.*/
import {Request} from 'express';
import {ObjectId} from 'mongodb';

/*Делаем более удобные типы для запросов. Сначала сделаем тип, где указываем URI-параметры в GET-запросе. При типизации
запроса "req" на первом месте идут URI-параметры, мы их не указываем, так как не используем URI-параметры. На втором
месте идет Response Body, то есть то, что мы будем возвращать, но этот Response Body относится к тому res внутри
запроса, пока его не трогаем. На третьем месте Request Body то есть то, что к нам прилетает в body на запрос, но так как
у нас GET-запрос, то в body ничего интересного прилетать не будет. На четвертом месте query-параметры, то есть
req.query.*/
export type RequestWithQuery<T> = Request<{}, {}, {}, T>;

export type RequestWithParams<T> = Request<T>;

export type RequestWithBody<T> = Request<{}, {}, T>;

export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>;

export type UserDBType = {
    _id: ObjectId,
    userName: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt: Date
}
