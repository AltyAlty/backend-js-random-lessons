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
exports.feedbacksService = exports.mapFeedbackDBTypeToFeedbackViewModel = void 0;
/*Импортируем репозитории.*/
const feedbacks_repository_db_mongo_1 = require("../repositories/mongo/feedbacks-repository-db-mongo");
/*Импортируем для типизации.*/
const mongodb_1 = require("mongodb");
/*Создаем вспомогательную функцию "mapFeedbackDBTypeToFeedbackViewModel()" для преобразования объектов типа
"FeedbackDBType" в объекты типа "FeedbackViewModel".*/
const mapFeedbackDBTypeToFeedbackViewModel = (feedback) => {
    return {
        userID: feedback.userID.toString(),
        bookID: feedback.bookID,
        comment: feedback.comment,
        createdAt: feedback.createdAt
    };
};
exports.mapFeedbackDBTypeToFeedbackViewModel = mapFeedbackDBTypeToFeedbackViewModel;
/*Создаем сервис "feedbacksService" для работы с отзывами.*/
exports.feedbacksService = {
    /*Создаем метод "findAllFeedbacks()" для поиска всех отзывов.*/
    findAllFeedbacks() {
        return __awaiter(this, void 0, void 0, function* () {
            /*Просим репозиторий "feedbacksRepository" найти все отзывы. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 отзывы были найдены - возвращается массив с отзывами в UI.
            1.2 отзывы не были найдены - возвращается пустой массив в UI.
            2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
            try {
                return feedbacks_repository_db_mongo_1.feedbacksRepository.findAllFeedbacks();
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "createFeedback()" для создания нового отзыва.*/
    createFeedback(comment, userID, bookID) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Формируем объект для отзыва для передачи его в DAL.*/
            const newFeedback = {
                _id: new mongodb_1.ObjectId,
                userID: new mongodb_1.ObjectId(userID),
                bookID: bookID,
                comment: comment,
                createdAt: new Date()
            };
            /*Просим репозиторий "feedbacksRepository" создать новый отзыв. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 отзыв был добавлен - возвращается true в UI.
            1.2 отзыв не был добавлен - возвращается false в UI.
            2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
            try {
                return feedbacks_repository_db_mongo_1.feedbacksRepository.createFeedback(newFeedback);
            }
            catch (error) {
                throw error;
            }
        });
    }
};
