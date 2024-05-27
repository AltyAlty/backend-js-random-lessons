"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailRouter = void 0;
const express_1 = require("express");
const business_service_1 = require("../domain/business-service");
exports.emailRouter = (0, express_1.Router)({});
exports.emailRouter
    .post('/send', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield business_service_1.businessService.doEmailOperation(req.body.email, req.body.subject, req.body.message, req.body.operationType);
    res.send({
        'email': req.body.email,
        'subject': req.body.subject,
        'message': req.body.message,
        'operationType': req.body.operationType
    });
    /*В консоли можно использовать такую команду:
        fetch('http://localhost:3000/email/send', {method: 'POST', body: JSON.stringify({email: "jiramanager03@mail.ru", subject: "What a shame", message: "<b>Did you ever ask for this?</b>", operationType: "regular email"}),
        headers: {
            'content-type': 'application/json'
        }})
            .then(res => res.json())
            .then(json => console.log(json))
    */
    /*В консоли можно использовать такую команду:
        fetch('http://localhost:3000/email/send', {method: 'POST', body: JSON.stringify({email: "jiramanager03@mail.ru", subject: "", message: "", operationType: "password recovery"}),
        headers: {
            'content-type': 'application/json'
        }})
            .then(res => res.json())
            .then(json => console.log(json))
    */
}));
