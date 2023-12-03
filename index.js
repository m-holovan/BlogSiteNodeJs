import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js';
import { validationResult } from 'express-validator';
import UserModel from './models/User.js';

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
app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: 'Wrong login or password',
            });
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPassword) {
            return res.status(403).json({
                message: 'Wrong login or password',
            });
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'secret',
            {
                expiresIn: '30d',
            },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to login',
        });
    }
});

//route to register new user
app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return req.status(400).json(errors.array());
        }

        //encrypt the password
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        //get data from user 
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        //save user in database
        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        }, 'secret',
            {
                expiresIn: '30d',
            },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to register',
        });
    }
});

app.listen(4444, (err) => {
    if (err) {
        console.log(err);
    }

    console.log("Server OK");
});