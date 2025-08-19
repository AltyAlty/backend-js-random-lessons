/*Импортируем репозитории.*/
import {feedbacksRepository} from '../repositories/mongo/feedbacks-repository-db-mongo';
/*Импортируем для типизации.*/
import {ObjectId} from 'mongodb';
/*Импортируем типы.*/
import {FeedbackDBType} from '../db/types/db-types';
/*Импортируем модели.*/
import {FeedbackViewModel} from '../models/views/FeedbackViewModel';

/*Создаем вспомогательную функцию "mapFeedbackDBTypeToFeedbackViewModel()" для преобразования объектов типа
"FeedbackDBType" в объекты типа "FeedbackViewModel".*/
export const mapFeedbackDBTypeToFeedbackViewModel = (feedback: FeedbackDBType): FeedbackViewModel => {
    return {
        userID: feedback.userID.toString(),
        bookID: feedback.bookID,
        comment: feedback.comment,
        createdAt: feedback.createdAt
    };
};

/*Создаем сервис "feedbacksService" для работы с отзывами.*/
export const feedbacksService = {
    /*Создаем метод "findAllFeedbacks()" для поиска всех отзывов.*/
    async findAllFeedbacks(): Promise<FeedbackViewModel[]> {
        /*Просим репозиторий "feedbacksRepository" найти все отзывы. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 отзывы были найдены - возвращается массив с отзывами в UI.
        1.2 отзывы не были найдены - возвращается пустой массив в UI.
        2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
        try { return feedbacksRepository.findAllFeedbacks() } catch (error) { throw error }
    },

    /*Создаем метод "createFeedback()" для создания нового отзыва.*/
    async createFeedback(comment: string, userID: string, bookID: number): Promise<boolean> {
        /*Формируем объект для отзыва для передачи его в DAL.*/
        const newFeedback: FeedbackDBType = {
            _id: new ObjectId,
            userID: new ObjectId(userID),
            bookID: bookID,
            comment: comment,
            createdAt: new Date()
        };

        /*Просим репозиторий "feedbacksRepository" создать новый отзыв. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 отзыв был добавлен - возвращается true в UI.
        1.2 отзыв не был добавлен - возвращается false в UI.
        2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
        try { return feedbacksRepository.createFeedback(newFeedback) } catch (error) { throw error }
    }
};