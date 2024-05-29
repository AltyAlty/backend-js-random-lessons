import express, {Request, Response, Router} from 'express';
import {businessService} from '../domain/business-service';

export const getEmailRouter = () => {
    const router = express.Router();

    /*Отправление писем на UI уровне.*/
    router.post('/send', async (req: Request, res: Response) => {
        await businessService.doEmailOperation(req.body.email, req.body.subject, req.body.message, req.body.operationType);

        res.send({
            'email': req.body.email,
            'subject': req.body.subject,
            'message': req.body.message,
            'operationType': req.body.operationType
        });

        /*В консоли можно использовать такую команду:
            fetch('http://localhost:3000/email/send', {method: 'POST', body: JSON.stringify({email: "jiramanager03@mail.ru", subject: "What a shame", message: "<b>Did you ever ask for this?</b>", operationType: "regular email"}),
            headers: {
                'content-type': 'application/json'
            }})
                .then(res => res.json())
                .then(json => console.log(json))
        */

        /*В консоли можно использовать такую команду:
            fetch('http://localhost:3000/email/send', {method: 'POST', body: JSON.stringify({email: "jiramanager03@mail.ru", subject: "", message: "", operationType: "password recovery"}),
            headers: {
                'content-type': 'application/json'
            }})
                .then(res => res.json())
                .then(json => console.log(json))
        */
    });

    return router;
};