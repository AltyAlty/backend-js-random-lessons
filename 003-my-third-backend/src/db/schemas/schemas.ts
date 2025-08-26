/*Импортируем mongoose из Mongoose для создания схем для MongoDB.*/
import mongoose from 'mongoose';
/*Импортируем для типизации.*/
import {ObjectId} from 'mongodb';

/*Схема для данных для главной страницы в Mongo БД.*/
const MainPageContentSchema = new mongoose.Schema({content: {type: String}});
/*Модель для схемы "MainPageContentSchema".*/
export const MainPageContentModel = mongoose.model('MainPageContent', MainPageContentSchema, 'main-page');

/*Схема для книг в Mongo БД.*/
const BookSchema = new mongoose.Schema({
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
export const BookModel = mongoose.model('Book', BookSchema, 'books');

/*Схема для пользователей в Mongo БД.*/
const UserSchema = new mongoose.Schema({
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
export const UserModel = mongoose.model('User', UserSchema, 'users');

/*Схема для отзывов в Mongo БД.*/
const FeedbackSchema = new mongoose.Schema({
    _id: {
        type: ObjectId,
        required: true
    },
    userID: {
        type: ObjectId,
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
export const FeedbackModel = mongoose.model('Feedback', FeedbackSchema, 'feedbacks');