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
exports.feedbacksRepository = void 0;
/*Импортируем коллекции из Mongo БД.*/
const db_mongo_1 = require("../../db/db-mongo");
/*Импортируем функцию "mapFeedbackDBTypeToFeedbackViewModel()" для преобразования объектов типа "FeedbackDBType" в
объекты типа "FeedbackViewModel".*/
const feedbacks_service_1 = require("../../domain/feedbacks-service");
/*Создаем репозиторий "feedbacksRepository" для работы с отзывами из Mongo БД.*/
exports.feedbacksRepository = {
    /*Создаем метод "findAllFeedbacks()" для поиска всех отзывов в Mongo БД.*/
    findAllFeedbacks() {
        return __awaiter(this, void 0, void 0, function* () {
            /*Ищем все отзывы в Mongo БД. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 отзывы были найдены - возвращается массив с отзывами в BLL.
            1.2 отзывы не были найдены - возвращается пустой массив в BLL.
            2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
            try {
                const foundFeedbacks = yield db_mongo_1.feedbacksCollection.find().sort('createdAt', -1).toArray();
                return foundFeedbacks.map(feedbacks_service_1.mapFeedbackDBTypeToFeedbackViewModel);
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "createFeedback()" для создания нового отзыва в Mongo БД.*/
    createFeedback(newFeedback) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Добавляем отзыв в Mongo БД. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 отзыв был добавлен - возвращается true в BLL.
            1.2 отзыв не был добавлен - возвращается false в BLL.
            2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
            try {
                const result = yield db_mongo_1.feedbacksCollection.insertOne(newFeedback);
                return !!result.insertedId;
            }
            catch (error) {
                throw error;
            }
        });
    }
};
