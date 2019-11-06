const mongoose = require('mongoose');
const logger = require('../services/winston');

const db = process.env.MONGODB_URI || 'mongodb://localhost:27017/nrspoe';

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    logger.info(`Connected to database ${db}`);
  })
  .catch(e => {
    logger.error(`Couldn't connect to database `, {
      name: e.name,
      message: e.message
    });
  });

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
