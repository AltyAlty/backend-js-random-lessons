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
exports.emailAdapter = void 0;
/*Импортируем nodemailer из библиотеки nodemailer для создания транспортера - механизма для работы с почтой.*/
const nodemailer_1 = __importDefault(require("nodemailer"));
/*Импортируем объект с переменными окружения, используемыми в приложении.*/
const settings_1 = require("../settings/settings");
/*Создаем адаптер "emailAdapter" для работы с почтой через библиотеку nodemailer.*/
exports.emailAdapter = {
    /*Создаем метод "sendEmail()" для отправки писем. В качестве параметров этот метод получает адреса получателей, тему
    письма и тело письма.*/
    sendMail(mail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /*При помощи метода "nodemailer.createTransport()" создаем транспортер - механизм для работы с почтой. В
                параметрах этого метода конфигурируем создаваемый транспортер.*/
                const transporter = nodemailer_1.default.createTransport({
                    /*Имя почтового сервиса.*/
                    service: 'gmail',
                    auth: {
                        /*Адрес почты, используемый для отправки писем.*/
                        user: settings_1.settings.EMAIL,
                        /*Пароль приложения из Google.*/
                        pass: settings_1.settings.APP_PASS
                    },
                });
                /*Формируем объект с данными для письма и отправляем письмо через созданный транспортер.*/
                const info = yield transporter.sendMail({
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
            }
            catch (error) {
                throw error;
            }
        });
    }
};
