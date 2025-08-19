"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailRouter = void 0;
/*Импортируем express из Express для создания роутеров. Импортируем объекты для типизации.*/
const express_1 = __importDefault(require("express"));
/*Импортируем сервисы.*/
const email_service_1 = require("../domain/email-service");
/*Импортируем HTTP-статусы.*/
const utils_1 = require("../utils/utils");
/*Создаем функцию "getEmailRouter()" для создания роутинга для работы с почтой.*/
const getEmailRouter = () => {
    /*Создаем роутер из Express.*/
    const router = express_1.default.Router();
    /*Конфигурируем POST-запросы для отправки писем.*/
    router.post('/send', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        /*Если не было указано почты получателя или типа письма, то сообщаем клиенту об отказе в отправке письма.*/
        if (!req.body.email || !req.body.operationType) {
            res.status(utils_1.HTTP_STATUSES.BAD_REQUEST_400).json('No email, subject, message or operation type');
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
            yield email_service_1.emailService.sendMail(mail);
            res.status(utils_1.HTTP_STATUSES.OK_200).send({
                'email': req.body.email,
                'subject': req.body.subject,
                'message': req.body.message,
                'operationType': req.body.operationType
            });
        }
        catch (error) {
            res.sendStatus(utils_1.HTTP_STATUSES.BAD_GATEWAY_502);
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
    }));
    /*Возвращаем этот роутер, чтобы использовать его в приложении.*/
    return router;
};
exports.getEmailRouter = getEmailRouter;
