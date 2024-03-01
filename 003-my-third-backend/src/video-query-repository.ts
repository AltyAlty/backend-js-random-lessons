export type VideoOutputModel = {
    id: string
    title: string
    author: {
        id: string
        name: string
    }
};

export type BannedVideoOutputModel = {
    id: string
    title: string
    author: {
        id: string
        name: string
    }
    banReason: string
};

type DBVideo = {
    _id: string
    title: string
    authorID: string
    banObject: null | {
        isBanned: boolean
        banReason: string
    }
};

type DBAuthor = {
    _id: string
    firstName: string
    lastName: string
};

export const videoQueryRepository = {
    getVideos(): VideoOutputModel[] {
        const dbVideos: DBVideo[] = [];
        const dbAuthors: DBAuthor[] = [];

        return dbVideos.map(dbVideo => {
            const dbAuthor = dbAuthors.find(a => a._id === dbVideo.authorID);

            return this._mapDBVideoToVideoOutputModel(dbVideo, dbAuthor!);
        });
    },

    getVideoByID(id: string): VideoOutputModel {
        const dbVideo: DBVideo = {
            _id: '12',
            title: 'KELOL',
            authorID: '34',
            banObject: null
        };
        const dbAuthor: DBAuthor = {
            _id: '34',
            firstName: 'POP',
            lastName: 'LO',
        };

        return this._mapDBVideoToVideoOutputModel(dbVideo, dbAuthor);
    },

    getBannedVideos(): BannedVideoOutputModel[] {
        const dbVideos: DBVideo[] = [];
        const dbAuthors: DBAuthor[] = [];

        return dbVideos.map(dbVideo => {
            const dbAuthor = dbAuthors.find(a => a._id === dbVideo.authorID);

            return this._mapDBVideoToBannedVideoOutputModel(dbVideo, dbAuthor!);
        });
    },

    _mapDBVideoToVideoOutputModel(dbVideo: DBVideo, dbAuthor: DBAuthor): VideoOutputModel {
        return {
            id: dbVideo._id,
            title: dbVideo.title,
            author: {
                id: dbAuthor._id,
                name: dbAuthor.firstName + ' ' + dbAuthor.lastName
            }
        };
    },

    _mapDBVideoToBannedVideoOutputModel(dbVideo: DBVideo, dbAuthor: DBAuthor): BannedVideoOutputModel {
        return {
            id: dbVideo._id,
            title: dbVideo.title,
            author: {
                id: dbAuthor._id,
                name: dbAuthor.firstName + ' ' + dbAuthor.lastName
            },
            banReason: dbVideo.banObject!.banReason
        };
    }
};

