import express, {Router} from 'express';
import {feedbacksService} from '../domain/feedbacks-service';
import {authMiddleware} from '../middlewares/auth/auth-middlewares';

export const getFeedbacksRouter = () => {
    const router = express.Router();

    /*Создание нового отзыва на UI уровне. Используем промежуточный слой "authMiddleware" для проверки пользователя.
    Этот слой добавит данные о пользователе в запрос.*/
    router.post('/', authMiddleware,
        async (req, res) => {
            const newFeedback = await feedbacksService.sendFeedback(req.body.comment, req.user!._id, req.body.bookID);
            res.status(201).send(newFeedback);
        })

        /*Сначала нужно создать пользователя, затем залогиниться, и после в консоли можно использовать такую команду:
                fetch('http://localhost:3000/feedback', {method: 'POST', body: JSON.stringify({comment: 'ok', bookID: 3}),
                headers: {
                    'authorization': 'Bearer insert_your_token',
                    'content-type': 'application/json'
                }})
                    .then(res => res.json())
                    .then(json => console.log(json))
        */

        .get('/', async (req, res) => {
            const feedbacks = await feedbacksService.allFeedbacks();
            res.send(feedbacks);
        });

    return router;
};