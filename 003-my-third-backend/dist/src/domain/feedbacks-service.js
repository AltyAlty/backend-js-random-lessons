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
exports.feedbacksService = void 0;
const mongodb_1 = require("mongodb");
const feedbacks_repository_db_1 = require("../repositories/feedbacks-repository-db");
exports.feedbacksService = {
    sendFeedback(comment, userID, bookID) {
        return __awaiter(this, void 0, void 0, function* () {
            const newFeedback = {
                _id: new mongodb_1.ObjectId,
                userID: userID,
                bookID: bookID,
                comment: comment,
                createdAt: new Date()
            };
            return feedbacks_repository_db_1.feedbacksRepository.createFeedback(newFeedback);
        });
    },
    allFeedbacks() {
        return __awaiter(this, void 0, void 0, function* () {
            return feedbacks_repository_db_1.feedbacksRepository.getAllFeedbacks();
        });
    },
};
