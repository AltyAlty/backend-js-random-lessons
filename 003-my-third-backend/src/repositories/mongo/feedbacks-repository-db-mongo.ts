/*Импортируем коллекции из Mongo БД.*/
import {feedbacksCollection} from '../../db/db-mongo';
/*Импортируем функцию "mapFeedbackDBTypeToFeedbackViewModel()" для преобразования объектов типа "FeedbackDBType" в
объекты типа "FeedbackViewModel".*/
import {mapFeedbackDBTypeToFeedbackViewModel} from '../../domain/feedbacks-service';
/*Импортируем Mongoose модели.*/
import {FeedbackModel} from '../../db/schemas/schemas';
/*Импортируем Types из Mongoose, чтобы использовать конструкторы типов данных, которые понимает Mongoose, для
преобразования объектов типа ObjectId из MongoDB в объекты, понятные Mongoose.*/
import {Types} from 'mongoose';
/*Импортируем типы.*/
import {FeedbackDBType} from '../../db/types/db-types';
/*Импортируем модели.*/
import {FeedbackViewModel} from '../../models/views/FeedbackViewModel';


/*Создаем репозиторий "feedbacksRepository" для работы с отзывами из Mongo БД.*/
export const feedbacksRepository = {
    /*Создаем метод "findAllFeedbacks()" для поиска всех отзывов в Mongo БД.*/
    async findAllFeedbacks(): Promise<FeedbackViewModel[]> {
        /*Ищем все отзывы в Mongo БД. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 отзывы были найдены - возвращается массив с отзывами в BLL.
        1.2 отзывы не были найдены - возвращается пустой массив в BLL.
        2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
        try {
            // const foundFeedbacks = await feedbacksCollection.find().sort('createdAt', -1).toArray();
            /*Аналог через Mongoose.*/
            const foundFeedbacks = await FeedbackModel.find().sort('createdAt').lean<FeedbackDBType[]>();
            return foundFeedbacks.map(mapFeedbackDBTypeToFeedbackViewModel);
        } catch (error) {
            throw error;
        }
    },

    /*Создаем метод "createFeedback()" для создания нового отзыва в Mongo БД.*/
    async createFeedback(newFeedback: FeedbackDBType): Promise<boolean> {
            /*Добавляем отзыв в Mongo БД. Порядок работы такой:
            1. Если сервер Mongo БД работает и:
            1.1 отзыв был добавлен - возвращается true в BLL.
            1.2 отзыв не был добавлен - возвращается false в BLL.
            2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
            try {
                // const result = await feedbacksCollection.insertOne(newFeedback);
                // return !!result.insertedId;
                /*Аналог через Mongoose.*/
                const mongooseNewFeedback = {
                    ...newFeedback,
                    _id: new Types.ObjectId(newFeedback._id),
                    userID: new Types.ObjectId(newFeedback.userID),
                }

                const result = await FeedbackModel.create(mongooseNewFeedback);
                return !!result;
            } catch (error) {
                throw error;
            }
    }
}