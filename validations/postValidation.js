import { body } from 'express-validator';

export const postCreateValidation = [
    body('title', 'Enter title for post').isLength({ min: 3 }).isString(),
    body('text', 'Enter text for post').isLength({ min: 3 }).isString(),
    body('tags', 'Wrong format of tags(enter an array)').optional().isString(),
    body('avatarUrl', 'Wrong link to the avatar').optional().isURL(),
];