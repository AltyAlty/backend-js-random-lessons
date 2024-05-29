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
exports.usersService = void 0;
const users_repository_db_1 = require("../repositories/users-repository-db");
const mongodb_1 = require("mongodb");
const bcrypt_1 = __importDefault(require("bcrypt"));
const email_manager_1 = require("../managers/email-manager");
exports.usersService = {
    /*Создание нового пользователя на BLL уровне.*/
    createUser(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Получаем хэш-соль. В качестве параметра указываем количество раундов, что является цифрой 2 в какой-то
            степени. У нас это 2 в 10 степени. Это число каким-то образом склеится с солью.*/
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(password, passwordSalt); // Генерируем хэш.
            const newUser = {
                _id: new mongodb_1.ObjectId,
                userName: login,
                email: email,
                passwordHash: passwordHash,
                passwordSalt: passwordSalt,
                createdAt: new Date(),
                emailConfirmation: {
                    confirmationCode: (+(new Date())).toString(),
                    expirationDate: new Date(new Date().getTime() + (10 * 60 * 1000)),
                    isConfirmed: false, // Подтверждена ли почта.
                }
            };
            yield email_manager_1.emailManager.sendEmailConfirmationMessage(newUser); // Отправляем письмо для подтверждения.
            return users_repository_db_1.usersRepository.createUser(newUser); // Отправляем данные на DAL уровень.
        });
    },
    /*Поиск пользователя по ID на BLL уровне.*/
    findUserByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_repository_db_1.usersRepository.findUserByID(id);
        });
    },
    /*Логинизация пользователя на BLL уровне.*/
    checkCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Ищем в БД пользователя на уровне DAL.*/
            const user = yield users_repository_db_1.usersRepository.findByLoginOrEmail(loginOrEmail);
            /*Если пользователя нет, то отказываем в логинизации.*/
            if (!user || !user.emailConfirmation.isConfirmed)
                return false;
            /*Если пользователь есть в БД, то генерируем хэш.*/
            const passwordHash = yield this._generateHash(password, user.passwordSalt);
            /*Если сгенерированный хэш не совпадает с хэшем из БД, то отказываем в логинизации.*/
            if (user.passwordHash !== passwordHash)
                return false;
            /*Если же сгенерированный хэш совпадает с хэшем из БД, то разрешаем логинизацию.*/
            return user;
        });
    },
    /*Генерация хэша для пароля.*/
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, salt);
            // console.log(`hash: ${hash}`);
            return hash;
        });
    }
};
