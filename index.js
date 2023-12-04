import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js';

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

app.listen(4444, (err) => {
    if (err) {
        console.log(err);
    }

    console.log("Server OK");
});