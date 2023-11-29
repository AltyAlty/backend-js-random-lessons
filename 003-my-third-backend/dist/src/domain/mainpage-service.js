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
exports.mainPageService = void 0;
const mainpage_repository_db_1 = require("../repositories/mainpage-repository-db");
// import {mainPageRepository} from '../repositories/mainpage-repository-local';
exports.mainPageService = {
    getMainPageContent() {
        return __awaiter(this, void 0, void 0, function* () {
            const mainPageContent = yield mainpage_repository_db_1.mainPageRepository.getMainPageContent();
            if (mainPageContent) {
                return mainPageContent.content;
            }
            else {
                return 'Cannot get main page content';
            }
        });
    }
};
