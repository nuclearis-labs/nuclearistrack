//Pruebas de funcionamiento usando Web3 para obtener información de la Blockchain..
var Web3 = require("web3");

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
 } else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:4444"));
 }

web3.eth.getCoinbase(function(err, account) {
  if (err === null) {
    web3.account = account;
    $("#accountAddress").html("Your Account: " + account);
  }
});