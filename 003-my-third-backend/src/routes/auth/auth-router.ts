import {Request, Response, Router} from 'express';
import {usersService} from '../../domain/users-service';

export const authRouter = Router({});

/*Логинизация пользователя на UI уровне.*/
authRouter.post('/',
    async (req: Request, res: Response) => {
        /*Отправляем данные на BLL уровень.*/
        const result = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password);

        if (result) {
            res.status(201).send({message: 'Access granted'});
        } else {
            res.status(401).send({message: 'Access denied'});
        }

        /*В консоли можно использовать такую команду:
            fetch('http://localhost:3000/login', {method: 'POST', body: JSON.stringify({loginOrEmail: 'ddd', password: 'd4'}),
            headers: {
                'content-type': 'application/json'
            }})
                .then(res => res.json())
                .then(json => console.log(json))
        */
    })