var contract = undefined;
var address = '0x7af24F98a3Ad5c651eA7925482dE8e0f910c965f';
var account = '0x211d5c2fb17ee2b9c412aec36f4a4ca274bb131f';
var privatekey = '0xc90cd5b4d4505251df8f9af943708ced3ec9d1a9cd79dfe29219830c49682b97';
var abi = undefined;

function mo_init(account, privatekey) {
	// Chequear si el objeto web3 fue definido en caso contrario definir web3 desde un HttpProvider
	if (typeof web3 !== 'undefined') {
		web3 = new Web3('127.0.0.1:8545');
	} else {
		alert('No Ethereum interface injected into browser. Read-only access');
	}

	var abi = [
		{
		  "inputs": [],
		  "payable": false,
		  "stateMutability": "nonpayable",
		  "type": "constructor",
		  "signature": "constructor"
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
		  "type": "function",
		  "signature": "0x133a48f3"
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
		  "type": "function",
		  "signature": "0x4cf00d3f"
		}
	  ];

	contract = new web3.eth.Contract(abi, address);
	//Funciona o no funciona dependiendo si tiene que desbloquear una cuenta o no..
	//web3.eth.personal.unlockAccount(account,privatekey,100).then(function(log){console.log("Account unlocked")});
	web3.eth.getAccounts(function (error, accounts) {
		$('#account').html(accounts[0]);
		web3.eth.getBalance(accounts[0]).then(function (ether) {
			let url = 'https://api.coinmarketcap.com/v1/ticker/ethereum/';
			fetch(url)
				.then(function (response) {
					return response.json();
				})
				.then(function (data) {
					let eth1 = JSON.stringify(data[0]);
					let eth2 = JSON.parse(eth1);
					$('#ether').html(
						' con ' +
						Math.round(ether / 10 ** 18 * 100) / 100 +
						' ETH / ' +
						Math.round(ether / 10 ** 18 * eth2.price_usd * 100) / 100 +
						' USD'
					);
				});
		});
	});
}

function MO_send(hash, callback) {
	web3.eth.getAccounts(function (error, accounts) {
		contract.methods
			.addDocHash(hash)
			.send({ from: accounts[0] })
			.on('transactionHash', (tx) => { })
			.on('receipt', (receipt) => {
				callback(null, receipt);
			})
			.on('confirmation', (confirmationNumber, receipt) => { })
			.on('error', console.error);
	});
}

//looks up a hash on the blockchain
function MO_find(hash, callback) {
	contract.methods.findDocHash(hash).call(function (error, result) {
		if (error) callback(error, null);
		else {
			let resultObj = {
				mineTime: new Date(result[0] * 1000),
				blockNumber: result[1]
			};
			callback(null, resultObj);
		}
	});
}
