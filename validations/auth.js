import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Wrong format of email').isEmail(),
    body('password', 'Minimal length of password: 5 symbols').isLength({ min: 5 }),
    body('fullName', 'Minimal length of full name: 3 symbols').isLength({ min: 3 }),
    body('avatarUrl', 'Wrong link to the avatar').optional().isURL(),
];