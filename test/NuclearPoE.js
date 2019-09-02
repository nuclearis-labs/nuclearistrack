const NuclearPoE = artifacts.require('./contracts/NuclearPoE.sol');

contract('NuclearPoE', accounts => {
  let instance;
  beforeEach(async () => {
    instance = await NuclearPoE.new();
  });
  it('Should create a new project', async () => {
    let tx = await instance.createNewProject(
      41955,
      web3.utils.fromAscii('Conjunto Soporte'),
      accounts[1],
      web3.utils.fromAscii('NA-SA')
    );
    assert.isOk(tx, 'Response should be true');
  });
});
