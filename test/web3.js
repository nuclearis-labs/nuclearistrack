/* eslint-disable no-undef */
const NPoE = artifacts.require('contracts/NuclearPoE.sol');
const web3 = require('web3');

const expediente = '41955';
const projectTitle = 'Conjunto Soporte';
const clientName = 'NA-SA';

contract('NuclearPoE', accounts => {
  it('Should approva a new project to the contract', () => {
    NPoE.deployed()
      .then(i => {
        app = i;
      })
      .then(app =>
        app.createNewProject('41955').then(result => {
          assert.equal(result, 'Hello', 'Message');
        })
      );
  });
});
