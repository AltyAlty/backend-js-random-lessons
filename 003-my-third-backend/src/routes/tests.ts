import {Express} from 'express';
import {DBType} from '../db/db';
import {HTTP_STATUSES} from './books';


export const addTestsRoutes = (app: Express, db: DBType) => {
    app.delete('/__test__/data', (req, res) => {
        db.books = [];

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });
};