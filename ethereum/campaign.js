/*
    Defines campaign instance generator function in this file.
*/
import web3 from './web3';
import Campaign from './build/Campaign.json';

const campaignInstanceGenerator = (address) => {
    /* 
    Args:
        address: solidity.address: Deployed campaign contract's address.

    Returns:
        contractInstance: web3.eth.Contract: A campaign contract javascript instance.
    */
    return new web3.eth.Contract(
        JSON.parse(Campaign.interface),
        address
    );
};

export default campaignInstanceGenerator
