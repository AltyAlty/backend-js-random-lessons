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
exports.mainPageRepository = void 0;
/*Импортируем коллекции из Mongo БД.*/
const db_mongo_1 = require("../../db/db-mongo");
/*Создаем репозиторий "mainPageRepository" для работы с данными для главной страницы из Mongo БД.*/
exports.mainPageRepository = {
    /*Создаем метод "getMainPageContent()" для получения данных для главной страницы из Mongo БД.*/
    getMainPageContent() {
        return __awaiter(this, void 0, void 0, function* () {
            /*Получаем данные для главной страницы из Mongo БД. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 данные для главной страницы были найдены - возвращаются данные для главной страница в BLL.
            1.2 данные для главной страницы не были найдены - возвращается null в BLL.
            2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
            try {
                const content = yield db_mongo_1.mainPageContentCollection.findOne({});
                if (!content)
                    return null;
                return content.content;
            }
            catch (error) {
                throw error;
            }
        });
    }
};
