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
/*Импортируем локальную БД.*/
const db_local_1 = require("../db/db-local");
/*Создаем репозиторий для работы с данными для главной страницы из локальной БД.*/
exports.mainPageRepository = {
    /*Создаем метод "getMainPageContent()" для получения данных для главной страницы из локальной БД. Используем
    "async", чтобы то, что возвращается функцией, оборачивалось в промис.*/
    getMainPageContent() {
        return __awaiter(this, void 0, void 0, function* () {
            /*Получаем данные для главной страницы из локальной БД.*/
            return db_local_1.localDB.mainPageContent;
        });
    }
};
