/*
    This file is responsible of re-build the solidity contract.
    It contains four major steps:
        1. Detele build/
        2. Read Campaign.sol solidity contract.
        3. Compile the contract using solidity conpiler (solc).
        4. Write the compiled build to build/.
*/
const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// Step 1.
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

// Step 2.
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');

// Step 3.
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source, 1).contracts;

// Step 4.
fs.ensureDirSync(buildPath);

for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, `${contract.replace(':', '')}.json`),
        output[contract]
    );
}