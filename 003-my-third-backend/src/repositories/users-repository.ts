import {ObjectId} from 'mongodb';
import {UserDBType} from '../types';
import {usersCollection} from '../db/db';

export const usersRepository = {
    /*Поиск всех пользователей на DAL уровне.*/
    async getAllusers(): Promise<UserDBType[]> {
        return usersCollection
            .find()
            .sort('createdAt', -1)
            .toArray();
    },

    /*Создание нового пользователя на DAL уровне.*/
    async createUser(user: UserDBType): Promise<UserDBType> {
        const result = await usersCollection.insertOne(user);
        console.log('DAL' + result);
        return user;
    },

    /*Поиск пользователя по ID на DAL уровне.*/
    async findUserByID(id: ObjectId): Promise<UserDBType | null> {
        let user = await usersCollection.findOne({_id: id});

        if (user) {
            return user
        } else {
            return null
        }
    },

    /*Поиск пользователя по логину или почте на DAL уровне.*/
    async findByLoginOrEmail(loginOrEmail: string) {
        const user = await usersCollection.findOne({$or: [{email: loginOrEmail}, {userName: loginOrEmail}]});
        return user;
    }
};