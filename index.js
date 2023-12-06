import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import * as postValidation from './validations/postValidation.js';

import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

//try to connect to database
mongoose.connect(
    `mongodb+srv://admin:${process.env.passwordForDB}@cluster0.sf13egn.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => console.log('DB Ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send("Hello, world!");
});

//route to upload image
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

//route to login 
app.post('/auth/login', handleValidationErrors, UserController.login);

//route to register new user
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

//route to get info about user
app.get('/auth/me', checkAuth, UserController.getMe);

//reote to get all posts
app.get('/posts', PostController.getAll);

//rote to get post by id
app.get('/posts/:id', PostController.getOne);

//route to delete post by id
app.delete('/posts/:id', checkAuth, PostController.remove);

//route to create new post
app.post('/posts', checkAuth, postValidation.postCreateValidation, PostController.create);

//route to update post 
app.patch('/posts/:id', checkAuth, PostController.update);

app.listen(4444, (err) => {
    if (err) {
        console.log(err);
    }

    console.log("Server OK");
});