export type BookType = {
    id: number,
    title: string,
    customersCount: number
};

export type DBType = {
    mainPageContent: string
    books: BookType[]
};

export const db: DBType = {
    mainPageContent: '<h1>Hello!</h1>',

    books: [
        {id: 1, title: 'book-one', customersCount: 5},
        {id: 2, title: 'book-two', customersCount: 6},
        {id: 3, title: 'book-three', customersCount: 7},
        {id: 4, title: 'book-four', customersCount: 8}
    ]
};