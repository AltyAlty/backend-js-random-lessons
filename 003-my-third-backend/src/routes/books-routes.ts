/*В целях типизации импортируем Response из Express.*/
import express, {NextFunction, Request, Response} from 'express';
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from '../types';
import {GetQueryBooksModel} from '../models/GetQueryBooksModel';
import {BookViewModel} from '../models/BookViewModel';
import {GetURIParamsIDBookModel} from '../models/GetURIParamsIDBookModel';
import {CreateBookModel} from '../models/CreateBookModel';
import {DeleteURIParamsIDBookModel} from '../models/DeleteURIParamsIDBookModel';
import {UpdateURIParamsIDBookModel} from '../models/UpdateURIParamsIDBookModel';
import {UpdateBookModel} from '../models/UpdateBookModel';
import {HTTP_STATUSES} from '../utils';
import {booksService} from '../domain/books-service';
import {
    titleIsNotEmptyValidationMiddleware,
    titleIsOfCorrectLengthValidationMiddleware, titleValidationMiddleware
} from '../middlewares/books-middlewares';


export const getBooksRouter = () => {
    /*Используем роутинг, который предоставляется в Express. Создаем роутер, которые далее конфигурируем, то есть
    описываем различные запросы, которые этот роутер должен будет обрабатывать. В конце возвращаем этот роутер,
    чтобы его можно было использовать в нашем приложении. Такой роутинг позволяет декомпозировать наше backend
    приложение удобным образом.*/
    const router = express.Router();

    /*R - Read*/
    /*У req есть свое свойство res, которое скорее всего ссылается на второй параметр res. Для уточнения generic-типов в
    Webstorm можно использовать Ctrl+P внутри "<>". При типизации запроса "req" на первом месте идут URI-параметры, мы
    их не указываем, так как не используем URI-параметры. На втором месте идет Response Body, то есть то, что мы будем
    возвращать, но этот Response Body относится к тому res внутри запроса, пока его не трогаем. На третьем месте Request
    Body то есть то, что к нам прилетает в body на запрос, но так как у нас GET-запрос, то в body ничего интересного
    прилетать не будет. На четвертом месте query-параметры, то есть req.query.

    Далее типизируем res. Там можно типизировать Response Body, то есть можно типизировать то, что должно вернуться в
    ответе на запрос.*/
    router.get('/',
        async (req: RequestWithQuery<GetQueryBooksModel>, res: Response<BookViewModel[]>): Promise<void> => {

            /*Используем "await", чтобы дождаться, когда зарезольвиться промис, чтобы получить найденные книги. Для
            этого нашу функцию сделали асинхронной при помощи "async".*/
            const foundBooks: BookViewModel[] = await booksService.findBooksByTitle(req.query.title?.toString());

            /*"performance.now()" это метод из Node.js, который возвращает текущую метку времени в миллисекундах, где 0
            представляет начало текущего процесса Node.js. Имитируем задержку в 3 секунды. Если после этого запроса,
            сразу сделать какой-то другой запрос, то оба запроса будут ждать эту задержку в 3 секунды.*/
            // let start = performance.now();
            // console.log(start);
            // while (performance.now() - start < 3000) {
            //     console.log(performance.now() - start);
            // }

            /*Здесь же поскольку метод "setInterval()" работает асинхронно, то 3-х секундная задержка повлияет только
            на этот запрос.*/
            // setInterval(() => {
            //     res.json(foundBooks);
            // }, 3000);

            res.json(foundBooks);

            /*В консоли можно использовать такую команду:
            fetch('http://localhost:3000/page-one?title=two', {method: 'GET'})
                .then(res => res.json())
                .then(json => console.log(json))
            */
        });

    /*Здесь при типизации req нас интересует только первое, то есть URI-параметры, поэтому остальное можно не указывать.
    Нужно помнить, что хоть наш id является цифрой, сами URI-параметры являются строками.*/
    router.get('/:id', async (req: RequestWithParams<GetURIParamsIDBookModel>,
                              res: Response<BookViewModel>): Promise<void> => {

        const foundBook: BookViewModel | null = await booksService.findBookByID(req.params.id);

        /*Если нужного объекта не было найдено, то мы получим undefined, соотвественно делаем проверку на такой случай,
        в которой отправляем код сервера и выходим из функции.*/
        if (!foundBook) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.json(foundBook);

        /*В консоли можно использовать такую команду:
        fetch('http://localhost:3000/page-one/2', {method: 'GET'})
            .then(res => res.json())
            .then(json => console.log(json))
        */
    });

    /*C - Create*/
    router.post('/',
        titleIsNotEmptyValidationMiddleware,
        titleIsOfCorrectLengthValidationMiddleware,
        titleValidationMiddleware,
        async (req: RequestWithBody<CreateBookModel>, res: Response<BookViewModel>): Promise<void> => {

            const createdBook: BookViewModel = await booksService.createBookWithTitle(req.body.title);

            /*При помощи метода "status()" устанавливаем код ответа сервера при помощи чейнинга.*/
            res
                .status(HTTP_STATUSES.CREATED_201)
                .json(createdBook);
            // res.status(201);
            // res.json(createdBook);

            /*В консоли можно использовать такую команду:
            fetch('http://localhost:3000/page-one', {method: 'POST', body: JSON.stringify({title: 'book-five'}),
            headers: {
                'content-type': 'application/json'
            }})
                .then(res => res.json())
                .then(json => console.log(json))
            */
        });

    /*D - Delete*/
    router.delete('/:id',
        async (req: RequestWithParams<DeleteURIParamsIDBookModel>, res: Response): Promise<void> => {

            await booksService.deleteBookByID(req.params.id);
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

            /*В консоли можно использовать такую команду:
            fetch('http://localhost:3000/page-one/1', {method: 'DELETE'})
                .then(res => res.json())
                .then(json => console.log(json))

            Для проверки удаления можно использовать такую команду:
            fetch('http://localhost:3000/page-one', {method: 'GET'})
                .then(res => res.json())
                .then(json => console.log(json))
            */
        });

    /*U - Update*/
    router.put('/:id',
        titleIsNotEmptyValidationMiddleware,
        titleIsOfCorrectLengthValidationMiddleware,
        titleValidationMiddleware,
        async (req: RequestWithParamsAndBody<UpdateURIParamsIDBookModel, UpdateBookModel>,
               res: Response): Promise<void> => {

            const foundBook: BookViewModel | null = await booksService.updateBookTitleByID(req.body.title,
                req.params.id);

            if (!foundBook) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
                return;
            }

            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

            /*В консоли можно использовать такую команду:
            fetch('http://localhost:3000/page-one/3', {method: 'PUT', body: JSON.stringify({title: 'book-one-one'}),
                headers: {
                    'content-type': 'application/json'
                }})
                    .then(res => res.json())
                    .then(json => console.log(json))

            Для проверки изменения можно использовать такую команду:
            fetch('http://localhost:3000/page-one', {method: 'GET'})
                .then(res => res.json())
                .then(json => console.log(json))
            */
        });

    return router;
};

export const getInterestingRouter = () => {
    const router = express.Router();

    /*Создали специальный роутер, который обслуживает два запроса. Если перейти по адресу "/interesting/books", то
    мы попадем во второй запрос, то есть увидим "data by id: books", хотя возможно мы хотели бы увидеть по этому
    адресу "books handler". Но если поменять местами указанные ниже запросы, то мы уже увидим "books handler", что
    скорее всего, является желаемым поведением. Из этого следует, что порядок регистрации маршрутов важен. В данном
    случае первый запрос будет проверяться приложением первым и покрывать любой указанный текст после "/interesting/",
    тем самым не давая возможности сработать второму запросу. Если же эти два запроса указать в обратном порядке, то
    сначала будет проверяться приложением запрос с "books handler", и только если он не удовлетворит приложение, уже
    после этого сработает запрос с "data by id: ".
    Чтобы ограничить использование параметров, можно использовать регулярные выражения. Например, если в первом запросе
    указать "/:id([0-9]+)" вместо "/:id", то он будет обрабатывать параметры, состоящие только из цифр, что тоже решит
    ранее указанную нашу проблему.*/
    router.get('/:id', (req: RequestWithParams<GetURIParamsIDBookModel>, res: Response) => {
        res.json({title: 'data by id: ' + req.params.id});
    });

    router.get('/books', (req: RequestWithQuery<GetQueryBooksModel>, res: Response) => {
        res.json({title: 'books handler'});
    });

    return router;
};

/*Создаем свой middleware, который предоставляет дополнительные данные.*/
export const uselessMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    req.someInfo = 'Ok';
    next(); // Этот метод нужен для работы цепочки handler-функций.
};

/*Создаем свой middleware, который имитирует проверку на логинизацию, чтобы ее пройти нужно использовать query-параметр
?token=123*/
export const authGuardMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.query.token === '123') {
        next();
    } else {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
};

let requestCounter = 0;

/*Создаем свой middleware, который считает количество запросов.*/
export const requestCounterMiddleware = (req: Request, res: Response, next: NextFunction) => {
    requestCounter++;
    next();
};

export const getAuthorsRouter = () => {
    const router = express.Router();

    /*Можно задавать больше одной handler-функции, тем самым реализуя middleware.*/
    // router.get('/', uselessMiddleware, (req: Request, res: Response) => {
    //         // @ts-ignore
    //         const someInfo = req.someInfo;
    //         res.json({someInfo: someInfo + ` let's go`});
    //     }
    // );

    /*Также можно указать свой middleware в "app.use()".*/
    router.get('/', (req: Request, res: Response) => {
            // @ts-ignore
            const someInfo = req.someInfo;
            res.json({someInfo: someInfo + ` let's go` + ` requests: ` + requestCounter});
        }
    );

    return router;
};