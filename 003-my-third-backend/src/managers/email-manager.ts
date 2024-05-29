/*Сделали дополнительную прослойку между сервисами и адаптерами - менеджеры.*/
import {emailAdapter} from '../adapters/email-adapter';
import {UserDBType} from '../db/db';

export const emailManager = {
    async sendRegularEmail(email: string, subject: string, message: string) {
        await emailAdapter.sendEmail(email, subject, message);
    },

    async sendPasswordRecoveryMessage(email: string, newPassword: string) {
        await emailAdapter.sendEmail(email, 'Password Recovery', `<div>Your new password: ${newPassword}</div>`);
    },

    async sendEmailConfirmationMessage(user: UserDBType) {
        await emailAdapter.sendEmail(user.email, 'Email Confirmation', `<div>Your confirmation code: ${user.emailConfirmation.confirmationCode}</div>`);
    },
};