/*
Установка: установить Node.js

Запуск приложения: node server4.js

Это HTTP-сервер, который прослушивает протокол HTTP на порту 3003 (lesson 006).

Проверка приложения:
Перейти на http://localhost:3003/
Перейти на http://localhost:3003/home
Перейти на http://localhost:3003/about
*/

const http = require('http');
const fs = require('fs');

/*Создаем функцию, возвращающую промис, исполнителем внутри которого является метод "setTimeout()", резольвящий промис
спустя указанное количество времени. Ниже используем ключевое слово "await", которое заставит интерпретатор JavaScript
ждать до тех пор, пока промис справа от ключевого слова "await" не выполнится, после чего ключевое слово "await" вернет
результат промиса и выполнение кода продолжится. То есть эта функция "delay()" имитирует задержку времени.*/
const delay = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};

/*Создаем функцию, получающую путь к какому-то файлу и возвращающую промис, исполнителем внутри которого является
функция, асинхронно считывающая файл и запускающая callback-функцию, резольвящуюю промис со считанными данными или
отклоняющую промис в случае ошибки. Реализация при помощи промисов осуществляет асинхронную работу кода, позволяющую
параллельно обрабатывать другие запросы на сервер. В рамках одного запроса благодаря ключевому слову "await" имитируем
задержку, пока файл не будет полностью считан.*/
const readFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(data);
            }
        });
    });
};

const server = http.createServer(
    async (request, response) => {
        switch (request.url) {
            case '/home' : {
                /*Метод "readFileSync()" это встроенный метод модуля "fs", для синхронного чтения файлов.*/
                // const data = fs.readFileSync('pages/home.html');

                /*Метод "readFile()" это встроенный метод модуля "fs", для асинхронного чтения файлов. После того как
                этот метод прочитывает указанные данные, он вызывает переданную ему callback-функцию, получающую два
                параметра, в первом из которых содержится ошибка при ее наличии, а во втором содержатся прочитанные
                данные из файла.*/
                // fs.readFile('pages/home.html', (err, data) => {
                //     if (err) { response.write(err.message) } else { response.write(data) }
                //     response.end();
                // });

                try {
                    const data = await readFile('pages/home.html');
                    response.write(data);
                    response.end();
                } catch (err) {
                    response.write(err);
                    response.end();
                }

                break;
            }

            case '/about' : {

                try {
                    const data = await readFile('pages/about.html');
                    await delay(3000);
                    response.write(data);
                    response.end();
                } catch (err) {
                    response.write(err);
                    response.end();
                }

                break;
            }

            default: {
                response.write('404 not found');
                response.end();
            }
        }
    }
);

server.listen(3003);