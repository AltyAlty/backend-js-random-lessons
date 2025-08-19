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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = exports.mapUserDBTypeToUserViewModel = void 0;
/*Импортируем bcrypt из библиотеки bcrypt для создания хэш-соли и хэширования паролей.*/
const bcrypt_1 = __importDefault(require("bcrypt"));
/*Импортируем ObjectId из MongoDB для создания ID и типизации.*/
const mongodb_1 = require("mongodb");
/*Импортируем репозиторий для работы с пользователями из Mongo БД.*/
const users_repository_db_mongo_1 = require("../repositories/mongo/users-repository-db-mongo");
/*Импортируем менеджеры.*/
const email_manager_1 = require("../managers/email-manager");
/*Создаем вспомогательную функцию "mapUserDBTypeToUserViewModel()" для преобразования объектов типа "UserDBType" в
объекты типа "UserViewModel".*/
const mapUserDBTypeToUserViewModel = (user) => {
    return {
        id: user._id.toString(),
        userName: user.userName,
        email: user.email
    };
};
exports.mapUserDBTypeToUserViewModel = mapUserDBTypeToUserViewModel;
/*Создаем сервис "booksService" для работы с пользователями.*/
exports.usersService = {
    /*Создаем метод "findUserByLoginOrEmail()" для поиска пользователя по логину или почте.*/
    findUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Просим репозиторий "usersRepository" найти пользователя по логину или почте. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 пользователь был найден - возвращаются данные по найденному пользователю в UI.
            1.2 пользователь не был найден - возвращается null в UI.
            2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
            try {
                return users_repository_db_mongo_1.usersRepository.findUserByLoginOrEmail(loginOrEmail);
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "findAllUsers()" для поиска всех пользователей.*/
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            /*Просим репозиторий "usersRepository" найти всех пользователей. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 пользователи были найдены - возвращается массив с пользователями в UI.
            1.2 пользователи не были найдены - возвращается пустой массив в UI.
            2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
            try {
                return yield users_repository_db_mongo_1.usersRepository.findAllUsers();
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "findUserByID()" для поиск пользователя по ID.*/
    findUserByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Просим репозиторий "usersRepository" найти пользователя по ID. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 пользователь был найден - возвращаются данные по найденному пользователю в UI.
            1.2 пользователь не был найден - возвращается null в UI.
            2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
            try {
                return users_repository_db_mongo_1.usersRepository.findUserByID(new mongodb_1.ObjectId(id));
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "createUser()" для создания нового пользователя с логином, почтой и паролем.*/
    createUser(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Генерируем хэш-соль. В качестве параметра для генерации хэш-соли указываем количество раундов, что является
            степенью для цифры 2. Это число каким-то образом склеивается с паролем при хешировании пароля.*/
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            /*Хэшируем пароль на основе пароля пользователя и хэш-соли.*/
            const passwordHash = yield this._generateHash(password, passwordSalt);
            /*Создаем объект для пользователя, не указывая в нем пароль.s*/
            const newUser = {
                _id: new mongodb_1.ObjectId,
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
                yield email_manager_1.emailManager.sendEmailConfirmationMail(newUser);
                /*Просим репозиторий "usersRepository" создать нового пользователя с логином, почтой и паролем. Порядок
                работы такой:
                1. Если сервер Mongo БД работает и:
                1.1 пользователь был создан - возвращаются данные по созданному пользователю в UI.
                1.2 пользователь не был создан - возвращается null в UI.
                2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
                return yield users_repository_db_mongo_1.usersRepository.createUser(newUser);
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем вспомогательный метод "_generateHash()" для хэширования паролей пользователей.*/
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Хэшируем пароль на основе пароля пользователя и хэш-соли.*/
            return yield bcrypt_1.default.hash(password, salt);
        });
    }
};
