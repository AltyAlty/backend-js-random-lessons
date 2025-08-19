/*Импортируем менеджеры.*/
import {emailManager} from '../managers/email-manager';
/*Импортируем модели.*/
import {SendEmailWithBodyInputModel} from '../models/inputs/SendEmailWithBodyInputModel';

/*Создаем сервис "booksService" для работы с почтой.*/
export const emailService = {
    /*Создаем метод "senMail()" для отправки писем.*/
    async sendMail(mail: SendEmailWithBodyInputModel) {
        try {
            let mailResult;

            /*В зависимости от типа почтовой операции отправляем разные типы писем.*/
            switch (mail.operationType) {
                /*Отправка обычного письма.*/
                case 'regular mail': {
                    mailResult = await emailManager.sendRegularMail(mail.email, mail.subject, mail.message);
                    break;
                }

                /*Отправка письма для восстановления пароля пользователя.*/
                case 'password recovery': {
                    /*Здесь по идее может быть также код, который обращается в репозиторий, чтобы сбросить текущий
                    пароль или получить новый пароль пользователя.*/
                    mailResult = await emailManager.sendPasswordRecoveryMail(mail.email, '12345');
                    break;
                }

                default:
            }

            return mailResult;
        } catch (error) {
            throw error;
        }
    }
};