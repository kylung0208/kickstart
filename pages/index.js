import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component {
    static async getInitialProps() {
        // A function exclusively for Next.js
        // It calls this function "before" the instance of this class is created. -> static method
        const campaigns = await factory.methods.getDeployedCampaigns().call();

        return { campaigns }; // return to CampaignIndex class as props.
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaigns</a>
                    </Link>
                ),
                fluid: true
            };
        });

        return <Card.Group items={items} />
    }

    render() {
        return (
            <Layout>
                <div>
                    <h3>Open Campaigns</h3>

                    <Link route="/campaigns/new">
                        <a>
                            <Button
                                floated="right"
                                content="Create Campaign"
                                icon="add"
                                primary
                            />
                        </a>
                    </Link>

                    {this.renderCampaigns()}
                </div>
            </Layout >
        );
    }
}

export default CampaignIndex;