/*Тип для входящей модели (Input Model) для отправки писем, используя тело запроса.*/
export type SendEmailWithBodyInputModel = {
    email: string
    subject: string
    message: string
    operationType: string
};