/*Импортируем nodemailer из библиотеки nodemailer для создания транспортера - механизма для работы с почтой.*/
import nodemailer from 'nodemailer';
/*Импортируем объект с переменными окружения, используемыми в приложении.*/
import {settings} from '../settings/settings';
/*Импортируем типы.*/
import {MailType} from './types/email-types';

/*Создаем адаптер "emailAdapter" для работы с почтой через библиотеку nodemailer.*/
export const emailAdapter = {
    /*Создаем метод "sendEmail()" для отправки писем. В качестве параметров этот метод получает адреса получателей, тему
    письма и тело письма.*/
    async sendMail(mail: MailType) {
        try {
            /*При помощи метода "nodemailer.createTransport()" создаем транспортер - механизм для работы с почтой. В
            параметрах этого метода конфигурируем создаваемый транспортер.*/
            const transporter = nodemailer.createTransport({
                /*Имя почтового сервиса.*/
                service: 'gmail',
                auth: {
                    /*Адрес почты, используемый для отправки писем.*/
                    user: settings.EMAIL,
                    /*Пароль приложения из Google.*/
                    pass: settings.APP_PASS
                },
            });

            /*Формируем объект с данными для письма и отправляем письмо через созданный транспортер.*/
            const info = await transporter.sendMail({
                /*Адрес отправителя.*/
                from: '"Adam Jensen" <youremail@gmail.com>',
                /*Адреса получателей.*/
                to: mail.email,
                /*Тема письма.*/
                subject: mail.subject,
                /*Тело письма в виде HTML.*/
                html: mail.message, // html body
                /*Тело письма в виде текста.*/
                // text: "Did you ever ask for this?"
            });

            console.log(info);
            return info;
        } catch (error) {
            throw error;
        }
    }
};