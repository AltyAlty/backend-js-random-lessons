import {usersRepository} from '../../repositories/users-repository-db';

export const authService = {
    /*Подтверждение почты пользователя на BLL уровне.*/
    async confirmEmail(email: string, code: string): Promise<boolean> {
        let user = await usersRepository.findByLoginOrEmail(email);
        if (
            !user ||
            user.emailConfirmation.isConfirmed ||
            user.emailConfirmation.confirmationCode !== code ||
            user.emailConfirmation.expirationDate < new Date()
        ) {
            return false;
        }

        return await usersRepository.updateConfirmation(user._id);
    },
};