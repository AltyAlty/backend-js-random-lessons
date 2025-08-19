/*Тип для входящей модели (Input Model) для подтверждения почты пользователя по коду, используя тело запроса.*/
export type ConfirmEmailByCodeWithBodyInputModel = {
    email: string
    code: string
};