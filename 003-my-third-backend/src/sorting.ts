/*
Для запуска:
yarn ts-node .\src\sorting.ts
*/

import {ObjectId} from 'mongodb';

/*Чем позднее экземпляр "ObjectId" из "MongoDB" создан, тем он больше.*/
let objID01 = new ObjectId();
console.log(objID01);
let objID02 = new ObjectId();
console.log(objID02);
let objID03 = new ObjectId();
console.log(objID03);

console.log(objID01 > objID02); // false
console.log(objID01 < objID02); // true

console.log(objID01 > objID03); // false
console.log(objID01 < objID03); // true

console.log(objID02 > objID03); // false
console.log(objID02 < objID03); // true

let users = [
    {id: 'v3w4-gk9f-12', name: 'OK', age: 24},
    {id: 'eg7s-df4u-38', name: 'Ak', age: 35},
    {id: 'uyt6-b1gy-2e', name: 'ab', age: 21},
    {id: 'r3js-df2g-dd', name: 'FAS', age: 56},
    {id: 'd34r-df2f-2f', name: 'FAS', age: 29},
    {id: 'f2gu-e3g2-y6', name: 'FAS', age: 32},
];

users.push(
    {id: 'akq3-ope7-4t', name: 'LOL', age: 34}
);

function compareAgeNumAsc(
    a: { id: string, name: string, age: number },
    b: { id: string, name: string, age: number }
): number {
    return a.age - b.age;
};

function compareAgeNumDesc(
    a: { id: string, name: string, age: number },
    b: { id: string, name: string, age: number }
): number {
    return b.age - a.age;
};

function compareNameStringAsc(
    a: { id: string, name: string, age: number },
    b: { id: string, name: string, age: number }
): number {
    return a.name.localeCompare(b.name);
};

function compareNameStringDesc(
    a: { id: string, name: string, age: number },
    b: { id: string, name: string, age: number }
): number {
    return b.name.localeCompare(a.name);
};

function compareNameStringAndAgeNumAsc(
    a: { id: string, name: string, age: number },
    b: { id: string, name: string, age: number }
): number {
    if (a.name.localeCompare(b.name) === 0) {
        return a.age - b.age;
    } else {
        return a.name.localeCompare(b.name);
    }
};

function compareNameStringAndAgeNumDesc(
    a: { id: string, name: string, age: number },
    b: { id: string, name: string, age: number }
): number {
    if (b.name.localeCompare(a.name) === 0) {
        return b.age - a.age;
    } else {
        return b.name.localeCompare(a.name);
    }
};

type SortedBy = {
    fieldName: 'id' | 'name' | 'age'
    fieldType: 'number' | 'string'
    order: 'asc' | 'desc'
};

let sortBy: SortedBy = {
    fieldName: 'name',
    fieldType: 'string',
    order: 'asc'
};

let thenSortBy: SortedBy = {
    fieldName: 'age',
    fieldType: 'number',
    order: 'desc'
};

function compareBy(
    a: { id: string, name: string, age: number },
    b: { id: string, name: string, age: number }
): any {
    if (sortBy.fieldType === 'number') {
        if (a[sortBy.fieldName] > b[sortBy.fieldName]) return sortBy.order === 'asc' ? 1 : -1
        if (a[sortBy.fieldName] < b[sortBy.fieldName]) return sortBy.order === 'asc' ? -1 : 1

        if (thenSortBy.fieldType === 'number') {
            if (a[thenSortBy.fieldName] > b[thenSortBy.fieldName]) return thenSortBy.order === 'asc' ? 1 : -1
            if (a[thenSortBy.fieldName] < b[thenSortBy.fieldName]) return thenSortBy.order === 'asc' ? -1 : 1

        } else if (thenSortBy.fieldType === 'string') {
            if (String(a[thenSortBy.fieldName]).localeCompare(String(b[thenSortBy.fieldName])) > 0) {
                return thenSortBy.order === 'asc' ? 1 : -1
            }

            if (String(a[thenSortBy.fieldName]).localeCompare(String(b[thenSortBy.fieldName])) < 0) {
                return thenSortBy.order === 'asc' ? -1 : 1
            }
        }
    }

    if (sortBy.fieldType === 'string') {
        if (String(a[sortBy.fieldName]).localeCompare(String(b[sortBy.fieldName])) > 0) {
            return sortBy.order === 'asc' ? 1 : -1
        }

        if (String(a[sortBy.fieldName]).localeCompare(String(b[sortBy.fieldName])) < 0) {
            return sortBy.order === 'asc' ? -1 : 1
        }

        if (thenSortBy.fieldType === 'number') {
            if (a[thenSortBy.fieldName] > b[thenSortBy.fieldName]) return thenSortBy.order === 'asc' ? 1 : -1
            if (a[thenSortBy.fieldName] < b[thenSortBy.fieldName]) return thenSortBy.order === 'asc' ? -1 : 1

        } else if (thenSortBy.fieldType === 'string') {
            if (String(a[thenSortBy.fieldName]).localeCompare(String(b[thenSortBy.fieldName])) > 0) {
                return thenSortBy.order === 'asc' ? 1 : -1
            }

            if (String(a[thenSortBy.fieldName]).localeCompare(String(b[thenSortBy.fieldName])) < 0) {
                return thenSortBy.order === 'asc' ? -1 : 1
            }
        }
    }
};

function compareBy2(
    a: { id: string, name: string, age: number },
    b: { id: string, name: string, age: number }
): any {
    if (sortBy.fieldType === 'number') {
        if (a[sortBy.fieldName] > b[sortBy.fieldName]) return sortBy.order === 'asc' ? 1 : -1
        if (a[sortBy.fieldName] < b[sortBy.fieldName]) return sortBy.order === 'asc' ? -1 : 1

        if (thenSortBy.fieldType === 'number') {
            if (a[thenSortBy.fieldName] > b[thenSortBy.fieldName]) return thenSortBy.order === 'asc' ? 1 : -1
            if (a[thenSortBy.fieldName] < b[thenSortBy.fieldName]) return thenSortBy.order === 'asc' ? -1 : 1

        } else if (thenSortBy.fieldType === 'string') {
            if (a[thenSortBy.fieldName] > b[thenSortBy.fieldName]) {
                return thenSortBy.order === 'asc' ? 1 : -1
            }

            if (a[thenSortBy.fieldName] < b[thenSortBy.fieldName]) {
                return thenSortBy.order === 'asc' ? -1 : 1
            }
        }
    }

    if (sortBy.fieldType === 'string') {
        if (a[sortBy.fieldName] > b[sortBy.fieldName]) {
            return sortBy.order === 'asc' ? 1 : -1
        }

        if (a[sortBy.fieldName] < b[sortBy.fieldName]) {
            return sortBy.order === 'asc' ? -1 : 1
        }

        if (thenSortBy.fieldType === 'number') {
            if (a[thenSortBy.fieldName] > b[thenSortBy.fieldName]) return thenSortBy.order === 'asc' ? 1 : -1
            if (a[thenSortBy.fieldName] < b[thenSortBy.fieldName]) return thenSortBy.order === 'asc' ? -1 : 1

        } else if (thenSortBy.fieldType === 'string') {
            if (a[thenSortBy.fieldName] > b[thenSortBy.fieldName]) {
                return thenSortBy.order === 'asc' ? 1 : -1
            }

            if (a[thenSortBy.fieldName] < b[thenSortBy.fieldName]) {
                return thenSortBy.order === 'asc' ? -1 : 1
            }
        }
    }
};

const getUsers = () => {
    return [...users].sort(compareBy);
    // return [...users].sort(compareBy2);
};

console.log(getUsers());

console.log('ab' < 'Ak'); // false
console.log('ab' > 'Ak'); // true
console.log('ab'.localeCompare('Ak', 'en')); // правильный аналог 'ab' > 'Ak' => -1
console.log('Ak'.localeCompare('ab', 'en')); // правильный аналог 'ab' < 'Ak' => 1