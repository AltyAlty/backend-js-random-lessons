const http = require('http');

const server = http.createServer(
    (request, response) => {
        switch (request.url) {
            case '/home' : {
                /*Используем метод "setTimeout()" для имитации асинхронной работы. Если сделать 3 запроса на сервер, то
                каждый из них обработается через 3 секунды.*/
                setTimeout(
                    () => {
                        const data = 'HOME';
                        response.write(data);
                        response.end();
                    }, 3000
                );

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