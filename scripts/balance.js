const getBalance = async (args) => {
  const accounts = await web3.eth.getAccounts();

  console.log(await web3.eth.getBalance(accounts[0]));
};

getBalance();
