const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

require('./services/mongoose_connect');
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, '/public')));

app.use('/', require('./routes/index'));
app.use('/doc', require('./routes/documents'));
app.use('/project', require('./routes/proyecto'));
app.use('/process', require('./routes/process'));
app.use('/user', require('./routes/user'));
app.use('/client', require('./routes/client'));

app.listen(process.env.PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`Server started working on port ${process.env.PORT}`)
);
