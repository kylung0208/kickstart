const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
    'scheme error need unknown huge recall auction execute depend inhale dad rib', // Account Mnemonic
    'https://rinkeby.infura.io/v3/cf02e5fbd0ee43fc810e53cc3be6391a',
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts(); // one Mnemonic can be used to generate multiple accounts.

    console.log('Attempting to deploy from account', accounts[0])

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)) // ABI
        .deploy({ data: compiledFactory.bytecode })
        .send({ gas: '1000000', from: accounts[0] });

    console.log('Contract deployed to', result.options.address);
};
deploy();
