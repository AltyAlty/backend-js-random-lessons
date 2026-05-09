/*Импортируем наше приложение на Express.*/
import {app} from './app';
/*Импортируем функцию "connectDB()" для присоединения к Mongo БД.*/
import {connectDB} from './db/db-mongo';

/*Делаем так, чтобы порт определялся автоматически от окружения.*/
const port = process.env.PORT || 3000;

/*Создаем функцию "startApp()" для запуска приложения.*/
const startApp = async () => {
    /*Пытаемся присоединиться к Mongo БД. По какой-то причине все работает даже без вызова этой функции.*/
    await connectDB();
    /*Устанавливаем порт для прослушивания.*/
    app.listen(port, () => { console.log(`003-my-third-backend app listening on port ${port}`) });
};

/*Запускаем приложение.*/
startApp();