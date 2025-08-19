/*Импортируем модели.*/
import {UserViewModel} from '../models/views/UserViewModel';

/*В этом файле определений (definitions) расширяем тип Request из Express, чтобы можно было через параметр "req" при
запросах передавать свойство "user" - данные о пользователе типа "UserViewModel". Это используется в файлах
"auth-middleware.ts" и "feedback-routes.ts".*/
declare global {
    declare namespace Express {
        export interface Request {
            user: UserViewModel | null
        }
    }
}