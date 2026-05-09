const http = require('http');

const server = http.createServer(
    (request, response) => {
        switch (request.url) {
            case '/home' : {
                /*Создаем объект даты с текущей датой и временем.*/
                const start = new Date();
                /*Создаем задержку в 3 секунды при помощи цикла while, так как он будет работать пока условие верно и
                тем самым не будет позволять запускать код дальше. Если сделать 3 запроса на сервер, то первый
                обработается через 3 секунды, второй через 6, а третий через 9, так как всего один синхронный поток
                работы и каждая следующая задача ждет выполнения предыдущей.*/
                while (new Date() - start < 3000) { console.log(new Date() - start) }
                const data = 'HOME';
                response.write(data);
                response.end();
                break;
            }

            default: {
                response.write('404');
                response.end();
            }
        }
    }
);

server.listen(3003);