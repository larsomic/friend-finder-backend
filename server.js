import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import { connect } from 'mongoose';
connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

const app = express()
app.use(cookieParser());

const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

const port = process.env.SERVER_PORT || 5000;
app.use(json());

// Use the router
import authRouter from './routes/auth.js';
app.use('/api/auth', authRouter);

import userRouter from './routes/user.js';
app.use('/api/user', userRouter);

import shortlistRouter from './routes/shortlist.js';
app.use('/api/shortlist', shortlistRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});