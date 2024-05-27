/*Сделали дополнительную прослойку между сервисами и адаптерами - менеджеры.*/
import {emailAdapter} from '../adapters/email-adapter';

export const emailManager = {
    async sendRegularEmail(email: string, subject: string, message: string) {
        await emailAdapter.sendEmail(email, subject, message);
    },

    async sendPasswordRecoveryMessage(email: any, newPassword: string) {
        await emailAdapter.sendEmail(email, 'Password Recovery', `<div>Your new password: ${newPassword}</div>`);
    }
};