"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoQueryRepository = void 0;
exports.videoQueryRepository = {
    getVideos() {
        const dbVideos = [];
        const dbAuthors = [];
        return dbVideos.map(dbVideo => {
            const dbAuthor = dbAuthors.find(a => a._id === dbVideo.authorID);
            return this._mapDBVideoToVideoOutputModel(dbVideo, dbAuthor);
        });
    },
    getVideoByID(id) {
        const dbVideo = {
            _id: '12',
            title: 'KELOL',
            authorID: '34',
            banObject: null
        };
        const dbAuthor = {
            _id: '34',
            firstName: 'POP',
            lastName: 'LO',
        };
        return this._mapDBVideoToVideoOutputModel(dbVideo, dbAuthor);
    },
    getBannedVideos() {
        const dbVideos = [];
        const dbAuthors = [];
        return dbVideos.map(dbVideo => {
            const dbAuthor = dbAuthors.find(a => a._id === dbVideo.authorID);
            return this._mapDBVideoToBannedVideoOutputModel(dbVideo, dbAuthor);
        });
    },
    _mapDBVideoToVideoOutputModel(dbVideo, dbAuthor) {
        return {
            id: dbVideo._id,
            title: dbVideo.title,
            author: {
                id: dbAuthor._id,
                name: dbAuthor.firstName + ' ' + dbAuthor.lastName
            }
        };
    },
    _mapDBVideoToBannedVideoOutputModel(dbVideo, dbAuthor) {
        return {
            id: dbVideo._id,
            title: dbVideo.title,
            author: {
                id: dbAuthor._id,
                name: dbAuthor.firstName + ' ' + dbAuthor.lastName
            },
            banReason: dbVideo.banObject.banReason
        };
    }
};
