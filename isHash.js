const { createHash } = require('crypto');

const documentHash = createHash('sha256')
  .update('0x307eaa91fa219463ac521f9a549dbdc7ff82c06c' + Date.now())
  .digest('hex');
