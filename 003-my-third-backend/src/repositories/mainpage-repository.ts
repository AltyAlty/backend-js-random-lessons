import {DBType} from '../db/db';

export const mainPageRepository = {
    getMainPageContent(db: DBType) {
        return db.mainPageContent;
    }
};