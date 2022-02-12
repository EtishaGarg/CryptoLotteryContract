// deploy code will go here
// hdwallet-provider is a module to connect to some target network and unlock an account for use on that network
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {abi, evm} = require('./compile.js');

const provider = new HDWalletProvider(
    'hero nothing swim day fly lecture mother jaguar more laugh morning vintage', 
    'https://rinkeby.infura.io/v3/966e06e0c83648b0b4bddb517d645f34' //connect to an Infura node
);
const web3 = new Web3(provider);

const deploy = async() => {
    const accounts = await web3.eth.getAccounts(); //Because we could have multiple accounts on our Metamask wallet

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object})
        .send({from: accounts[0], gas:'1000000'});

    console.log(abi);
    console.log('Contract deployed to', result.options.address); //Address of the Smart contract
    provider.engine.stop()
};
deploy();
