/*Создаем тип для входящей модели (Input Model) для изменения книги с URI-параметрами.*/
export type UpdateURIParamsIDBookModel = {
    /*
     * id of an existing book to update
     */
    id: string
}