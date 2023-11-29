import {db, mainPageContentType} from '../db/db';

export const mainPageRepository = {
    async getMainPageContent(): Promise<mainPageContentType> {
        return db.mainPageContent;
    }
};