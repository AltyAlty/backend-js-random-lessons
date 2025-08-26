"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackModel = exports.UserModel = exports.BookModel = exports.MainPageContentModel = void 0;
/*Импортируем mongoose из Mongoose для создания схем для MongoDB.*/
const mongoose_1 = __importDefault(require("mongoose"));
/*Импортируем для типизации.*/
const mongodb_1 = require("mongodb");
/*Схема для данных для главной страницы в Mongo БД.*/
const MainPageContentSchema = new mongoose_1.default.Schema({ content: { type: String } });
/*Модель для схемы "MainPageContentSchema".*/
exports.MainPageContentModel = mongoose_1.default.model('MainPageContent', MainPageContentSchema, 'main-page');
/*Схема для книг в Mongo БД.*/
const BookSchema = new mongoose_1.default.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    customersCount: {
        type: Number,
        required: true
    }
});
/*Модель для схемы "BookSchema".*/
exports.BookModel = mongoose_1.default.model('Book', BookSchema, 'books');
/*Схема для пользователей в Mongo БД.*/
const UserSchema = new mongoose_1.default.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    passwordSalt: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: Date,
        isConfirmed: {
            type: Boolean,
            default: false
        }
    }
});
/*Модель для схемы "UserSchema". В Mongoose связь между моделью и коллекцией устанавливается автоматически при создании
модели: берется имя модели, преобразуется во множественное число и приводится к нижнему регистру. Или же можно просто
указать имя коллекции третьим параметром.*/
exports.UserModel = mongoose_1.default.model('User', UserSchema, 'users');
/*Схема для отзывов в Mongo БД.*/
const FeedbackSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongodb_1.ObjectId,
        required: true
    },
    userID: {
        type: mongodb_1.ObjectId,
        required: true
    },
    bookID: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});
/*Модель для схемы "FeedbackSchema".*/
exports.FeedbackModel = mongoose_1.default.model('Feedback', FeedbackSchema, 'feedbacks');
