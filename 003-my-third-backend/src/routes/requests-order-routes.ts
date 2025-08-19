/*Импортируем express из Express для создания роутеров. Импортируем объекты для типизации.*/
import express, {Response} from 'express';
/*Импортируем типы.*/
import {RequestWithURIParamsType, RequestWithQueryParamsType} from './types/routes-types';
/*Импортируем модели.*/
import {GetBookByIDWithURIParamsInputModel} from '../models/inputs/GetBookByIDWithURIParamsInputModel';
import {GetBooksByTitleWithQueryParamsInputModel} from '../models/inputs/GetBooksByTitleWithQueryParamsInputModel';

/*Создаем специальный роутер, который обслуживает два GET-запроса. Если перейти по адресу "/requests-order/two", то
сработает первый запрос, то есть выведется "First Request: two", когда изначально ожидалось "Second Request". Но если
поменять местами указанные ниже запросы, тогда выведется "Second Request".

Из этого следует то, что порядок регистрации маршрутов важен. В данном случае первый запрос будет проверяться первым и
покрывать любой указанный текст после "/requests-order/", тем самым не давая возможности сработать второму запросу. Если
же эти два запроса указать в обратном порядке, то сначала будет проверяться запрос с "Second Request", и только если он
не удовлетворит приложение, уже после этого сработает запрос с "First Request: ".

Чтобы ограничить использование параметров, можно использовать регулярные выражения. Например, если в первом запросе
указать "/:id([0-9]+)" вместо "/:id", то он будет обрабатывать URI-параметры, состоящие только из цифр, что решит
рассматриваемую проблему.*/
export const getRequestsOrderRouter = () => {
    /*Создаем роутер из Express.*/
    const router = express.Router();

    router.get('/:id', (req: RequestWithURIParamsType<GetBookByIDWithURIParamsInputModel>, res: Response) => {
        res.json({title: 'First Request: ' + req.params.id});
    });

    router.get('/two', (req: RequestWithQueryParamsType<GetBooksByTitleWithQueryParamsInputModel>, res: Response) => {
        res.json({title: 'Second Request'});
    });

    /*
    Для проверки можно перейти на http://localhost:3000/requests-order/two или в консоли использовать такую команду:

    fetch('http://localhost:3000/requests-order/two', {method: 'GET'})
        .then(res => {
            console.log(res.status);
            if (res.status === 200) { return res.text().then(text => console.log(text)) } else { return }
        })
    */

    /*Возвращаем этот роутер, чтобы использовать его в приложении.*/
    return router;
};