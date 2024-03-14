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
const db_1 = require("../db/db");
exports.usersRepository = {
    /*Поиск всех пользователей на DAL уровне.*/
    getAllusers() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.usersCollection
                .find()
                .sort('createdAt', -1)
                .toArray();
        });
    },
    /*Создание нового пользователя на DAL уровне.*/
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.usersCollection.insertOne(user);
            console.log('DAL' + result);
            return user;
        });
    },
    /*Поиск пользователя по ID на DAL уровне.*/
    findUserByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield db_1.usersCollection.findOne({ _id: id });
            if (user) {
                return user;
            }
            else {
                return null;
            }
        });
    },
    /*Поиск пользователя по логину или почте на DAL уровне.*/
    findByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.usersCollection.findOne({ $or: [{ email: loginOrEmail }, { userName: loginOrEmail }] });
            return user;
        });
    }
};
