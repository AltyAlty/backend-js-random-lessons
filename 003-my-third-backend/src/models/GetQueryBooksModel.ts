/*Создаем тип для входящей модели (Input Model) для получения книг с query-параметрами.*/
export type GetQueryBooksModel = {
    /*
     * title of an existing book to get
     */
    title: string
}