// contract test code will go here
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); //Portal to the ethereum world
const web3 = new Web3(ganache.provider()); // Will change based on the Ethereum network we want to connect to. Always have to specify a provider to web3
const {abi, evm} = require('../compile.js'); //abi is the ABI & evm is the bytecode or compiled contract

let accounts;
let inbox;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();


    lottery = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object})
        .send({from: accounts[0], gas: '1000000'})
});

describe('Lottery', () => {
    it('deploys a contract', () =>{
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter', async () =>{
        await lottery.methods.enter().send({
            from: accounts[0], 
            value: web3.utils.toWei('0.02','ether')});
        const players = await lottery.methods.getPlayers().call();
        assert.equal(accounts[0],players[0]);
        assert.equal(1,players.length);
    })

    it('allows multiple accounts to enter', async () =>{
        await lottery.methods.enter().send({
            from: accounts[0], 
            value: web3.utils.toWei('0.02','ether')});

        await lottery.methods.enter().send({
            from: accounts[1], 
            value: web3.utils.toWei('0.02','ether')});

        await lottery.methods.enter().send({
            from: accounts[2], 
            value: web3.utils.toWei('0.02','ether')});

        const players = await lottery.methods.getPlayers().call();

        assert.equal(accounts[0],players[0]);
        assert.equal(accounts[1],players[1]);
        assert.equal(accounts[2],players[2]);
        assert.equal(3, players.length);
    })

    it('required a minimum amount of ether to enter', async () =>{
        try{
        await lottery.methods.enter().send({
            from : accounts[0],
            value : 200
        });
        assert(false);
        } catch(err){
            assert(err);
        }
    });

    it('allows only manager to pick winner', async () =>{
        try{
            await lottery.methods.pickWinner().send({
                from: account[1]
            });
            assert(false);
        }catch(err){
            assert(err);
        }
    });

    it('sends money to the winner and resets the players array', async() =>{
        await lottery.methods.enter().send({
            from: accounts[0], 
            value: web3.utils.toWei('2','ether')});

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;
        console.log(difference);
        assert(difference > web3.utils.toWei('1.8','ether'));

        const players = await lottery.methods.getPlayers().call();
        const balance = await lottery.methods.getBalance().call();
        
        assert.equal(0,players.length);
        assert.equal(0,balance);
    });

});

