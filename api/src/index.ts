import server from './server';
require('./config/mongoose_connect');

server
  .listen(process.env.PORT, () =>
    // eslint-disable-next-line no-console
    console.log(`Server started working on port ${process.env.PORT}`)
  )
  .on('error', e => {
    console.error(`Server connection errored out`, e.message);
  });
