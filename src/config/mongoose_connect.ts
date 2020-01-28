import mongoose from 'mongoose';
import logger from '../config/winston';

const db = 'mongodb://127.0.0.1:27017/nrspoe';

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
