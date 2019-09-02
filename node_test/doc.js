const fs = require('fs');
const Blockchain = require('../classes/Blockchain');

const file = {
  buffer: fs.readFileSync('./test/test.pdf'),
  originalname: 'test.pdf'
};

const Block = new Blockchain({
  wallet: '0xF691198C305eaDc10c2954202eA6b0BB38A76B43',
  private: 'b79493c56182cffcb710c1e084be41b2c076a59fdff37ffa540e720f28f7e26f'
});

Block.createHash(file).findBlock(
  '41955',
  '0x183A598706A5F0cFE239686759a1135158cBC69A'
);
