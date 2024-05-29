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
exports.authService = void 0;
const users_repository_db_1 = require("../../repositories/users-repository-db");
exports.authService = {
    /*Подтверждение почты пользователя на BLL уровне.*/
    confirmEmail(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield users_repository_db_1.usersRepository.findByLoginOrEmail(email);
            if (!user ||
                user.emailConfirmation.isConfirmed ||
                user.emailConfirmation.confirmationCode !== code ||
                user.emailConfirmation.expirationDate < new Date()) {
                return false;
            }
            return yield users_repository_db_1.usersRepository.updateConfirmation(user._id);
        });
    },
};
