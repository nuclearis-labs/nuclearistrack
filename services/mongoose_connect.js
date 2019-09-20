const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nrspoe', {
    useNewUrlParser: true
  })
  .catch(() => {
    throw Error('Not able to connect to MongoDB');
  });

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
