import express from 'express';
import userRoutes from './routes/user.routes';
import likeRoutes from './routes/like.routes';
import bodyParser from 'body-parser';

export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user-api', userRoutes);
app.use('/like-api', likeRoutes);
