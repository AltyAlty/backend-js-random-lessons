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
exports.authService = void 0;
/*Импортируем сервисы.*/
const users_service_1 = require("./users-service");
/*Импортируем репозитории.*/
const users_repository_db_mongo_1 = require("../repositories/mongo/users-repository-db-mongo");
/*Создаем сервис "authService" для процессов, связанных с аутентификацией пользователей.*/
exports.authService = {
    /*Создаем метод "checkCredentials()" для проверки наличия пользователя в БД и корректности указанного пароля при
    аутентификации.*/
    checkCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /*Просим репозиторий "usersRepository" найти пользователя по логину или почте для проверки наличия
                пользователя в БД и корректности указанного пароля при аутентификации.*/
                const user = yield users_repository_db_mongo_1.usersRepository.findUserByLoginOrEmailToCheckCredentials(loginOrEmail);
                /*Если пользователь не был найден или почта пользователя еще не была подтверждена, то сообщаем UI о том, что
                есть проблемы с учетными данными пользователя.*/
                if (!user || !user.emailConfirmation.isConfirmed)
                    return false;
                /*Если пользователь был найден в БД и имеет подтвержденную почту, то просим сервис "usersService"
                захэшировать пароль пользователя.*/
                const passwordHash = yield users_service_1.usersService._generateHash(password, user.passwordSalt);
                /*Если только что захэшированный пароль пользователя не совпадает с захэшированным паролем пользователя из
                БД, то сообщаем UI о том, что есть проблемы с учетными данными пользователя.*/
                if (user.passwordHash !== passwordHash)
                    return false;
                /*Если только что захэшированный пароль пользователя совпадает с захэшированным паролем пользователя из БД,
                то сообщаем UI о том, что проблем с учетными данными пользователя нет.*/
                return user;
            }
            catch (error) {
                /*Если сервер Mongo БД не работает, то возвращается ошибка в UI.*/
                throw error;
            }
        });
    },
    /*Создаем метод "confirmEmail()" для подтверждения почты пользователя.*/
    confirmEmail(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /*Просим репозиторий "usersRepository" найти пользователя по почте для проверки наличия пользователя в БД.*/
                const user = yield users_repository_db_mongo_1.usersRepository.findUserByLoginOrEmailToCheckCredentials(email);
                /*Если пользователь не был найден, почта пользователя уже была подтверждена, был указан неверный код для
                подтверждения почты или код для подтверждения почты истек, то сообщаем UI об отказе в подтверждении почты
                пользователя.*/
                if (!user ||
                    user.emailConfirmation.isConfirmed ||
                    user.emailConfirmation.confirmationCode !== code ||
                    user.emailConfirmation.expirationDate < new Date()) {
                    return false;
                }
                /*Если указанных выше проблем не было, то просим репозиторий "usersRepository" подтвердить почту
                пользователя по ID. Получив результат, возвращаем его в UI. Порядок работы такой:
                1. Если почта была подтверждена - возвращается true в UI.
                2. Если почта не была подтверждена - возвращается false в UI.*/
                return yield users_repository_db_mongo_1.usersRepository.updateConfirmation(user._id);
            }
            catch (error) {
                /*Если сервер Mongo БД не работает, то возвращается ошибка в UI.*/
                throw error;
            }
        });
    }
};
