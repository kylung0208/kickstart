import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x498978403468E4C988C0860a82f1FCBa1293690f'
);

export default instance;
