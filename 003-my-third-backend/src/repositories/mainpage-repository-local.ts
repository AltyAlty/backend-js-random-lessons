import {DBType} from '../db/db';

export const mainPageRepository = {
    async getMainPageContent(db: DBType): Promise<string>  {
        return db.mainPageContent;
    }
};