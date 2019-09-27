const web3 = require('web3');
const fs = require('fs');
const Contract = require('./Contract');

const ClientABI = 'build/contracts/Client.json';
const { clientABI } = JSON.parse(fs.readFileSync(ClientABI));

class Client extends Contract {
  constructor(address, wallet, privateKey) {
    super(wallet, privateKey);
    this.instance = this.initiateContract(clientABI, address);
  }

  async getClientDetails() {
    const contrato = await this.instance.methods
      .clientContracts(this.wallet)
      .call();

    this.clientContractAddress = contrato.contractAddress;

    const clientContract = new web3.eth.Contract(
      parsedClient.abi,
      this.clientContractAddress
    );

    const client = await clientContract.methods.contractDetails().call();
    const allClientProjects = client[1];
    this.clientsProjects = [];
    for (let i = 0; i < allClientProjects.length; i += 1) {
      const result = this.contractDetails(allClientProjects[i]);
      this.clientsProjects.push(result);
    }
    this.clientsProjects = await Promise.all(this.clientsProjects);
    return this;
  }
}
module.exports = Client;
