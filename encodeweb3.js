const Web3 = require('web3');

const web3 = new Web3(Web3.givenProvider || 'https://public-node.testnet.rsk.co:443');

const address = '0xe8b627eda9ce1551d117efc94564fa1450af4a7a';

const index = '0000000000000000000000000000000000000000000000000000000000000000';
const key = 'e162e953b12f72b80ced0ee1e43670ca3b07e810f908f2aa49df72d1199da4d7';
async function getStorage() {
	for (i = 0; i < 10; i++) {
		let result = await web3.eth.getStorageAt(address, i);
		console.log(`[${i}]` + result);
	}
}

//getStorage();

let newKey = web3.utils.soliditySha3(key, { encoding: 'hex' });
web3.eth.getStorageAt(address, newKey).then(console.log).catch((e) => console.error(e));

function increaseHexByOne(hex) {
	let x = web3.utils.toBN(hex);
	let sum = x.add(1);
	let result = '0x' + sum.toString(16);
	return result;
}
