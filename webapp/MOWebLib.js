var contract = undefined;
var customProvider = undefined;
var address = "0xb428C218306DCa08ab56584b892dbbE7cE77E1F8";
var abi = undefined;

function mo_init () {
  // Check if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use existing gateway
    //window.web3 = new Web3(web3.currentProvider);

    let provider = new Web3.providers.HttpProvider("http://localhost:8545");
    web3 = new Web3(provider);

    console.log("Web3 connected");
  } else {
   //alert("No Ethereum interface injected into browser. Read-only access");
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
  web3.eth.personal.unlockAccount("0xf86c0968ef297d672380e0780f18f91f46847b10","0xe8285f1ac3d6aae2040cac1efcbe022c51fc47c863ad0c9f7de3fc0b916db3fb",100).then(function(log){console.log("Account unlocked")});
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
