/* 
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

*/
