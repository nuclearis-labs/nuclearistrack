async function main() {
  const {
    abi,
    bytecode,
  } = require('../src/contracts/artifacts/NuclearPoE.json');

  const accounts = await web3.eth.getAccounts();

  const NuclearPoE = new web3.eth.Contract(abi);

  const contract = await NuclearPoE.deploy({
    data: bytecode,
    arguments: ['NRS-ADMIN'],
  })
    .send({
      from: accounts[0],
      gas: '8000000',
      gasPrice: '1',
      value: '0',
    })
    .on('transactionHash', console.log)
    .on('receipt', console.log);

  console.log(contract);

  console.log('NuclearPoE deployed to:', contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
