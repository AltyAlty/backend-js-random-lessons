/*Импортируем для типизации.*/
import {Request} from 'express';

/*"Request" из Express используется для типизации параметра "req", а "Response" из Express используется для типизации
параметра "res".

Типизация первого параметра "req" второго параметра в виде асинхронной функции методов "get()", "post()", "delete()" и
"put()" внутри роутеров из Express:
1. На первом месте в типе идут URI-параметры.
2. На втором месте в типе идет "ResBody". Относится к параметру "res" внутри запроса.
3. На третьем месте в типе идет "ReqBody". Это то, что приходит в body в запросе.
4. На четвертом месте в типе идут Query-параметры.*/
export type RequestWithQueryParamsType<Q> = Request<{}, {}, {}, Q>;
export type RequestWithURIParamsType<U> = Request<U, {}, {}, {}>;
export type RequestWithBodyType<B> = Request<{}, {}, B, {}>;
export type RequestWithURIParamsAndBodyType<U, B> = Request<U, {}, B, {}>;