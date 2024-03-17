/*Обертка над переменными окружения.*/
export const settings = {
    MONGO_URI: process.env.mongoURI || "mongodb://0.0.0.0:27017/?maxPoolSize=20&w=majority",
    JWT_SECRET: process.env.JWT_SECRET || "123"
};