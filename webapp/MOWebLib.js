var contract = undefined;
var customProvider = undefined;
var address = "0x5C83dd6941A707E460f3887a8D1fca880ffE4E29";
var account = "0xccfde609e29d6a8d5a1ce5b518d131d5e2254cb4";
var privatekey = "0x066407055f594cfc05938e8edcf6930362c39b0bd3900e40b2df76c18fdf4178";
var abi = undefined;

function mo_init () {
  // Check if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use existing gateway
    //window.web3 = new Web3(web3.currentProvider);

    let provider = new Web3.providers.HttpProvider("http://3.17.167.226:8545");
    web3 = new Web3(provider);
  } else {
   alert("No Ethereum interface injected into browser. Read-only access");
  }

  abi = [
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
          "name": "hash",
          "type": "bytes32"
        }
      ],
      "name": "addDocHash",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "hash",
          "type": "bytes32"
        }
      ],
      "name": "findDocHash",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

  contract = new web3.eth.Contract(abi, address);
  web3.eth.personal.unlockAccount(account,privatekey,100).then(function(log){console.log("Account unlocked")});
  web3.eth.getAccounts(function (error, accounts) {
  $("#account").html(accounts[0]);
    web3.eth.getBalance(accounts[0]).then(
      function(ether){
        let url = "https://api.coinmarketcap.com/v1/ticker/ethereum/";
        fetch(url)
        .then(function(response) {
        return response.json();
        })
        .then(function(data) {
        let eth1 = JSON.stringify(data[0]);
        let eth2 = JSON.parse(eth1);
        $("#ether").html(" con " + Math.round((ether/10**18)*100)/100 + " ETH / " + Math.round((ether/10**18 * eth2.price_usd)*100)/100 + " USD")})
        })
  })
};

//sends a hash to the blockchain
function MO_send(hash, callback) {
    web3.eth.getAccounts(function (error, accounts) {
      contract.methods.addDocHash(hash).send({
        from: accounts[0]
      },function(error, tx) {
        if (error) callback(error, null);
        else callback(null, tx);
      });

      web3.eth.getAccounts(function (error, accounts) {

      let url = "https://api.coinmarketcap.com/v1/ticker/ethereum/";
      fetch(url)
      .then(function(response) {
      return response.json();
      })
      .then(function(data) {
      let eth1 = JSON.stringify(data[0]);
      let eth2 = JSON.parse(eth1);
      web3.eth.getBalance(accounts[0]).then(function(ether){$("#ether").html(" con " + Math.round((ether/10**18)*100)/100 + " ETH / " + Math.round((ether/10**18 * eth2.price_usd)*100)/100 + " USD")});
      })
      })
    });
};

//looks up a hash on the blockchain
function MO_find (hash, callback) {
  contract.methods.findDocHash(hash).call( function (error, result) {
    if (error) callback(error, null);
    else {
      let resultObj = {
        mineTime:  new Date(result[0] * 1000),
        blockNumber: result[1]
      }
      callback(null, resultObj);
    }
  });
};
