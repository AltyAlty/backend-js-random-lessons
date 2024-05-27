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
exports.businessService = void 0;
const email_manager_1 = require("../managers/email-manager");
exports.businessService = {
    doEmailOperation(email, subject, message, operationType) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (operationType) {
                case 'regular email': {
                    yield email_manager_1.emailManager.sendRegularEmail(email, subject, message);
                    break;
                }
                case 'password recovery': {
                    // Обратиться в репозиторий, чтобы поменять пароль
                    // Получить данные по пользователю из репозитория
                    yield email_manager_1.emailManager.sendPasswordRecoveryMessage(email, '12345');
                    break;
                }
                default:
            }
        });
    }
};
