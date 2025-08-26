/*Импортируем коллекции из Mongo БД.*/
import {mainPageContentCollection} from '../../db/db-mongo';
/*Импортируем Mongoose модели.*/
import {MainPageContentModel} from '../../db/schemas/schemas';
/*Импортируем для типизации.*/
import {WithId, Document} from 'mongodb';
/*Импортируем типы.*/
import {mainPageContentDBType} from '../../db/types/db-types';

/*Создаем репозиторий "mainPageRepository" для работы с данными для главной страницы из Mongo БД.*/
export const mainPageRepository = {
    /*Создаем метод "getMainPageContent()" для получения данных для главной страницы из Mongo БД.*/
    async getMainPageContent(): Promise<mainPageContentDBType | null> {
        /*Получаем данные для главной страницы из Mongo БД. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 данные для главной страницы были найдены - возвращаются данные для главной страница в BLL.
        1.2 данные для главной страницы не были найдены - возвращается null в BLL.
        2. Если сервер Mongo БД не работает - возвращается ошибка в BLL.*/
        try {
            // const content: WithId<Document> | null = await mainPageContentCollection.findOne({});
            /*Аналог через Mongoose.*/
            const content: WithId<Document> | null = await MainPageContentModel.findOne();
            if (!content) return null;
            return content.content;
        } catch (error) {
            throw error;
        }
    }
};