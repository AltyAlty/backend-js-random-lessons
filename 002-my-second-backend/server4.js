const http = require('http');
const fs = require('fs');

/*Создаем функцию, которая возвращает промис, исполнителем внутри которого является метод "setTimeout()", который
спустя указанное количество времени зарезольвит этот промис. Ниже мы используем ключевое слово "await", которое заставит
интерпретатор JavaScript ждать до тех пор, пока промис справа от "await" не выполнится, после чего оно вернет его
результат, и выполнение кода продолжится. То есть эта функция "delay()" имитирует задержку времени. То есть это обвертка
для обычного метода "setTimeout()", только удобнее, так как синтаксически будет казаться, что мы пишем синхронный код,
то есть сначали жди, а потом сделай что-то следующее.*/
const delay = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};

/*Создаем функцию, которая будет получать путь к какому-то файлу и возвращать промис, исполнителем внутри которого
является функция, которая считывает асинхронно файл и после этого запускает callback-функцию, которая в случае ошибки
реджектит промис с этой ошибкой, а в случае без ошибки резолвит промис со считанными данными. Реализация на промисах
позволяет асинхронную работу кода, то есть параллельно могут выполняться другие запросы на сервер, но при этом в рамках
одного запроса, опять же благодаря "await/async" мы имитируем задержку, пока файл не будет полностью считан, а потом
уже записан в ответ.*/
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

const server = http.createServer(async (request, response) => {
    switch (request.url) {
        case '/home' : {
            /*Метод "readFileSync()" это встроенный метод модуля "fs", для того чтобы можно было прочитать какой-то
            файл, работая синхронно.*/
            // const data = fs.readFileSync('pages/home.html');

            /*Метод "readFile()" это встроенный метод модуля "fs", для того чтобы можно было прочитать какой-то файл,
            работая асинхронно. Когда этот метод прочитает указанные данные, он вызовет переданную ему callback-функцию,
            которая получит два параметра, в первом будет содержаться при наличии ошибка, а во втором данные.*/
            // fs.readFile('pages/home.html', (err, data) => {
            //     if (err) {
            //         response.write(err.message);
            //     } else {
            //         response.write(data);
            //     }
            //
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
            /*Ключевое слово "await" заставит интерпретатор JavaScript ждать до тех пор, пока промис справа от "await"
            не выполнится. После чего оно вернет его результат, и выполнение кода продолжится. Работает только внутри
            функция с "async".*/
            await delay(3000);
            response.write('about');
            response.end();

            // setTimeout(() => {
            //     response.write('about');
            //     response.end();
            // }, 3000);

            break;
        }

        default: {
            response.write('404 not found');
            response.end();
        }
    }
});

server.listen(3003);