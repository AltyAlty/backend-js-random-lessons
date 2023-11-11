"use strict";
/*
Что нужно для работы:

npm install --global yarn
yarn init (можно добавить флаг "--yes", чтобы не отвечать на вопросы)
yarn add express
yarn add nodemon -D
yarn add typescript ts-node @types/express @types/node -D
yarn tsc --init
yarn add -D jest ts-jest @types/jest supertest @types/supertest
yarn ts-jest config:init
yarn add express-validator
yarn add mongodb
прочитать следующий комментарий
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
Установка "yarn" (после его установки, лучше не использоват одновременно с npm): npm install --global yarn
Файл "package.json" с точки зрения Node.js эта файл является определяющей какой-либо проект.
Чтобы этот файл появился нужно написать: yarn init
Если написать "yarn", то произойдет попытка определить зависимости в проекте.

Чтобы установить фреймворк "Express" нужно ввести: yarn add express

"nodemon" это программа-пакет, которая отслеживает изменение файлов и автоматически меняет сервер в браузере без
необходимости его постоянно перезапускать. Такой пакет лучше устанавливать локально и для разработки, то есть указывая
"--save-dev" для npm или "-D" для yarn. Для его установки нужно ввести: yarn add nodemon -D
Чтобы локально запустить nodemon нужно ввести: yarn nodemon имя_файла

Чтобы отладить программу по шагам нужно использовать флаг "--inspect": yarn nodemon --inspect имя_файла
После этого в Chrome можно открыть DevTools - Node.js

Установка Typescript, утилиты ts-node, которая нужна для полноценной работе nodemon и другого, типы для Express, типы
для Node.js (все это только для разработки):
yarn add typescript ts-node @types/express @types/node -D
Чтобы запустить компилятор Typescript локалько нужно ввести: yarn tsc имя_файла
Эта команда скомпилирует файл .ts в .js
Чтобы Typescript правильно работал, его нужно настроить при помощи команды: yarn tsc --init
После этой команды появится файл "tsconfig.js". В этом файле можно найти раздел "outDir" и указать там куда складывать
все скомпилированные файлы. Например, так: "outDir": "./dist". После этого если ввести команду "yarn tsc", то все, что
компилятор скомпилирует он положит в указанную папку. Также в файле "tsconfig.json" можно найти раздел "Modules" и в
поле "rootDir" указать, что компилировать в JS.
Далее уже можно запустить скомпилированные файлы: yarn nodemon --inspect имя_файла
То есть теперь нужно каждый раз запускать команду "yarn tsc", чтобы nodemon обновил программу. Но чтобы не писать эту
команду постоянно вручную, можно указать флаг -w в отдельном терминале: yarn tsc -w
В другом терминале уже нужно запускать нужный файл .js.
Чтобы запускать сразу две эти команды, то в файл "package.json" перед разделом "dependencies" нужно добавить:
"scripts": {
    "watch": "tsc -w",
    "dev": "nodemon .\\dist\\src\\index.js"
  },
Теперь либо можно запускать эти команды прямо из этого файла, либо нажать ПКМ на него и выбрать "Show npm Scripts",
чтобы можно было запускать эти команды в отдельном окне.
Или же можно в двух терминалах ввести "yarn watch" и "yarn dev".

Для тестирования можно использовать связку jest + ts-jest + supertest. Для установки этой связки нужна следующая
команда: yarn add -D jest ts-jest @types/jest supertest @types/supertest
Далее для работы jest нужен базовый файл конфигурации "jest.config.js". Для этого нужно ввести:
yarn ts-jest config:init
Для запуска тестирования нужна команда jest, которую также можно указать в скриптах в в файле "package.json".

"express-validator" это набор промежуточных слоев для Express, в который входит обширная коллекция валидаторов и
дезинфицирующих средств, предлагаемых "validator.js". Для установки нужно ввести: yarn add express-validator

Чтобы иметь возможность подключаться к MongoDB устанавливаем специальный драйвер под Node.js: yarn add mongodb
*/
/*Этот файл "index.ts" служит главной точкой входа в приложении, поэтому здесь просто подключается "app" и происходит
запуск прослушивания порта.*/
const app_1 = require("./app");
const db_1 = require("./db/db");
/*Делаем так, чтобы порт определялся автоматически от окружения.*/
const port = process.env.PORT || 3000;
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    /*Почему то все работало даже без этой функции.*/
    yield (0, db_1.runDB)();
    /*Устанавлиаем какой порт прослушивается.*/
    app_1.app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
startApp();
