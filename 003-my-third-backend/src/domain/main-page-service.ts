/*Импортируем репозитории.*/
import {mainPageRepository} from '../repositories/mongo/main-page-repository-db-mongo';
// import {mainPageRepository} from '../repositories/local/main-page-repository-db-local';
/*Импортируем для типизации.*/
import {Document, WithId} from 'mongodb';

/*Создаем сервис "mainPageService" для работы с данными для главной страницы.*/
export const mainPageService = {
    /*Создаем метод "getMainPageContent()" для поиска данных для главной страницы. Используем "async", чтобы то, что
    возвращается функцией, оборачивалось в промис.*/
    async getMainPageContent(): Promise<WithId<Document> | string | null > {
        /*Просим репозиторий "mainPageRepository" найти данные для главной страницы. Порядок работы такой:
        1. Если сервер Mongo БД работает и:
        1.1 данные для главной страницы были найдены - возвращаются данные для главной страница в UI.
        1.2 данные для главной страницы не были найдены - возвращается null в UI.
        2. Если сервер Mongo БД не работает - возвращается ошибка в UI.*/
        try { return await mainPageRepository.getMainPageContent() } catch (error) { throw error }
    }
};