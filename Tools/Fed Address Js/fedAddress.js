var Web3 = require('web3');

var web3 = new Web3("https://public-node.testnet.rsk.co");


var abi = [{ "name": "getFederationAddress", "type": "function", "constant": true, "inputs": [], "outputs": [{ "name": "", "type": "string" }] }];
var address = "0x0000000000000000000000000000000001000006";

var FedContract = new web3.eth.Contract(abi, address);

FedContract.methods.getFederationAddress().call().then(function(result){
    return console.log(result);
});