/*Импортируем сервисы.*/
import {usersService} from './users-service';
/*Импортируем репозитории.*/
import {usersRepository} from '../repositories/mongo/users-repository-db-mongo';
/*Импортируем типы.*/
import {UserDBType} from '../db/types/db-types';

/*Создаем сервис "authService" для процессов, связанных с аутентификацией пользователей.*/
export const authService = {
    /*Создаем метод "checkCredentials()" для проверки наличия пользователя в БД и корректности указанного пароля при
    аутентификации.*/
    async checkCredentials(loginOrEmail: string, password: string): Promise<UserDBType | false> {
        try {
            /*Просим репозиторий "usersRepository" найти пользователя по логину или почте для проверки наличия
            пользователя в БД и корректности указанного пароля при аутентификации.*/
            const user: UserDBType | null = await
                usersRepository.findUserToCheckCredentialsByLoginOrEmail(loginOrEmail);
            /*Если пользователь не был найден или почта пользователя еще не была подтверждена, то сообщаем UI о том, что
            есть проблемы с учетными данными пользователя.*/
            if (!user || !user.emailConfirmation.isConfirmed) return false;
            /*Если пользователь был найден в БД и имеет подтвержденную почту, то просим сервис "usersService"
            захэшировать пароль пользователя.*/
            const passwordHash = await usersService._generateHash(password, user.passwordSalt);
            /*Если только что захэшированный пароль пользователя не совпадает с захэшированным паролем пользователя из
            БД, то сообщаем UI о том, что есть проблемы с учетными данными пользователя.*/
            if (user.passwordHash !== passwordHash) return false;
            /*Если только что захэшированный пароль пользователя совпадает с захэшированным паролем пользователя из БД,
            то сообщаем UI о том, что проблем с учетными данными пользователя нет.*/
            return user;
        } catch (error) {
            /*Если сервер Mongo БД не работает, то возвращается ошибка в UI.*/
            throw error;
        }
    },

    /*Создаем метод "confirmEmail()" для подтверждения почты пользователя.*/
    async confirmEmail(email: string, code: string): Promise<boolean> {
        try {
            /*Просим репозиторий "usersRepository" найти пользователя по почте для проверки наличия пользователя в БД.*/
            const user: UserDBType | null = await usersRepository.findUserToCheckCredentialsByLoginOrEmail(email);

            /*Если пользователь не был найден, почта пользователя уже была подтверждена, был указан неверный код для
            подтверждения почты или код для подтверждения почты истек, то сообщаем UI об отказе в подтверждении почты
            пользователя.*/
            if (
                !user ||
                user.emailConfirmation.isConfirmed ||
                user.emailConfirmation.confirmationCode !== code ||
                user.emailConfirmation.expirationDate < new Date()
            ) {
                return false;
            }

            /*Если указанных выше проблем не было, то просим репозиторий "usersRepository" подтвердить почту
            пользователя по ID. Получив результат, возвращаем его в UI. Порядок работы такой:
            1. Если почта была подтверждена - возвращается true в UI.
            2. Если почта не была подтверждена - возвращается false в UI.*/
            return await usersRepository.updateConfirmation(user._id);
        } catch (error) {
            /*Если сервер Mongo БД не работает, то возвращается ошибка в UI.*/
            throw error;
        }
    }
};