import express, {Request, Response} from 'express';
import {usersService} from '../../domain/users-service';
import {jwtService} from '../../application/jwt-service';
import {authService} from '../../domain/auth/auth-service';

export const getAuthRouter = () => {
    const router = express.Router();

    /*Логинизация пользователя на UI уровне.*/
    router.post('/login',
        async (req: Request, res: Response) => {
            /*Отправляем данные на BLL уровень.*/
            const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password);

            /*При нахождении пользователя пытаемся создать для него токен.*/
            if (user) {
                /*Создаем токен.*/
                const token = await jwtService.createJWT(user);
                /*Отправляем токен клиенту.*/
                res.status(201).send({message: 'Access granted', token: token});
                // res.status(201).send(token);
            } else {
                res.status(401).send({message: 'Access denied'});
            }

            /*В консоли можно использовать такую команду:
                fetch('http://localhost:3000/auth/login', {method: 'POST', body: JSON.stringify({loginOrEmail: 'ddd', password: 'd4'}),
                headers: {
                    'content-type': 'application/json'
                }})
                    .then(res => res.json())
                    .then(json => console.log(json))
            */
        });

    /*Подтверждение почты пользователя на UI уровне.*/
    router.post('/confirm-email',
        async (req: Request, res: Response) => {
            const result = await authService.confirmEmail(req.body.email, req.body.code);

            if (result) {
                res.status(201).send({message: 'Email confirmed'});
            } else {
                res.status(401).send({message: 'Access denied'});
            }

            /*В консоли можно использовать такую команду:
                fetch('http://localhost:3000/auth/confirm-email', {method: 'POST', body: JSON.stringify({email: 'jiramanager03@mail.ru', code: '1716995354932'}),
                headers: {
                    'content-type': 'application/json'
                }})
                    .then(res => res.json())
                    .then(json => console.log(json))
            */
        });

    return router;
};