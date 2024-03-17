import {FeedbackDBType, feedbacksCollection} from '../db/db';

export const feedbacksRepository = {
    async createFeedback(newFeedback: FeedbackDBType): Promise<FeedbackDBType> {
        let result = await feedbacksCollection.insertOne(newFeedback);
        return newFeedback;
    },

    async getAllFeedbacks(): Promise<FeedbackDBType[]> {
        return feedbacksCollection
            .find()
            .sort('createdAt', -1)
            .toArray();
    },
}