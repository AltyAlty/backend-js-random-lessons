/*Адаптеры нужны, чтобы адаптировать какой-то код, то есть сделать обертку для какого-то кода.*/
import nodemailer from 'nodemailer';

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Имя почтового сервиса.
            // Настройки ниже не нужны, если указан service.
            // host: 'smtp.gmail.com', // Хост почтового сервиса.
            // port: 587,
            // secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: "youremail@gmail.com", // Ваша почта.
                pass: "aaaa aaaa aaaa aaaa ", // Пароль приложения из google.
            },
        });

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Adam Jensen" <youremail@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            // text: "Did you ever ask for this?", // plain text body
            html: message, // html body
        });

        console.log(info);
    }
};