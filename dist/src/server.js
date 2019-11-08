import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
// import morgan from 'morgan';
import logger from './config/winston';
const app = express();
require('./services/mongoose_connect');
require('dotenv').config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, '/public')));
// app.use(morgan('common'));
app.use('/api/', require('./routes/index'));
app.use('/api/doc', require('./routes/documents'));
app.use('/api/project', require('./routes/proyecto'));
app.use('/api/process', require('./routes/process'));
app.use('/api/user', require('./routes/user'));
app.use('/api/transfer', require('./routes/transfer'));
app.use('/auth', require('./routes/auth'));
app
    .listen(process.env.PORT, () => 
// eslint-disable-next-line no-console
logger.info(`Server started working on port ${process.env.PORT}`))
    .on('error', e => {
    logger.error(`Server connection errored out`, e.message);
});
//# sourceMappingURL=server.js.map