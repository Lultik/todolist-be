require('dotenv').config({path: __dirname + '/.env'});

import express from 'express'
const cors = require('cors');
const morgan = require('morgan');

import mongoose from 'mongoose'
import { router } from './routes/todos.routes';

const app = express();

const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(morgan('tiny'))
app.use(express.json());
app.use('/todos', router)

mongoose.connect(process.env.MONGO_STRING || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
});
