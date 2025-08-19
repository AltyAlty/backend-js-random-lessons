/*Тип для входящей модели (Input Model) для аутентификации пользователя по логину/почте и паролю, используя тело
запроса.*/
export type AuthByLoginEmailPasswordWithBodyInputModel = {
    loginOrEmail: string
    password: string
};