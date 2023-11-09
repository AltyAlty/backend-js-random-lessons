import {NextFunction, Request, Response} from 'express';
import {body, validationResult} from 'express-validator';
import {HTTP_STATUSES} from "../utils";

/*Используем здесь middleware "body" из библиотеки "express-validator", чтобы проверить наличие "title" и
установить для него ограничения.*/
export const titleIsNotEmptyValidationMiddleware = body('title')
    .not().isEmpty({ignore_whitespace: true}).withMessage('title must not be empty');

export const titleIsOfCorrectLengthValidationMiddleware = body('title')
    .isLength({min: 3, max: 20}).withMessage('title must be min: 3, max: 20');

export const titleValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    } else {
        next();
    }
};