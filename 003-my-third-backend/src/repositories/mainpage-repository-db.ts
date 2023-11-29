import {mainPageContentCollection} from '../db/db';

export const mainPageRepository = {
    async getMainPageContent() {
        return await mainPageContentCollection.findOne({});
    }
};