{
require('dotenv').config();    
const express = require('express');
const userRouter = require('./routers/user');
const port = process.env.PORT;
const bodyParser = require('body-parser');
require('./db/db');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})}