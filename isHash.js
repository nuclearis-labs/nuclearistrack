/* const bip38 = require('bip38');
const AssertionError = require('assert').AssertionError;

try {
  bip38.decrypt(
    '6PRVWUbkzzsbcVac2qwfssoUJAN1Xhrg6bNk8J7Nzm5H7kxEbn2Nh2ZoGg',
    'TestingOneTwoThre'
  );
} catch (e) {
  if (e instanceof AssertionError) {
    console.log('Hashes not equal');
  }
}


const pdf = require('./functions/pdf');

const fs = require('fs');

const buffer = fs.readFileSync('cert.pdf');

pdf
  .addDocNumber({ buffer, docNumber: 'B-001' })
  .then(result => console.log(result))
  .catch(e => console.error(e));
 */
