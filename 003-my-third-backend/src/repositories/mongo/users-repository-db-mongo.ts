/*Импортируем коллекции из Mongo БД.*/
import {usersCollection} from '../../db/db-mongo';
/*Импортируем для типизации.*/
import {ObjectId} from 'mongodb';
/*Импортируем функцию "mapUserDBTypeToUserViewModel()" для преобразования объектов типа "UserDBType" в объекты типа
"UserViewModel".*/
import {mapUserDBTypeToUserViewModel} from '../../domain/users-service';
/*Импортируем Mongoose модели.*/
import {UserModel} from '../../db/schemas/schemas';
/*Импортируем типы.*/
import {UserDBType} from '../../db/types/db-types';
/*Импортируем модели.*/
import {UserViewModel} from '../../models/views/UserViewModel';
import {
    GetUserByLoginOrEmailWithQueryParamsInputModel
} from '../../models/inputs/GetUserByLoginOrEmailWithQueryParamsInputModel';

/*Создаем репозиторий "usersRepository" для работы с пользователями из Mongo БД.*/
export const usersRepository = {
    /*Создаем метод "findAllUsers()" для поиска всех пользователей в Mongo БД.*/
    async findAllUsers(): Promise<UserViewModel[]> {
        /*Ищем всех пользователей в Mongo БД. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 пользователи были найдены - возвращается массив с пользователями в BLL.
        1.2 пользователи не были найдены - возвращается пустой массив в BLL.
        2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
        try {
            // const foundUsers: UserDBType[] = await usersCollection.find().sort('createdAt', -1).toArray();
            /*Аналог через Mongoose.*/
            const foundUsers = await UserModel.find().sort('createdAt').lean<UserDBType[]>();
            return foundUsers.map(mapUserDBTypeToUserViewModel);
        } catch (error) {
            throw error;
        }
    },

    /*Создаем метод "findUserByID()" для поиска пользователя по ID в Mongo БД.*/
    async findUserByID(id: ObjectId): Promise<UserViewModel | null> {
        /*Ищем пользователя по ID в Mongo БД. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 пользователь был найден - возвращаются данные по найденному пользователю в BLL.
        1.2 пользователь не был найден - возвращается null в BLL.
        2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
        try {
            // const foundUser: UserDBType | null = await usersCollection.findOne({_id: id});
            /*Аналог через Mongoose.*/
            const foundUser: UserDBType | null = await UserModel.findById(id.toString());
            if (!foundUser) return null;
            return mapUserDBTypeToUserViewModel(foundUser);
        } catch (error) {
            throw error;
        }
    },

    /*Создаем метод "findUserByLoginOrEmail()" для поиска пользователя по логину или почте в Mongo БД.*/
    async findUserByLoginOrEmail(loginOrEmail: GetUserByLoginOrEmailWithQueryParamsInputModel):
        Promise<UserViewModel | null> {
        /*Ищем пользователя по логину или почте в Mongo БД. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 пользователь был найден - возвращаются данные по найденному пользователю в BLL.
        1.2 пользователь не был найден - возвращается null в BLL.
        2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
        try {
            // const foundUser: UserDBType | null = await usersCollection.findOne(
            //     {$or: [{userName: loginOrEmail.login}, {email: loginOrEmail.email}]}
            // );

            /*Аналог через Mongoose.*/
            const foundUser: UserDBType | null = await UserModel.findOne(
                {$or: [{userName: loginOrEmail.login}, {email: loginOrEmail.email}]}
            );

            if (!foundUser) return null;
            return mapUserDBTypeToUserViewModel(foundUser);
        } catch (error) {
            throw error;
        }
    },

    /*Создаем метод "createUser()" для создания нового пользователя с логином, почтой и паролем в Mongo БД.*/
    async createUser(user: UserDBType): Promise<UserViewModel | null> {
        /*Создаем нового пользователя с логином, почтой и паролем в Mongo БД. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 пользователь был создан - возвращаются данные по созданному пользователю в BLL.
        1.2 пользователь не был создан - возвращается null в BLL.
        2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
        try {
            // await usersCollection.insertOne(user);
            /*Аналог через Mongoose.*/
            await UserModel.create(user);
            const createdUser: UserViewModel | null = await this.findUserByLoginOrEmail({email: user.email});
            if (!createdUser) return null;
            return createdUser;
        } catch (error) {
            throw error;
        }
    },

    /*Создаем метод "findUserByLoginOrEmailToCheckCredentials()" для поиска пользователя по логину или почте в Mongo БД
    для проверки наличия пользователя в Mongo БД и корректности указанного пароля при аутентификации.*/
    async findUserByLoginOrEmailToCheckCredentials(loginOrEmail: string): Promise<UserDBType | null> {
        /*Ищем пользователя по логину или почте в Mongo БД. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 пользователь был найден - возвращаются данные по найденному пользователю в BLL.
        1.2 пользователь не был найден - возвращается null в BLL.
        2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
        try {
            // const foundUser: UserDBType | null = await usersCollection.findOne(
            //     {$or: [{userName: loginOrEmail}, {email: loginOrEmail}]}
            // );

            /*Аналог через Mongoose.*/
            const foundUser: UserDBType | null = await UserModel.findOne(
                {$or: [{userName: loginOrEmail}, {email: loginOrEmail}]}
            );

            if (!foundUser) return null;
            return foundUser;
        } catch (error) {
            throw error;
        }
    },

    /*Создаем метод "updateConfirmation()" для подтверждения почты пользователя по ID в Mongo БД.*/
    async updateConfirmation(userID: ObjectId): Promise<boolean> {
        /*Подтверждаем почту пользователя в Mongo БД. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 почта была подтверждена - возвращается true в BLL.
        1.2 почта не была подтверждена - возвращается false в BLL.
        2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
        try {
            // const result = await usersCollection.updateOne(
            //     {_id: userID}, {$set: {'emailConfirmation.isConfirmed': true}}
            // );

            // return result.modifiedCount === 1;

            /*Аналог через Mongoose.*/
            const user = await UserModel.findById(userID);
            if (!user || !user.emailConfirmation) return false;
            user.emailConfirmation.isConfirmed = true;
            await user.save();
            return true;
        } catch (error) {
            throw error;
        }
    }
};