import Web3 from 'web3';

export default new Web3(new Web3.providers.HttpProvider(process.env.WEB3_URL));
