const Web3 = require('web3');
const fs = require('fs');

const web3 = new Web3('http://localhost:8545');
const contract = require('./build/contracts/NuclearPoE.json');
const contractInstance = new web3.eth.Contract(contract.abi);

deployContract()
  .then(result => modifyEnv(result._address))
  .catch(e => console.error(e));

async function deployContract() {
  const accounts = await web3.eth.getAccounts();
  return await contractInstance
    .deploy({ data: contract.bytecode })
    .send({ from: accounts[0], gas: '6800000', gasPrice: '65164000' });
}

function modifyEnv(contractAddress) {
  const env = fs.readFileSync('./.env', 'utf8');
  const envListing = env.split('\n');

  for (let i = 0; i < envListing.length; i++) {
    if (envListing[i].indexOf('SCADDRESS') !== -1) {
      envListing[i] = `SCADDRESS=${contractAddress}`;
    }
  }

  fs.writeFileSync('./.env', envListing.join('\n'));
}
