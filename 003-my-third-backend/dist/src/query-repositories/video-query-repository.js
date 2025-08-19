"use strict";
/*В этом файле имитируем использование CQR, путем создания query, который общается с UI напрямую, минуя BLL.

Здесь происходит преобразование типов, приходящих от сервера, в типы, которые должны поступить в UI. Эти типы могли бы
использоваться в нашем приложении, если бы была реализована работа с видео.

Output Model - это то же самое, что и View Model.*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoQueryRepository = void 0;
/*Создаем выдуманный репозиторий "videoQueryRepository" для работы с видео.*/
exports.videoQueryRepository = {
    /*Создаем метод "getVideos()" для получения всех видео в БД.*/
    getVideos() {
        /*Получаем видео из БД.*/
        const dbVideos = [];
        /*Получаем авторов из БД.*/
        const dbAuthors = [];
        /*Перебираем все видео, чтобы собрать массив этих заблокированных видео с преобразованием их типа в
        "VideoOutputModel".*/
        return dbVideos.map(dbVideo => {
            /*Находим автора какого-то видео.*/
            const dbAuthor = dbAuthors.find(a => a._id === dbVideo.authorID);
            /*Преобразовываем тип видео в тип "VideoOutputModel".*/
            return this._mapDBVideoToVideoOutputModel(dbVideo, dbAuthor);
        });
    },
    /*Создаем метод "getVideoByID()" для поиска видео по ID в БД.*/
    getVideoByID(id) {
        /*Находим видео по ID.*/
        const dbVideo = {
            _id: '12',
            title: 'KEK',
            authorID: '34',
            banObject: null
        };
        /*Находим автора найденного по ID видео.*/
        const dbAuthor = {
            _id: '34',
            firstName: 'POP',
            lastName: 'LO',
        };
        /*Преобразовываем тип видео в тип "VideoOutputModel".*/
        return this._mapDBVideoToVideoOutputModel(dbVideo, dbAuthor);
    },
    /*Создаем метод "getBannedVideos()" для получения всех заблокированных видео в БД.*/
    getBannedVideos() {
        /*Получаем заблокированные видео из БД.*/
        const dbVideos = [];
        /*Получаем авторов из БД.*/
        const dbAuthors = [];
        /*Перебираем все заблокированные видео, чтобы собрать массив этих заблокированных видео с преобразованием их
        типа в "BannedVideoOutputModel".*/
        return dbVideos.map(dbVideo => {
            /*Находим автора какого-то заблокированного видео.*/
            const dbAuthor = dbAuthors.find(a => a._id === dbVideo.authorID);
            /*Преобразовываем тип заблокированного видео в тип "BannedVideoOutputModel".*/
            return this._mapDBVideoToBannedVideoOutputModel(dbVideo, dbAuthor);
        });
    },
    /*Создаем метод "_mapDBVideoToVideoOutputModel()" для преобразования типа видео в тип "VideoOutputModel".*/
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
    /*Создаем метод "_mapDBVideoToVideoOutputModel()" для преобразования типа заблокированных видео в тип
    "BannedVideoOutputModel".*/
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
