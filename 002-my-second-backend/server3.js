const http = require('http');

const server = http.createServer(
    (request, response) => {
        switch (request.url) {
            case '/home' : {
                setTimeout(
                    () => {
                        const data = 'HOME';
                        response.write(data);
                    }, 3000
                );

                break;
            }

            default: {
                response.write('404');
            }
        }

        /*В данном случае метод "end()" вызывается только в одном месте уже после работы switch/case. Поскольку метод
        "setTimeout()" порождает макрозадачу, которая не останавливает общий поток выполнения кода, то получается так,
        что этот метод "end()" срабатывает раньше, чем срабатывает callback-функция в методе "setTimeout()", то есть
        ответ будет закрыт раньше, чем будет видна работа callback-функции в методе "setTimeout()".*/
        response.end();
    }
);

server.listen(3003);