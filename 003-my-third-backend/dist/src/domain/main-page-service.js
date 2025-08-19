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
exports.mainPageService = void 0;
/*Импортируем репозитории.*/
const main_page_repository_db_mongo_1 = require("../repositories/mongo/main-page-repository-db-mongo");
/*Создаем сервис "mainPageService" для работы с данными для главной страницы.*/
exports.mainPageService = {
    /*Создаем метод "getMainPageContent()" для поиска данных для главной страницы. Используем "async", чтобы то, что
    возвращается функцией, оборачивалось в промис.*/
    getMainPageContent() {
        return __awaiter(this, void 0, void 0, function* () {
            /*Просим репозиторий "mainPageRepository" найти данные для главной страницы. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 данные для главной страницы были найдены - возвращаются данные для главной страница в UI.
            1.2 данные для главной страницы не были найдены - возвращается null в UI.
            2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
            try {
                return yield main_page_repository_db_mongo_1.mainPageRepository.getMainPageContent();
            }
            catch (error) {
                throw error;
            }
        });
    }
};
