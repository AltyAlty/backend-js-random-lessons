/*В этом файле имитируем использование CQR, путем создания query, который общается с UI напрямую, минуя BLL.

Здесь происходит преобразование типов, приходящих от сервера, в типы, которые должны поступить в UI. Эти типы могли бы
использоваться в нашем приложении, если бы была реализована работа с видео.

Output Model - это то же самое, что и View Model.*/

/*Тип для исходящей модели (Output Model) для отправки клиенту видео.*/
export type VideoOutputModel = {
    id: string
    title: string
    author: {
        id: string
        name: string
    }
};

/*Тип для исходящей модели (Output Model) для отправки клиенту заблокированных видео.*/
export type BannedVideoOutputModel = {
    id: string
    title: string
    author: {
        id: string
        name: string
    }
    banReason: string
};

/*Тип видео в БД.*/
type DBVideo = {
    _id: string
    title: string
    authorID: string
    banObject: null | {
        isBanned: boolean
        banReason: string
    }
};

/*Тип авторов в БД.*/
type DBAuthor = {
    _id: string
    firstName: string
    lastName: string
};

/*Создаем выдуманный репозиторий "videoQueryRepository" для работы с видео.*/
export const videoQueryRepository = {
    /*Создаем метод "getVideos()" для получения всех видео в БД.*/
    getVideos(): VideoOutputModel[] {
        /*Получаем видео из БД.*/
        const dbVideos: DBVideo[] = [];
        /*Получаем авторов из БД.*/
        const dbAuthors: DBAuthor[] = [];

        /*Перебираем все видео, чтобы собрать массив этих заблокированных видео с преобразованием их типа в
        "VideoOutputModel".*/
        return dbVideos.map(dbVideo => {
            /*Находим автора какого-то видео.*/
            const dbAuthor = dbAuthors.find(a => a._id === dbVideo.authorID);
            /*Преобразовываем тип видео в тип "VideoOutputModel".*/
            return this._mapDBVideoToVideoOutputModel(dbVideo, dbAuthor!);
        });
    },

    /*Создаем метод "getVideoByID()" для поиска видео по ID в БД.*/
    getVideoByID(id: string): VideoOutputModel {
        /*Находим видео по ID.*/
        const dbVideo: DBVideo = {
            _id: '12',
            title: 'KEK',
            authorID: '34',
            banObject: null
        };

        /*Находим автора найденного по ID видео.*/
        const dbAuthor: DBAuthor = {
            _id: '34',
            firstName: 'POP',
            lastName: 'LO',
        };

        /*Преобразовываем тип видео в тип "VideoOutputModel".*/
        return this._mapDBVideoToVideoOutputModel(dbVideo, dbAuthor);
    },

    /*Создаем метод "getBannedVideos()" для получения всех заблокированных видео в БД.*/
    getBannedVideos(): BannedVideoOutputModel[] {
        /*Получаем заблокированные видео из БД.*/
        const dbVideos: DBVideo[] = [];
        /*Получаем авторов из БД.*/
        const dbAuthors: DBAuthor[] = [];

        /*Перебираем все заблокированные видео, чтобы собрать массив этих заблокированных видео с преобразованием их
        типа в "BannedVideoOutputModel".*/
        return dbVideos.map(dbVideo => {
            /*Находим автора какого-то заблокированного видео.*/
            const dbAuthor = dbAuthors.find(a => a._id === dbVideo.authorID);
            /*Преобразовываем тип заблокированного видео в тип "BannedVideoOutputModel".*/
            return this._mapDBVideoToBannedVideoOutputModel(dbVideo, dbAuthor!);
        });
    },

    /*Создаем метод "_mapDBVideoToVideoOutputModel()" для преобразования типа видео в тип "VideoOutputModel".*/
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

    /*Создаем метод "_mapDBVideoToVideoOutputModel()" для преобразования типа заблокированных видео в тип
    "BannedVideoOutputModel".*/
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