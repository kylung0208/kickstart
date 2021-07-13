/*
    Test script for the ethereum contracts in this project.
*/
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    // Create a new contract to deploy using 
    // `web3.eth.Contract(abi)`.
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    // Get deployed contract on the blockchain using 
    // `web3.eth.Contact(abi, address)`.
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.strictEqual(accounts[0], manager);
    });

    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5', // 5 < 100 wei (minimum)
                from: accounts[1]
            });
            assert(false); // if the above code does not throw error, this test fails.
        } catch (err) {
            assert(err); // make sure we do have an error here.
        }
    });

    it('allows a manager to make a payment request', async () => {
        const description = 'Buy batteries';

        await campaign.methods
            .createRequest(description, '100', accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        const request = await campaign.methods.requests(0).call();

        assert.strictEqual(description, request.description);
    });

    it('processes requests', async () => {
        // Contribute to this project (campaign).
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        // Create a spending request.
        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({ from: accounts[0], gas: '1000000' });

        // Approvers of this project vote on this spending request.
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        // Finialize the request, and send the money to the vendor.
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        // Retrieve the vendor's account and check the balance inside of it.
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        // Make suret the balance in the vendor account does receive the money (5 ether) we send.
        assert(balance > 104);
    });
});