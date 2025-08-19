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
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
/*Импортируем менеджеры.*/
const email_manager_1 = require("../managers/email-manager");
/*Создаем сервис "booksService" для работы с почтой.*/
exports.emailService = {
    /*Создаем метод "senMail()" для отправки писем.*/
    sendMail(mail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let mailResult;
                /*В зависимости от типа почтовой операции отправляем разные типы писем.*/
                switch (mail.operationType) {
                    /*Отправка обычного письма.*/
                    case 'regular mail': {
                        mailResult = yield email_manager_1.emailManager.sendRegularMail(mail.email, mail.subject, mail.message);
                        break;
                    }
                    /*Отправка письма для восстановления пароля пользователя.*/
                    case 'password recovery': {
                        /*Здесь по идее может быть также код, который обращается в репозиторий, чтобы сбросить текущий
                        пароль или получить новый пароль пользователя.*/
                        mailResult = yield email_manager_1.emailManager.sendPasswordRecoveryMail(mail.email, '12345');
                        break;
                    }
                    default:
                }
                return mailResult;
            }
            catch (error) {
                throw error;
            }
        });
    }
};
