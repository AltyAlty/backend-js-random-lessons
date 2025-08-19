/*Тип для исходящей модели (View Model) для отправки клиенту данных об отправленной письме.*/
export type EmailViewModel = {
    email: string
    subject: string
    message: string
    operationType: string
};