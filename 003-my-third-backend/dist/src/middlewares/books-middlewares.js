"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.titleValidationMiddleware = exports.titleIsOfCorrectLengthValidationMiddleware = exports.titleIsNotEmptyValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const utils_1 = require("../utils");
/*Используем здесь middleware "body" из библиотеки "express-validator", чтобы проверить наличие "title" и
установить для него ограничения.*/
exports.titleIsNotEmptyValidationMiddleware = (0, express_validator_1.body)('title')
    .not().isEmpty({ ignore_whitespace: true }).withMessage('title must not be empty');
exports.titleIsOfCorrectLengthValidationMiddleware = (0, express_validator_1.body)('title')
    .isLength({ min: 3, max: 20 }).withMessage('title must be min: 3, max: 20');
const titleValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.sendStatus(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
    }
    else {
        next();
    }
};
exports.titleValidationMiddleware = titleValidationMiddleware;
