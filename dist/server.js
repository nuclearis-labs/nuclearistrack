"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
// import morgan from 'morgan';
const winston_1 = __importDefault(require("./config/winston"));
const app = express_1.default();
require('./config/mongoose_connect');
require('dotenv').config();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.resolve(__dirname, '/public')));
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
winston_1.default.info(`Server started working on port ${process.env.PORT}`))
    .on('error', e => {
    winston_1.default.error(`Server connection errored out`, e.message);
});
//# sourceMappingURL=server.js.map