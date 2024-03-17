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
exports.jwtService = void 0;
const mongodb_1 = require("mongodb");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = require("../settings/settings");
exports.jwtService = {
    /*Создание токена на UI уровне.*/
    createJWT(user) {
        return __awaiter(this, void 0, void 0, function* () {
            /*При создании токена отдаем информацию о пользователе, некую секретную информацию и срок действия токена.*/
            const token = jsonwebtoken_1.default.sign({ userID: user._id }, settings_1.settings.JWT_SECRET, { expiresIn: '1h' });
            /*Возвращаем созданный токен.*/
            return token;
        });
    },
    /*Проверка пользователя по токену.*/
    getUserIDByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /*Проверяем токен на UI уровне.*/
                const result = jsonwebtoken_1.default.verify(token, settings_1.settings.JWT_SECRET);
                /*Если проверка токена прошла успешно, то возвращаем ID пользователя.*/
                return new mongodb_1.ObjectId(result.userID);
            }
            catch (error) {
                /*Если проверка токена не пройдет, то будет ошибка, которую мы перехватываем.*/
                return null;
            }
        });
    }
};
