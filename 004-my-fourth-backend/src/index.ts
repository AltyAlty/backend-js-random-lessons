/*Импортируем express для создания HTTP-сервера. Импортируем Request и Response из Express для типизации.*/
import express, {Request, Response} from 'express';

/*Создаем приложение на Express.*/
const app = express();
/*Указываем порт для HTTP-сервера.*/
const port = 3000;

/*Конфигурируем GET-запрос.*/
app.get('/', (req: Request, res: Response) => {
    const message = 'Hi';
    res.send(message);
});

/*Устанавливаем порт для прослушивания.*/
app.listen(port, () => { console.log(`app listening on port ${port}`)});