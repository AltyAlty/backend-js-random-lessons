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
exports.getFeedbacksRouter = void 0;
const express_1 = __importDefault(require("express"));
const feedbacks_service_1 = require("../domain/feedbacks-service");
const auth_middlewares_1 = require("../middlewares/auth/auth-middlewares");
const getFeedbacksRouter = () => {
    const router = express_1.default.Router();
    /*Создание нового отзыва на UI уровне. Используем промежуточный слой "authMiddleware" для проверки пользователя.
    Этот слой добавит данные о пользователе в запрос.*/
    router.post('/', auth_middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const newFeedback = yield feedbacks_service_1.feedbacksService.sendFeedback(req.body.comment, req.user._id, req.body.bookID);
        res.status(201).send(newFeedback);
    }))
        /*Сначала нужно создать пользователя, затем залогиниться, и после в консоли можно использовать такую команду:
                fetch('http://localhost:3000/feedback', {method: 'POST', body: JSON.stringify({comment: 'ok', bookID: 3}),
                headers: {
                    'authorization': 'Bearer insert_your_token',
                    'content-type': 'application/json'
                }})
                    .then(res => res.json())
                    .then(json => console.log(json))
        */
        .get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const feedbacks = yield feedbacks_service_1.feedbacksService.allFeedbacks();
        res.send(feedbacks);
    }));
    return router;
};
exports.getFeedbacksRouter = getFeedbacksRouter;
