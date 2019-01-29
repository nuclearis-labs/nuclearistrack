var contract = undefined;
var customProvider = undefined;
var address = "0x4bC0909246fa116dC4E3Eb485bBAaB71B5Eb944D";
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
  web3.eth.personal.unlockAccount("0x5197bc569ccfc86153b9186c2736343410b81966","0x6b8c10402ef67bf081ee73d3e2b0dce10d27453567bed5c88f7a6a5db8c51f7a",100).then(function(log){console.log("Account unlocked")});
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
