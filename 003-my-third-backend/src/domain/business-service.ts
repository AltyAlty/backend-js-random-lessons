import {emailManager} from '../managers/email-manager';

export const businessService = {
    async doEmailOperation(email: string, subject: string, message: string, operationType: string) {
        switch (operationType) {
            case 'regular email': {
                await emailManager.sendRegularEmail(email, subject, message);
                break;
            }

            case 'password recovery': {
                // Обратиться в репозиторий, чтобы поменять пароль
                // Получить данные по пользователю из репозитория
                await emailManager.sendPasswordRecoveryMessage(email, '12345');
                break;
            }

            default:
        }
    }
};