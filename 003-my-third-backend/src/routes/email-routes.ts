/*Импортируем express из Express для создания роутеров. Импортируем объекты для типизации.*/
import express, {Response} from 'express';
/*Импортируем сервисы.*/
import {emailService} from '../domain/email-service';
/*Импортируем HTTP-статусы.*/
import {HTTP_STATUSES} from '../utils/utils';
/*Импортируем типы.*/
import {RequestWithBodyType} from './types/routes-types';
/*Импортируем модели.*/
import {EmailViewModel} from '../models/views/EmailViewModel';
import {SendEmailWithBodyInputModel} from '../models/inputs/SendEmailWithBodyInputModel';

/*Создаем функцию "getEmailRouter()" для создания роутинга для работы с почтой.*/
export const getEmailRouter = () => {
    /*Создаем роутер из Express.*/
    const router = express.Router();

    /*Конфигурируем POST-запросы для отправки писем.*/
    router.post('/send',
        async (req: RequestWithBodyType<SendEmailWithBodyInputModel>, res: Response<EmailViewModel | unknown>) => {
            /*Если не было указано почты получателя или типа письма, то сообщаем клиенту об отказе в отправке письма.*/
            if (!req.body.email || !req.body.operationType) {
                res.status(HTTP_STATUSES.BAD_REQUEST_400).json('No email, subject, message or operation type');
                return;
            }

            /*Просим сервис "emailService" отправить письмо.*/
            try {
                const mail = {
                    email: req.body.email,
                    subject: req.body.subject,
                    message: req.body.message,
                    operationType: req.body.operationType
                };

                await emailService.sendMail(mail);

                res.status(HTTP_STATUSES.OK_200).send({
                    'email': req.body.email,
                    'subject': req.body.subject,
                    'message': req.body.message,
                    'operationType': req.body.operationType
                });
            } catch (error) {
                res.sendStatus(HTTP_STATUSES.BAD_GATEWAY_502);
            }

            /*
            Для проверки в консоли можно использовать такие команды:

            1. Отправка обычного письма (нужно указать настоящую почту для получения письма)
            fetch('http://localhost:3000/email/send', {
                method: 'POST',
                body: JSON.stringify({
                    email: "__mail@mail.ru__",
                    subject: "What a shame",
                    message: "<b>Did you ever ask for this?</b>",
                    operationType: "regular mail"
                }),
                headers: {
                    'content-type': 'application/json'
                }
            })
                .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json().then(json => console.log(json)) } else { return }
            })

            2. Отправка письма для восстановления пароля пользователя (имитация, такого функционала нет в приложении)
            (нужно указать настоящую почту для получения письма):
            fetch('http://localhost:3000/email/send', {
                method: 'POST',
                body: JSON.stringify({
                    email: "__mail@mail.ru__",
                    subject: "",
                    message: "",
                    operationType: "password recovery"
                }),
                headers: {
                    'content-type': 'application/json'
                }
            })
                .then(res => {
                console.log(res.status);
                if (res.status === 200) { return res.json().then(json => console.log(json)) } else { return }
            })
            */
        });

    /*Возвращаем этот роутер, чтобы использовать его в приложении.*/
    return router;
};