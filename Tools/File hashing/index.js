var Web3 = require('web3');

const express = require('express');
const app = new express();

app.get('/', function(request, response){
  response.sendfile('index.html');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))

/*
const server = http.createServer((req, res) => {

    if (req.url === '/favicon.ico')
    {
        res.end;
    }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  
  /*

  res.write('hola\n');

  var web3 = new Web3();
  web3.setProvider(new Web3.providers.HttpProvider());

console.log(1)

    var contractAbi = [
        {
          "inputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_addr",
              "type": "address"
            }
          ],
          "name": "addAddressToWhitelist",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_addr",
              "type": "address"
            }
          ],
          "name": "removeAddressFromWhitelist",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_addr",
              "type": "address"
            }
          ],
          "name": "isInWhitelist",
          "outputs": [
            {
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_hash",
              "type": "string"
            }
          ],
          "name": "setDocumentHash",
          "outputs": [
            {
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "getDocumentHash",
          "outputs": [
            {
              "name": "",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        }
      ];
    var contractAddress = '0xC1A33765AB5116AD016f0500E1250BC7AEA5378b';

    const contract = new web3.eth.Contract(contractAbi,contractAddress);

    /*
    contract.methods.getDocumentHash().call(function(err,result){
        console.log('error: ' + err);
        console.log('result: ' + result);
    });
    */
    
    /*
    contract.methods.setDocumentHash("bla").send({from:'0x1ed78Fc78BA8E32C4F6633F13DD37E99CF4D8AE8'},function(err,result){
        console.log('error: ' + err);
        console.log('result set: ' + result);
    });

    
    contract.methods.getDocumentHash().call(function(err,result){
        console.log('error: ' + err);
        console.log('result get: ' + result);
    });

});

*/