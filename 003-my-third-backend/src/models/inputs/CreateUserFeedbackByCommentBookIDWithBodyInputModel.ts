/*Импортируем модели.*/
import {UserViewModel} from '../views/UserViewModel';

/*Тип для входящей модели (Input Model) для создания отзыва пользователем, указывая комментарий и ID книги, используя
тело запроса.*/
export type CreateUserFeedbackByCommentBookIDWithBodyInputModel = {
    comment: string
    user: UserViewModel
    bookID: number
};