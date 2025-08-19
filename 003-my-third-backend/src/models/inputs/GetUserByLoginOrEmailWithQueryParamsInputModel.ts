/*Тип для входящей модели (Input Model) для получения книг по названию при помощи Query-параметров.*/
export type GetUserByLoginOrEmailWithQueryParamsInputModel = {
    login?: string | undefined
    email?: string | undefined
};