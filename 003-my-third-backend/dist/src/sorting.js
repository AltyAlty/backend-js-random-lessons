"use strict";
/*Этот файл содержит примеры сортировки массивов.
Запуск файла: yarn ts-node .\src\sorting.ts*/
Object.defineProperty(exports, "__esModule", { value: true });
/*Импортируем ObjectId из MongoDB для создания ID.*/
const mongodb_1 = require("mongodb");
/*Чем позднее экземпляр ObjectId из MongoDB создан, тем он больше.*/
let objID01 = new mongodb_1.ObjectId();
let objID02 = new mongodb_1.ObjectId();
let objID03 = new mongodb_1.ObjectId();
console.log('---------01');
console.log(objID01);
console.log(objID02);
console.log(objID03);
console.log('---------02');
console.log(objID01 > objID02); // false
console.log(objID01 < objID02); // true
console.log('---------03');
console.log(objID01 > objID03); // false
console.log(objID01 < objID03); // true
console.log('---------04');
console.log(objID02 > objID03); // false
console.log(objID02 < objID03); // true
/*Пример массива с пользователями.*/
const users = [
    { id: 'v3w4-gk9f-12', name: 'OK', age: 24 },
    { id: 'eg7s-df4u-38', name: 'Ak', age: 35 },
    { id: 'uyt6-b1gy-2e', name: 'ab', age: 21 },
    { id: 'r3js-df2g-dd', name: 'FAS', age: 56 },
    { id: 'd34r-df2f-2f', name: 'FAS', age: 29 },
    { id: 'f2gu-e3g2-y6', name: 'FAS', age: 32 },
];
/*Добавляем нового пользователя в массив "users". При выводе этого массива в консоль добавленный пользователь будет в
конце.*/
users.push({ id: 'akq3-ope7-4t', name: 'LOL', age: 34 });
/*Далее создаем callback-функции для метода "sort()". Для сравнения строк используем callback-функцию с использованием
метода "localeCompare()", а не простое "a > b", так как возможно будет не совсем ожидаемое поведение, если в строках
есть не только строчные буквы, но еще и заглавные. Например, при простом сравнении строка "ab" будет больше строки "Ak",
хотя, скорее всего, будет ожидаться обратное при сортировке по возрастанию, поскольку первые символы "по значению"
равны, и если смотреть на вторые символы в каждой строке, то "b" должно быть меньше "k". При использовании метода
"localeCompare()" сравнение строк "ab" и "Ak" даст -1, что будет означать, что строка "ab" не больше строки "Ak", то
есть строку "ab" мы поставим раньше строки "Ak".*/
/*Создаем callback-функцию "compareAgeNumAsc()" для метода "sort()" для сортировки по возрастанию по возрасту.*/
function compareAgeNumAsc(a, b) {
    return a.age - b.age;
}
;
/*Создаем callback-функцию "compareAgeNumDesc()" для метода "sort()" для сортировки по убыванию по возрасту.*/
function compareAgeNumDesc(a, b) {
    return b.age - a.age;
}
;
/*Создаем callback-функцию "compareNameStringAsc()" для метода "sort()" для сортировки по возрастанию по имени.*/
function compareNameStringAsc(a, b) {
    return a.name.localeCompare(b.name);
}
;
/*Создаем callback-функцию "compareNameStringDesc()" для метода "sort()" для сортировки по убыванию по имени.*/
function compareNameStringDesc(a, b) {
    return b.name.localeCompare(a.name);
}
;
/*Создаем callback-функцию "compareNameStringAndAgeNumAsc()" для метода "sort()" для сортировки по возрастанию по имени
и по возрасту.*/
function compareNameStringAndAgeNumAsc(a, b) {
    if (a.name.localeCompare(b.name) === 0) {
        return a.age - b.age;
    }
    else {
        return a.name.localeCompare(b.name);
    }
}
;
/*Создаем callback-функцию "compareNameStringAndAgeNumDesc()" для метода "sort()" для сортировки по убыванию по имени и
по возрасту.*/
function compareNameStringAndAgeNumDesc(a, b) {
    if (b.name.localeCompare(a.name) === 0) {
        return b.age - a.age;
    }
    else {
        return b.name.localeCompare(a.name);
    }
}
;
/*???*/
const sortBy = {
    fieldName: 'name',
    fieldType: 'string',
    order: 'asc'
};
/*???*/
const thenSortBy = {
    fieldName: 'age',
    fieldType: 'number',
    order: 'desc'
};
/*???*/
function compareBy(a, b) {
    if (sortBy.fieldType === 'number') {
        if (a[sortBy.fieldName] > b[sortBy.fieldName])
            return sortBy.order === 'asc' ? 1 : -1;
        if (a[sortBy.fieldName] < b[sortBy.fieldName])
            return sortBy.order === 'asc' ? -1 : 1;
        if (thenSortBy.fieldType === 'number') {
            if (a[thenSortBy.fieldName] > b[thenSortBy.fieldName])
                return thenSortBy.order === 'asc' ? 1 : -1;
            if (a[thenSortBy.fieldName] < b[thenSortBy.fieldName])
                return thenSortBy.order === 'asc' ? -1 : 1;
        }
        else if (thenSortBy.fieldType === 'string') {
            if (String(a[thenSortBy.fieldName]).localeCompare(String(b[thenSortBy.fieldName])) > 0) {
                return thenSortBy.order === 'asc' ? 1 : -1;
            }
            if (String(a[thenSortBy.fieldName]).localeCompare(String(b[thenSortBy.fieldName])) < 0) {
                return thenSortBy.order === 'asc' ? -1 : 1;
            }
        }
    }
    if (sortBy.fieldType === 'string') {
        if (String(a[sortBy.fieldName]).localeCompare(String(b[sortBy.fieldName])) > 0) {
            return sortBy.order === 'asc' ? 1 : -1;
        }
        if (String(a[sortBy.fieldName]).localeCompare(String(b[sortBy.fieldName])) < 0) {
            return sortBy.order === 'asc' ? -1 : 1;
        }
        if (thenSortBy.fieldType === 'number') {
            if (a[thenSortBy.fieldName] > b[thenSortBy.fieldName])
                return thenSortBy.order === 'asc' ? 1 : -1;
            if (a[thenSortBy.fieldName] < b[thenSortBy.fieldName])
                return thenSortBy.order === 'asc' ? -1 : 1;
        }
        else if (thenSortBy.fieldType === 'string') {
            if (String(a[thenSortBy.fieldName]).localeCompare(String(b[thenSortBy.fieldName])) > 0) {
                return thenSortBy.order === 'asc' ? 1 : -1;
            }
            if (String(a[thenSortBy.fieldName]).localeCompare(String(b[thenSortBy.fieldName])) < 0) {
                return thenSortBy.order === 'asc' ? -1 : 1;
            }
        }
    }
}
;
/*???*/
function compareBy2(a, b) {
    if (sortBy.fieldType === 'number') {
        if (a[sortBy.fieldName] > b[sortBy.fieldName])
            return sortBy.order === 'asc' ? 1 : -1;
        if (a[sortBy.fieldName] < b[sortBy.fieldName])
            return sortBy.order === 'asc' ? -1 : 1;
        if (thenSortBy.fieldType === 'number') {
            if (a[thenSortBy.fieldName] > b[thenSortBy.fieldName])
                return thenSortBy.order === 'asc' ? 1 : -1;
            if (a[thenSortBy.fieldName] < b[thenSortBy.fieldName])
                return thenSortBy.order === 'asc' ? -1 : 1;
        }
        else if (thenSortBy.fieldType === 'string') {
            if (a[thenSortBy.fieldName] > b[thenSortBy.fieldName])
                return thenSortBy.order === 'asc' ? 1 : -1;
            if (a[thenSortBy.fieldName] < b[thenSortBy.fieldName])
                return thenSortBy.order === 'asc' ? -1 : 1;
        }
    }
    if (sortBy.fieldType === 'string') {
        if (a[sortBy.fieldName] > b[sortBy.fieldName])
            return sortBy.order === 'asc' ? 1 : -1;
        if (a[sortBy.fieldName] < b[sortBy.fieldName])
            return sortBy.order === 'asc' ? -1 : 1;
        if (thenSortBy.fieldType === 'number') {
            if (a[thenSortBy.fieldName] > b[thenSortBy.fieldName])
                return thenSortBy.order === 'asc' ? 1 : -1;
            if (a[thenSortBy.fieldName] < b[thenSortBy.fieldName])
                return thenSortBy.order === 'asc' ? -1 : 1;
        }
        else if (thenSortBy.fieldType === 'string') {
            if (a[thenSortBy.fieldName] > b[thenSortBy.fieldName])
                return thenSortBy.order === 'asc' ? 1 : -1;
            if (a[thenSortBy.fieldName] < b[thenSortBy.fieldName])
                return thenSortBy.order === 'asc' ? -1 : 1;
        }
    }
}
;
/*Создаем функции "sortUsers01()" и "sortUsers02()", которые делают поверхностную копию массива "users", сортируют ее и
возвращают наружу.*/
const sortUsers01 = () => { return [...users].sort(compareBy); };
const sortUsers02 = () => { return [...users].sort(compareBy2); };
console.log('---------05');
console.log(users);
console.log(sortUsers01());
console.log(sortUsers02());
console.log('---------06');
console.log('ab' < 'Ak'); // false
console.log('ab' > 'Ak'); // true
console.log('ab'.localeCompare('Ak', 'en')); // правильный аналог 'ab' > 'Ak' => -1
console.log('Ak'.localeCompare('ab', 'en')); // правильный аналог 'ab' < 'Ak' => 1
