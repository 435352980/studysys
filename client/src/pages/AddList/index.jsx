import React from 'react';
import { Layout, Row, Table, Button, Card, Icon } from 'antd';
import AddTest from './AddTest';
const Content = Layout.Content;

export default class AddList extends React.Component {
	state = {
		value: []
	};
	render() {
		return (
			<Content>
				<Row style={{ background: '#fff', padding: '16px 0px 16px 16px' }} className="bottomSpace">
					{this.state.value.map(item => <p>{JSON.stringify(item)}</p>)}
				</Row>
				<Row
					style={{ background: '#fff', flexDirection: 'row', padding: '16px 0px 16px 16px' }}
					className="bottomSpace"
				>
					<AddTest handleChange={value => this.setState({ value })} />
				</Row>
			</Content>
		);
	}
}
