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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailAdapter = void 0;
/*Адаптеры нужны, чтобы адаптировать какой-то код, то есть сделать обертку для какого-то кода.*/
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.emailAdapter = {
    sendEmail(email, subject, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                // Настройки ниже не нужны, если указан service.
                // host: 'smtp.gmail.com', // Хост почтового сервиса.
                // port: 587,
                // secure: false, // Use `true` for port 465, `false` for all other ports
                auth: {
                    user: "heneveraskedforthis@gmail.com",
                    pass: "zayk eovs taom dkzt ", // Пароль приложения из google.
                },
            });
            // send mail with defined transport object
            const info = yield transporter.sendMail({
                from: '"Adam Jensen" <heneveraskedforthis@gmail.com>',
                to: email,
                subject: subject,
                // text: "Did you ever ask for this?", // plain text body
                html: message, // html body
            });
            console.log(info);
        });
    }
};
