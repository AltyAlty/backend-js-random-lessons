import {usersRepository} from '../repositories/users-repository-db';
import {ObjectId} from 'mongodb';
import bcrypt from 'bcrypt';
import {UserDBType} from '../db/db';
import {emailManager} from '../managers/email-manager';

export const usersService = {
    /*Создание нового пользователя на BLL уровне.*/
    async createUser(login: string, email: string, password: string): Promise<UserDBType> {
        /*Получаем хэш-соль. В качестве параметра указываем количество раундов, что является цифрой 2 в какой-то
        степени. У нас это 2 в 10 степени. Это число каким-то образом склеится с солью.*/
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(password, passwordSalt); // Генерируем хэш.

        const newUser: UserDBType = { // Создаем объект для пользователя, не сохраняя в нем сам пароль.
            _id: new ObjectId,
            userName: login,
            email: email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt, // На самом деле лучше соль не сохранять, так как она содержится в хэше.
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: (+(new Date())).toString(), // Код подтверждения почты.
                expirationDate: new Date(new Date().getTime() + (10 * 60 * 1000)), // Дата истечения кода.
                isConfirmed: false, // Подтверждена ли почта.
            }
        };

        await emailManager.sendEmailConfirmationMessage(newUser); // Отправляем письмо для подтверждения.
        return usersRepository.createUser(newUser); // Отправляем данные на DAL уровень.
    },

    /*Поиск пользователя по ID на BLL уровне.*/
    async findUserByID(id: ObjectId): Promise<UserDBType | null> {
        return usersRepository.findUserByID(id);
    },

    /*Логинизация пользователя на BLL уровне.*/
    async checkCredentials(loginOrEmail: string, password: string) {
        /*Ищем в БД пользователя на уровне DAL.*/
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        /*Если пользователя нет, то отказываем в логинизации.*/
        if (!user || !user.emailConfirmation.isConfirmed) return false;
        /*Если пользователь есть в БД, то генерируем хэш.*/
        const passwordHash = await this._generateHash(password, user.passwordSalt);
        /*Если сгенерированный хэш не совпадает с хэшем из БД, то отказываем в логинизации.*/
        if (user.passwordHash !== passwordHash) return false;
        /*Если же сгенерированный хэш совпадает с хэшем из БД, то разрешаем логинизацию.*/
        return user;
    },

    /*Генерация хэша для пароля.*/
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt);
        // console.log(`hash: ${hash}`);
        return hash;
    }
}