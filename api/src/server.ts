require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import indexRouter from './routes/index';
import documentsRouter from './routes/documents';
import proyectoRouter from './routes/proyecto';
import processRouter from './routes/process';
import userRouter from './routes/user';
import transferRouter from './routes/transfer';
import authRouter from './routes/auth';

const server: express.Application = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static(path.resolve(__dirname, '/public')));

server.use('/api/', indexRouter);
server.use('/api/doc', documentsRouter);
server.use('/api/project', proyectoRouter);
server.use('/api/process', processRouter);
server.use('/api/user', userRouter);
server.use('/api/transfer', transferRouter);
server.use('/auth', authRouter);

export default server;
