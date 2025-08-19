/*Импортируем bcrypt из библиотеки bcrypt для создания хэш-соли и хэширования паролей.*/
import bcrypt from 'bcrypt';
/*Импортируем ObjectId из MongoDB для создания ID и типизации.*/
import {ObjectId} from 'mongodb';
/*Импортируем репозиторий для работы с пользователями из Mongo БД.*/
import {usersRepository} from '../repositories/mongo/users-repository-db-mongo';
/*Импортируем менеджеры.*/
import {emailManager} from '../managers/email-manager';
/*Импортируем типы.*/
import {UserDBType} from '../db/types/db-types';
/*Импортируем модели.*/
import {UserViewModel} from '../models/views/UserViewModel';
import {
    GetUserByLoginOrEmailWithQueryParamsInputModel
} from '../models/inputs/GetUserByLoginOrEmailWithQueryParamsInputModel';

/*Создаем вспомогательную функцию "mapUserDBTypeToUserViewModel()" для преобразования объектов типа "UserDBType" в
объекты типа "UserViewModel".*/
export const mapUserDBTypeToUserViewModel = (user: UserDBType): UserViewModel => {
    return {
        id: user._id.toString(),
        userName: user.userName,
        email: user.email
    };
};

/*Создаем сервис "booksService" для работы с пользователями.*/
export const usersService = {
    /*Создаем метод "findUserByLoginOrEmail()" для поиска пользователя по логину или почте.*/
    async findUserByLoginOrEmail(loginOrEmail: GetUserByLoginOrEmailWithQueryParamsInputModel):
        Promise<UserViewModel | null> {
        /*Просим репозиторий "usersRepository" найти пользователя по логину или почте. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 пользователь был найден - возвращаются данные по найденному пользователю в UI.
        1.2 пользователь не был найден - возвращается null в UI.
        2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
        try { return usersRepository.findUserByLoginOrEmail(loginOrEmail) } catch (error) { throw error }
    },

    /*Создаем метод "findAllUsers()" для поиска всех пользователей.*/
    async findAllUsers(): Promise<UserViewModel[]> {
        /*Просим репозиторий "usersRepository" найти всех пользователей. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 пользователи были найдены - возвращается массив с пользователями в UI.
        1.2 пользователи не были найдены - возвращается пустой массив в UI.
        2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
        try { return await usersRepository.findAllUsers() } catch (error) { throw error }
    },

    /*Создаем метод "findUserByID()" для поиск пользователя по ID.*/
    async findUserByID(id: string): Promise<UserViewModel | null> {
        /*Просим репозиторий "usersRepository" найти пользователя по ID. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 пользователь был найден - возвращаются данные по найденному пользователю в UI.
        1.2 пользователь не был найден - возвращается null в UI.
        2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
        try { return usersRepository.findUserByID(new ObjectId(id)) } catch (error) { throw error }
    },

    /*Создаем метод "createUser()" для создания нового пользователя с логином, почтой и паролем.*/
    async createUser(login: string, email: string, password: string): Promise<UserViewModel | null> {
        /*Генерируем хэш-соль. В качестве параметра для генерации хэш-соли указываем количество раундов, что является
        степенью для цифры 2. Это число каким-то образом склеивается с паролем при хешировании пароля.*/
        const passwordSalt = await bcrypt.genSalt(10);
        /*Хэшируем пароль на основе пароля пользователя и хэш-соли.*/
        const passwordHash = await this._generateHash(password, passwordSalt);

        /*Создаем объект для пользователя, не указывая в нем пароль.s*/
        const newUser: UserDBType = {
            _id: new ObjectId,
            userName: login,
            email: email,
            passwordHash: passwordHash,
            /*Хэш-сол лучше здесь не сохранять, так как она содержится в захэшированном пароле.*/
            passwordSalt: passwordSalt,
            createdAt: new Date(),
            /*Объект с данными, которые нужны для подтверждения почты пользователя при регистрации.*/
            emailConfirmation: {
                /*Генерируем код для подтверждения почты.*/
                confirmationCode: (+(new Date())).toString(),
                /*Генерируем дату истечения кода для подтверждения почты.*/
                expirationDate: new Date(new Date().getTime() + (10 * 60 * 1000)),
                /*Флаг, указывающий подтверждена ли почта.*/
                isConfirmed: false
            }
        };

        try {
            /*Просим менеджера "emailManager" отправить письмо для подтверждения почты пользователя при регистрации.*/
            await emailManager.sendEmailConfirmationMail(newUser);

            /*Просим репозиторий "usersRepository" создать нового пользователя с логином, почтой и паролем. Порядок
            работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 пользователь был создан - возвращаются данные по созданному пользователю в UI.
            1.2 пользователь не был создан - возвращается null в UI.
            2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
            return await usersRepository.createUser(newUser);
        } catch (error) {
            throw error;
        }
    },

    /*Создаем вспомогательный метод "_generateHash()" для хэширования паролей пользователей.*/
    async _generateHash(password: string, salt: string) {
        /*Хэшируем пароль на основе пароля пользователя и хэш-соли.*/
        return await bcrypt.hash(password, salt);
    }
}