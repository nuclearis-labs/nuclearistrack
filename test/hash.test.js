const Blockchain = require('../classes/Blockchain');

const Block = new Blockchain({
  wallet: '0xF691198C305eaDc10c2954202eA6b0BB38A76B43',
  private: 'b79493c56182cffcb710c1e084be41b2c076a59fdff37ffa540e720f28f7e26f'
});

const string = Buffer.from('hello');
const desiredHashOutput = {
  fileHash: '0x2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
};
describe('Hash Functions', () => {
  test('Should return a valid SHA256 Hash with Hex Prefix', () => {
    expect(Block.createHash({ buffer: string })).toMatchObject(
      desiredHashOutput
    );
  });

  test('Should return hash from Blockchain Prototype', () => {
    expect(Block.getHash).toBe(
      '0x2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
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
