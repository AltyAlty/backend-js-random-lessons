/*Создаем тип для исходящей модели (View Model) для возвращения клиенту данных о книге.*/
export type BookViewModel = {
    /*
     * id of an existing book to return to a client
     */
    id: number,
    /*
     * title of an existing book to return to a client
     */
    title: string
}