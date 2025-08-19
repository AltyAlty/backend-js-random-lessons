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
exports.emailManager = void 0;
/*Импортируем адаптеры.*/
const email_adapter_1 = require("../adapters/email-adapter");
/*Создаем менеджер "emailManager" для организации работы между сервисами "emailService"/"usersService" и адаптером
"emailAdapter".*/
exports.emailManager = {
    /*Создаем метод "sendRegularMail()" для отправки обычных писем.*/
    sendRegularMail(email, subject, message) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Просим адаптер "emailAdapter" отправить обычное письмо.*/
            try {
                return yield email_adapter_1.emailAdapter.sendMail({ email, subject, message });
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "sendPasswordRecoveryMail()" для отправки писем для восстановления паролей пользователей.*/
    sendPasswordRecoveryMail(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Просим адаптер "emailAdapter" отправить письмо для восстановления пароля пользователя.*/
            try {
                return yield email_adapter_1.emailAdapter.sendMail({
                    email,
                    subject: 'Password Recovery',
                    message: `<div>Your new password: ${newPassword}</div>`
                });
            }
            catch (error) {
                throw error;
            }
        });
    },
    /*Создаем метод "sendEmailConfirmationMail()" для отправки писем для подтверждения почт при регистрации
    пользователей.*/
    sendEmailConfirmationMail(user) {
        return __awaiter(this, void 0, void 0, function* () {
            /*Просим адаптер "emailAdapter" отправить письмо для подтверждения почты при регистрации пользователя.*/
            try {
                return yield email_adapter_1.emailAdapter.sendMail({
                    email: user.email,
                    subject: 'Email Confirmation',
                    message: `<div>Your confirmation code: ${user.emailConfirmation.confirmationCode}</div>`
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
};
