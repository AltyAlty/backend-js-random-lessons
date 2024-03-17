import {UserDBType} from '../db/db';

/*Расширяем тип Request из Express, чтобы можно было через запрос передавать данные о пользователе.*/
declare global {
    declare namespace Express {
        export interface Request {
            user: UserDBType | null
        }
    }
}