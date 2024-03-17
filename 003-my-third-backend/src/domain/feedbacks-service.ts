import {ObjectId} from 'mongodb';
import {feedbacksRepository} from '../repositories/feedbacks-repository-db';
import {FeedbackDBType} from '../db/db';

export const feedbacksService = {
    async sendFeedback(comment: string, userID: ObjectId, bookID: number): Promise<FeedbackDBType> {
        const newFeedback: FeedbackDBType = {
            _id: new ObjectId,
            userID: userID,
            bookID: bookID,
            comment: comment,
            createdAt: new Date()
        };

        return feedbacksRepository.createFeedback(newFeedback);
    },

    async allFeedbacks(): Promise<FeedbackDBType[]> {
        return feedbacksRepository.getAllFeedbacks();
    },
};