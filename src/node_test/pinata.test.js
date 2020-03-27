const { getFromIPFS } = require('../config/ipfs.ts');

test('Should download file from IPFS', done => {
  getFromIPFS('QmVPzACL6RmXehgmRBgHLJ3ptPGR9ZjMpoaWJPFeNsbpv3')
    .then(() => done())
    .catch(e => console.error(e));
});
