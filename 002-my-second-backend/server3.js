const http = require('http');

const server = http.createServer((request, response) => {
    switch (request.url) {
        case '/home' : {
            setTimeout(() => {
                const data = 'HOME';
                response.write(data);
            }, 3000);
            break;
        }

        default: {
            response.write('404');
        }
    }

    /*В данном случае метод "end()" мы вызываем только в одном месте уже после switch/case. Из-за этого поскольку
    метод "setTimeout()" работает асинхронно, то есть не останавливает общий поток выполнения кода, то получается так,
    что этот метод "end()" сработает раньше, чем сработает callback-функция в методе "setTimeout()", то есть мы ничего
    не увидим.*/
    response.end();
});

server.listen(3003);