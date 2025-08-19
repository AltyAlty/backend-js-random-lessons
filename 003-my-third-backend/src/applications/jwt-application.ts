/*Импортируем ObjectId из MongoDB для создания ID и типизации.*/
import {ObjectId} from 'mongodb';
/*Импортируем jwt из библиотеки jsonwebtoken для создания и проверки JWT-токенов.*/
import jwt from 'jsonwebtoken';
/*Импортируем объект с переменными окружения, используемыми в приложении.*/
import {settings} from '../settings/settings';
/*Импортируем типы.*/
import {UserDBType} from '../db/types/db-types';

/*Создаем приложение "jwtApplication" для работы с JWT-токенами.*/
export const jwtApplication = {
    /*Создаем метод "createJWT()" для создания JWT-токенов.*/
    async createJWT(user: UserDBType) {
        /*Создаем JWT-токен и возвращаем созданный JWT-токен. При создании JWT-токена отдаем информацию о пользователе,
        некую секретную информацию и срок действия токена.*/
        const token = jwt.sign({userID: user._id}, settings.JWT_SECRET, {expiresIn: '2h'});
        console.log(token);
        return token;
    },

    /*Создаем метод "getUserIDByToken()" для поиска ID пользователей по JWT-токену.*/
    async getUserIDByToken(token: string): Promise<ObjectId | null> {
        try {
            /*Проверяем JWT-токен.*/
            const result: any = jwt.verify(token, settings.JWT_SECRET);
            /*Если проверка JWT-токена прошла успешно, то возвращаем ID пользователя.*/
            return new ObjectId(result.userID);
        } catch (error) {
            /*Если проверка JWT-токена не прошла успешно, то будет перехвачена ошибка, выкинутая методом "jwt.verify()".
            В таком случае возвращаем null.*/
            return null;
        }
    }
}