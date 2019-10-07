const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

require('./services/mongoose_connect');
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, '/public')));

app.use('/api/', require('./routes/index'));
app.use('/api/doc', require('./routes/documents'));
app.use('/api/project', require('./routes/proyecto'));
app.use('/api/process', require('./routes/process'));
app.use('/api/user', require('./routes/user'));

app.listen(process.env.PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`Server started working on port ${process.env.PORT}`)
);
