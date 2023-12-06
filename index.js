import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import * as postValidation from './validations/postValidation.js';

import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

//try to connect to database
mongoose.connect(
    `mongodb+srv://admin:${process.env.passwordForDB}@cluster0.sf13egn.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => console.log('DB Ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello, world!");
});

//route to login 
app.post('/auth/login', UserController.login);

//route to register new user
app.post('/auth/register', registerValidation, UserController.register);

//route to get info about user
app.get('/auth/me', checkAuth, UserController.getMe);

//reote to get all posts
app.get('/posts', PostController.getAll);

//rote to get post by id
app.get('/posts/:id', PostController.getOne);

//route to create new post
app.post('/posts', checkAuth, postValidation.postCreateValidation, PostController.create);

app.listen(4444, (err) => {
    if (err) {
        console.log(err);
    }

    console.log("Server OK");
});