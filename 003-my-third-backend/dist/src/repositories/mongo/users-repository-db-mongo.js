"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRepository = void 0;
/*Импортируем коллекции из Mongo БД.*/
const db_mongo_1 = require("../../db/db-mongo");
/*Импортируем функцию "mapUserDBTypeToUserViewModel()" для преобразования объектов типа "UserDBType" в объекты типа
"UserViewModel".*/
const users_service_1 = require("../../domain/users-service");
/*Создаем репозиторий "usersRepository" для работы с пользователями из Mongo БД.*/
exports.usersRepository = {
    /*Создаем метод "findAllUsers()" для поиска всех пользователей в Mongo БД.*/
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            /*Ищем всех пользователей в Mongo БД. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 пользователи были найдены - возвращается массив с пользователями в BLL.
            1.2 пользователи не были найдены - возвращается пустой массив в BLL.
            2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
            try {
                const foundUsers = yield db_mongo_1.usersCollection.find().sort('createdAt', -1).toArray();
                return foundUsers.map(users_service_1.mapUserDBTypeToUserViewModel);
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "findUserByID()" для поиска пользователя по ID в Mongo БД.*/
    findUserByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Ищем пользователя по ID в Mongo БД. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 пользователь был найден - возвращаются данные по найденному пользователю в BLL.
            1.2 пользователь не был найден - возвращается null в BLL.
            2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
            try {
                const foundUser = yield db_mongo_1.usersCollection.findOne({ _id: id });
                if (!foundUser)
                    return null;
                return (0, users_service_1.mapUserDBTypeToUserViewModel)(foundUser);
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "findUserByLoginOrEmail()" для поиска пользователя по логину или почте в Mongo БД.*/
    findUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Ищем пользователя по логину или почте в Mongo БД. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 пользователь был найден - возвращаются данные по найденному пользователю в BLL.
            1.2 пользователь не был найден - возвращается null в BLL.
            2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
            try {
                const foundUser = yield db_mongo_1.usersCollection.findOne({ $or: [{ userName: loginOrEmail.login }, { email: loginOrEmail.email }] });
                if (!foundUser)
                    return null;
                return (0, users_service_1.mapUserDBTypeToUserViewModel)(foundUser);
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "createUser()" для создания нового пользователя с логином, почтой и паролем в Mongo БД.*/
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Создаем нового пользователя с логином, почтой и паролем в Mongo БД. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 пользователь был создан - возвращаются данные по созданному пользователю в BLL.
            1.2 пользователь не был создан - возвращается null в BLL.
            2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
            try {
                yield db_mongo_1.usersCollection.insertOne(user);
                const createdUser = yield this.findUserByLoginOrEmail({ email: user.email });
                if (!createdUser)
                    return null;
                return createdUser;
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "findUserToCheckCredentialsByLoginOrEmail()" для поиска пользователя по логину или почте в Mongo БД
    для проверки наличия пользователя в Mongo БД и корректности указанного пароля при аутентификации.*/
    findUserToCheckCredentialsByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Ищем пользователя по логину или почте в Mongo БД. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 пользователь был найден - возвращаются данные по найденному пользователю в BLL.
            1.2 пользователь не был найден - возвращается null в BLL.
            2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
            try {
                const foundUser = yield db_mongo_1.usersCollection.findOne({ $or: [{ userName: loginOrEmail }, { email: loginOrEmail }] });
                if (!foundUser)
                    return null;
                return foundUser;
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "updateConfirmation()" для подтверждения почты пользователя по ID в Mongo БД.*/
    updateConfirmation(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Подтверждаем почту пользователя в Mongo БД. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 почта была подтверждена - возвращается true в BLL.
            1.2 почта не была подтверждена - возвращается false в BLL.
            2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
            try {
                const result = yield db_mongo_1.usersCollection.updateOne({ _id: userID }, { $set: { 'emailConfirmation.isConfirmed': true } });
                return result.modifiedCount === 1;
            }
            catch (error) {
                throw error;
            }
        });
    }
};
