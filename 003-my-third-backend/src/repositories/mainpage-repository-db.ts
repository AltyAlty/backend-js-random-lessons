import {DBType, mainPageContentCollection} from '../db/db';

export const mainPageRepository = {
    async getMainPageContent(db: DBType) {
        const mainPageContent = await mainPageContentCollection.findOne({});
        if (mainPageContent) {
            return mainPageContent.content;
        } else {
            return 'Cannot get main page content'
        }
    }
};