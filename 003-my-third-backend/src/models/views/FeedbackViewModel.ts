/*Тип для исходящей модели (View Model) для отправки клиенту данных об отзыве.*/
export type FeedbackViewModel = {
    userID: string,
    bookID: number,
    comment: string
    createdAt: Date
};