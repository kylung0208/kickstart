import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import campaignInstanceGenerator from '../ethereum/campaign';
import { Router } from '../routes';

class RequestRow extends Component {
    state = {
        approveLoading: false,
        finalizeLoading: false
    }

    onApprove = async () => {
        this.setState({ approveLoading: true })

        const accounts = await web3.eth.getAccounts();
        const campaign = campaignInstanceGenerator(this.props.address);

        await campaign.methods.approveRequest(this.props.id).send({
            from: accounts[0]
        });

        this.setState({ approveLoading: false })
        Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    };

    onFinalize = async () => {
        this.setState({ finalizeLoading: true })

        const accounts = await web3.eth.getAccounts();
        const campaign = campaignInstanceGenerator(this.props.address);
        await campaign.methods.finalizeRequest(this.props.id).send({
            from: accounts[0]
        });

        this.setState({ finalizeLoading: false })
        Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    };

    render() {
        const { Row, Cell } = Table;
        const { id, request, approversCount } = this.props;
        const readyToFinalize = request.approvalCount > approversCount / 2;

        return (
            <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount}/{approversCount}</Cell>
                <Cell>
                    {request.complete ? null : (
                        <Button color="green" basic loading={this.state.approveLoading} onClick={this.onApprove}>
                            Approve
                        </Button>
                    )
                    }
                </Cell>
                <Cell>
                    {request.complete ? null : (
                        <Button color="teal" basic loading={this.state.finalizeLoading} onClick={this.onFinalize}>
                            Finalize
                        </Button>
                    )
                    }
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;