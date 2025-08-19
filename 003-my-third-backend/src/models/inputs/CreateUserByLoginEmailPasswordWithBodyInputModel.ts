/*Тип для входящей модели (Input Model) для создания пользователя, указывая логин, пароль и почту, используя тело
запроса.*/
export type CreateUserByLoginEmailPasswordWithBodyInputModel = {
    login: string
    email: string
    password: string
};