import {ObjectId} from 'mongodb';
import jwt from 'jsonwebtoken';
import {settings} from '../settings/settings';
import {UserDBType} from '../db/db';

export const jwtService = {
    /*Создание токена на UI уровне.*/
    async createJWT(user: UserDBType) {
        /*При создании токена отдаем информацию о пользователе, некую секретную информацию и срок действия токена.*/
        const token = jwt.sign({userID: user._id}, settings.JWT_SECRET, {expiresIn: '1h'});
        /*Возвращаем созданный токен.*/
        return token;
    },

    /*Проверка пользователя по токену.*/
    async getUserIDByToken(token: string) {
        try {
            /*Проверяем токен на UI уровне.*/
            const result: any = jwt.verify(token, settings.JWT_SECRET);
            /*Если проверка токена прошла успешно, то возвращаем ID пользователя.*/
            return new ObjectId(result.userID);
        } catch (error) {
            /*Если проверка токена не пройдет, то будет ошибка, которую мы перехватываем.*/
            return null;
        }
    }
}