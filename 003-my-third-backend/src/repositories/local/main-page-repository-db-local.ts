/*Импортируем локальную БД.*/
import {localDB} from '../../db/db-local';

/*Создаем репозиторий "mainPageRepository" для работы с данными для главной страницы из локальной БД.*/
export const mainPageRepository = {
    /*Создаем метод "getMainPageContent()" для получения данных для главной страницы из локальной БД.*/
    async getMainPageContent(): Promise<string | null> {
        /*Получаем данные для главной страницы из локальной БД. Порядок работы такой:
        1. Если данные для главной страницы были найдены - возвращаются данные для главной страница в BLL.
        2. Если данные для главной страницы не были найдены - возвращается null в BLL.*/
        if (!localDB.mainPageContent) return null;
        return localDB.mainPageContent.content;
    }
};