import express from 'express';
import {HTTP_STATUSES} from '../utils/utils';
/*Импортируем ДБ.*/
import {db} from '../db/db';

export const getTestsRouter = () => {
    const router = express.Router();

    router.delete('/data', (req, res) => {
        db.books = [];

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });

    return router;
};