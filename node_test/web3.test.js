const fs = require('fs');
const Blockchain = require('../classes/Blockchain');

const Block = new Blockchain({
  wallet: '0x7bBd83b988479F8eC82756f58e9ea8B54De103e4',
  private: 'b6679ffaf50f7a4332855238fe0fae5fa19dd8afc7d90eb63decba74c21bed59'
});

const file = {
  buffer: fs.readFileSync('./test/test.pdf'),
  originalname: 'test.pdf'
};

const desiredHashOutput = {
  fileHash: '0x35e8c8851f448e6faf58ef7232f42ffd2504edecee824ecdccaf9496d338a60d'
};
describe('Hash Functions', () => {
  test('Should return a valid SHA256 Hash with Hex Prefix', () => {
    expect(Block.createHash(file)).toMatchObject(desiredHashOutput);
  });
  test('Should return created Hash from Blockchain Instance', () => {
    expect(Block.getHash).toBe(
      '0x35e8c8851f448e6faf58ef7232f42ffd2504edecee824ecdccaf9496d338a60d'
    );
  });
});

describe('Project Functions', () => {
  test('Should add a new Project to the Smart Contract', () => {
    expect(
      Block.addProject(
        41955,
        'Test',
        '0x939Ebe25C99B87a7c1284cDC45Fa7e865c0d73e0',
        'NASA'
      )
    ).toBeTruthy();
  });

  test('Project title should be string', () => {
    expect(
      Block.addProject(
        41955,
        1337,
        '0x939Ebe25C99B87a7c1284cDC45Fa7e865c0d73e0',
        'NASA'
      )
    ).rejects.toEqual(TypeError(`Project Title is not a string`));
  });

  test('Project expediente should be number', () => {
    expect(
      Block.addProject(
        '41955',
        1337,
        '0x939Ebe25C99B87a7c1284cDC45Fa7e865c0d73e0',
        'NASA'
      )
    ).rejects.toEqual(TypeError(`Expediente is not a number`));
  });

  test('Client Name should be string', () => {
    expect(
      Block.addProject(
        41955,
        'Anillos',
        '0x939Ebe25C99B87a7c1284cDC45Fa7e865c0d73e0',
        123
      )
    ).rejects.toEqual(TypeError(`Client Name is not a string`));
  });
});

describe('Check approve project', () => {
  test('Project expediente should be number', () => {
    expect(Block.approveProject('41955')).rejects.toEqual(
      TypeError(`Expediente is not a number`)
    );
  });
});

describe('Retrieve documents', () => {
  test('Should throw an error when document does not exist', () => {
    expect(
      Block.findBlock('41955', '0x183A598706A5F0cFE239686759a1135158cBC69A')
    ).rejects.toEqual(
      Error(
        'Returned error: VM Exception while processing transaction: revert Document does not exist'
      )
    );
  });
  test('Should receive an object when document exists', () => {
    expect(
      Block.findBlock('41955', '0x183A598706A5F0cFE239686759a1135158cBC69A')
    ).toBeObject();
  });
});

describe('Add documents', () => {
  test('Should add a document to the Smart Contract', () => {
    Block.createHash(file);
    expect(
      Block.addDocHash(
        '41955',
        'Titulo',
        'QmTkzDwWqPbnAh5YiV5VwcTLnGdwSNsNTn2aDxdXBFca7D'
      )
    ).rejects.toEqual(Error('Document does not exist'));
  });
});

describe('Add Process', () => {
  test('Project expediente should be number', () => {
    expect(
      Block.addProcess(
        '41955',
        '0x939Ebe25C99B87a7c1284cDC45Fa7e865c0d73e0',
        'Mecanizado',
        'BGH'
      )
    ).rejects.toEqual(TypeError(`Expediente is not a number`));
  });
  test('Title of process should be string', () => {
    expect(
      Block.addProcess(
        41955,
        '0x939Ebe25C99B87a7c1284cDC45Fa7e865c0d73e0',
        456,
        'BGH'
      )
    ).rejects.toEqual(TypeError(`Title of Process is not a string`));
  });
  test('Name of supplier should be string', () => {
    expect(
      Block.addProcess(
        41955,
        '0x939Ebe25C99B87a7c1284cDC45Fa7e865c0d73e0',
        'Mecanizado',
        123
      )
    ).rejects.toEqual(TypeError(`Name of supplier is not a string`));
  });
});
