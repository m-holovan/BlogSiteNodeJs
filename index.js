import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello, world!");
});

app.listen(4444, (err) => {
    if (err) {
        console.log(err);
    }

    console.log("Server OK");
});