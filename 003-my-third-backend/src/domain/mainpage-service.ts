import {mainPageRepository} from '../repositories/mainpage-repository-db';
// import {mainPageRepository} from '../repositories/mainpage-repository-local';

export const mainPageService = {
    async getMainPageContent() {
        const mainPageContent = await mainPageRepository.getMainPageContent();

        if (mainPageContent) {
            return mainPageContent.content;
        } else {
            return 'Cannot get main page content';
        }
    }
};