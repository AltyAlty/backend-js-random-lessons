import express, {Request, Response} from 'express';
import {usersService} from '../domain/users-service';

export const getUsersRouter = () => {
    const router = express.Router();

    /*Создание нового пользователя на UI уровне.*/
    router.post('/',
        async (req: Request, res: Response) => {
            /*Отправляем данные на BLL уровень.*/
            const newUser = await usersService.createUser(req.body.login, req.body.email, req.body.password);

            if (newUser) {
                res.status(201).send(newUser);
            }

            /*В консоли можно использовать такую команду:
                fetch('http://localhost:3000/registration', {method: 'POST', body: JSON.stringify({login: 'ddd', email: 'jiramanager03@mail.ru', password: 'd4'}),
                headers: {
                    'content-type': 'application/json'
                }})
                    .then(res => res.json())
                    .then(json => console.log(json))
            */
        });

    return router;
};