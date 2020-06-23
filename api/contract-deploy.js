require('dotenv').config();
const Web3 = require('web3');
const fs = require('fs');

const web3 = new Web3(process.env.WEB3_URL);
const NuclearPoE = require('./build/contracts/NuclearPoE.json');
const RoleBased = require('./build/contracts/RoleBasedAcl.json');
const nuclearpoeInstance = new web3.eth.Contract(NuclearPoE.abi);
const rolebasedInstance = new web3.eth.Contract(RoleBased.abi);

deployContract()
  .then(() => console.log('done'))
  .catch(e => console.error(e));

async function deployContract() {
  const accounts = await web3.eth.getAccounts();

  const deployedRoles = await rolebasedInstance
    .deploy({ data: RoleBased.bytecode })
    .send({
      from: accounts[0],
      gas: '6800000',
      gasPrice: '65164000'
    });
  modifyEnv('SCADDRESS', deployedRoles._address);
  const deployedPoE = await nuclearpoeInstance
    .deploy({ data: NuclearPoE.bytecode, arguments: [deployedRoles._address] })
    .send({
      from: accounts[0],
      gas: '6800000',
      gasPrice: '65164000'
    });
  modifyEnv('ROLEADDRESS', deployedPoE._address);
}

function modifyEnv(param, contractAddress) {
  const env = fs.readFileSync('./.env', 'utf8');
  const envListing = env.split('\n');

  for (let i = 0; i < envListing.length; i++) {
    if (envListing[i].indexOf(param) !== -1) {
      envListing[i] = `${param}=${contractAddress}`;
    }
  }

  fs.writeFileSync('./.env', envListing.join('\n'));
}
