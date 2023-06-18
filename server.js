const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config()

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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
app.use(express.json());

// Use the router
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const userRouter = require('./routes/user');
app.use('/api/user', userRouter);


// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});