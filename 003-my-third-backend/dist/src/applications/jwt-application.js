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
exports.jwtApplication = void 0;
/*Импортируем ObjectId из MongoDB для создания ID и типизации.*/
const mongodb_1 = require("mongodb");
/*Импортируем jwt из библиотеки jsonwebtoken для создания и проверки JWT-токенов.*/
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/*Импортируем объект с переменными окружения, используемыми в приложении.*/
const settings_1 = require("../settings/settings");
/*Создаем приложение "jwtApplication" для работы с JWT-токенами.*/
exports.jwtApplication = {
    /*Создаем метод "createJWT()" для создания JWT-токенов.*/
    createJWT(user) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Создаем JWT-токен и возвращаем созданный JWT-токен. При создании JWT-токена отдаем информацию о пользователе,
            некую секретную информацию и срок действия токена.*/
            const token = jsonwebtoken_1.default.sign({ userID: user._id }, settings_1.settings.JWT_SECRET, { expiresIn: '2h' });
            console.log(token);
            return token;
        });
    },
    /*Создаем метод "getUserIDByToken()" для поиска ID пользователей по JWT-токену.*/
    getUserIDByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /*Проверяем JWT-токен.*/
                const result = jsonwebtoken_1.default.verify(token, settings_1.settings.JWT_SECRET);
                /*Если проверка JWT-токена прошла успешно, то возвращаем ID пользователя.*/
                return new mongodb_1.ObjectId(result.userID);
            }
            catch (error) {
                /*Если проверка JWT-токена не прошла успешно, то будет перехвачена ошибка, выкинутая методом "jwt.verify()".
                В таком случае возвращаем null.*/
                return null;
            }
        });
    }
};
