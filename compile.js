// compile code will go here
//path module help us build a path from the current compile.js file over to the Inbox.sol file
//fs - file system module to read in the content of the file
const path = require('path');
const fs = require('fs');
const solc = require('solc');   //Using solidity compiler

const lotteryPath = path.resolve(__dirname,'contracts','Lottery.sol'); //Setting up the path
const source = fs.readFileSync(lotteryPath, 'utf8'); //Reading the content/raw source code of the Contract Inbox.js

//Adding the expected JSON formatted input, specifying the language, sources, outputSelection
const input = {
    language: 'Solidity',
    sources: {
      'Lottery.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    'Lottery.sol'
].Lottery;
//Feeding the content of the contract directly into the solidity compiler and it provides the expected JSON formatted output
//The main contract file could have multiple contracts, so here we're just taking into account the Inbox contract
