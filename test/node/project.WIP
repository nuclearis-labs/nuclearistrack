const Blockchain = require('../classes/Blockchain.js');

let Block;
beforeEach(() => {
  Block = new Blockchain(
    '0x59484aA6E2C33B96E541CfC6Ce0d59c18f7b7Bb1',
    '5505b823d38d0ef390536d37d57ede90805d46aec8d9e13aa8e7937f372f345f'
  );
  Block.createNewNuclearPoE();
  return Block;
});
afterEach(() => {
  Block = undefined;
  return Block;
});

test('Should add a new Project to the Smart Contract', () => {
  expect(
    Block.addProject(
      41955,
      'Test',
      '0xB7608e4bA907D2E6A412b0A8d157d49cB4594EDf',
      'NA-SA'
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

/* test('Project expediente should be number', () => {
  const result = await Block.addProject(
    41955,
    'Test',
    '0xB7608e4bA907D2E6A412b0A8d157d49cB4594EDf',
    'NA-SA'
  );
  
  expect(result).toBeTruthy();
}); */
