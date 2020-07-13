import Web3 from 'web3';
import { getBalance } from '../utils/web3Helpers';

describe('Check web3 helper functions', () => {
  let web3;
  beforeAll(() => {
    web3 = new Web3('https://public-node.testnet.rsk.co');
  });
  it('Should get balance from user and convert to Ether', async () => {
    expect(
      await getBalance(web3, '0x307EAa91FA219463Ac521f9A549dBDc7fF82C06c')
    ).toBeTruthy();
  });
});
