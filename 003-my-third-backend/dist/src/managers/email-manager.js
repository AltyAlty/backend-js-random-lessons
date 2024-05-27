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
exports.emailManager = void 0;
/*Сделали дополнительную прослойку между сервисами и адаптерами - менеджеры.*/
const email_adapter_1 = require("../adapters/email-adapter");
exports.emailManager = {
    sendRegularEmail(email, subject, message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield email_adapter_1.emailAdapter.sendEmail(email, subject, message);
        });
    },
    sendPasswordRecoveryMessage(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield email_adapter_1.emailAdapter.sendEmail(email, 'Password Recovery', `<div>Your new password: ${newPassword}</div>`);
        });
    }
};
