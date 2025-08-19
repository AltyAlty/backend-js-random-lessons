/*Импортируем адаптеры.*/
import {emailAdapter} from '../adapters/email-adapter';
/*Импортируем типы.*/
import {UserDBType} from '../db/types/db-types';

/*Создаем менеджер "emailManager" для организации работы между сервисами "emailService"/"usersService" и адаптером
"emailAdapter".*/
export const emailManager = {
    /*Создаем метод "sendRegularMail()" для отправки обычных писем.*/
    async sendRegularMail(email: string, subject: string, message: string) {
        /*Просим адаптер "emailAdapter" отправить обычное письмо.*/
        try { return await emailAdapter.sendMail({email, subject, message}) } catch (error) { throw error }
    },

    /*Создаем метод "sendPasswordRecoveryMail()" для отправки писем для восстановления паролей пользователей.*/
    async sendPasswordRecoveryMail(email: string, newPassword: string) {
        /*Просим адаптер "emailAdapter" отправить письмо для восстановления пароля пользователя.*/
        try {
            return await emailAdapter.sendMail({
                email,
                subject: 'Password Recovery',
                message: `<div>Your new password: ${newPassword}</div>`
            });
        } catch (error) {
            throw error;
        }
    },

    /*Создаем метод "sendEmailConfirmationMail()" для отправки писем для подтверждения почт при регистрации
    пользователей.*/
    async sendEmailConfirmationMail(user: UserDBType) {
        /*Просим адаптер "emailAdapter" отправить письмо для подтверждения почты при регистрации пользователя.*/
        try {
            return await emailAdapter.sendMail({
                email: user.email,
                subject: 'Email Confirmation',
                message: `<div>Your confirmation code: ${user.emailConfirmation.confirmationCode}</div>`
            });
        } catch (error) {
            throw error;
        }
    }
};