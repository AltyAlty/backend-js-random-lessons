const http = require('http');

const server = http.createServer((request, response) => {
    switch (request.url) {
        case '/home' : {
            /*Здесь мы используем метод "setTimeout()" для имитации асинхронной работы. То есть теперь если мы сделаем
            3 запроса на сервер, то каждый из них выполнится через 3 секунды.*/
            setTimeout(() => {
                const data = 'HOME';
                response.write(data);
                response.end();
            }, 3000);

            break;
        }

        default: {
            response.write('404');
            response.end();
        }
    }
});

server.listen(3003);