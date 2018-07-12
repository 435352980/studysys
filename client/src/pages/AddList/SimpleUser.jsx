import React from 'react';
import { Button, Input, Row, Col } from 'antd';
export default class SimpleUser extends React.Component {
	state = {
		name: null,
		age: null,
		sex: null
	};

	onChange = (fieldName, value) => {
		this.setState({ ...this.state, [fieldName]: value });
		this.props.onChange({ ...this.state, [fieldName]: value });
	};

	render() {
		const { name, age, sex } = this.state;
		return (
			<div>
				<Row>
					<Col span={4}>
						<Input value={name} onChange={e => this.onChange('name', e.target.value)} />
					</Col>

					<Col span={4}>
						<Input value={age} onChange={e => this.onChange('age', e.target.value)} />
					</Col>
					<Col span={4}>
						<Input value={sex} onChange={e => this.onChange('sex', e.target.value)} />
					</Col>

					<Button icon="minus-circle-o" onClick={() => this.props.handleDelete()} type="danger">
						删除
					</Button>
				</Row>
			</div>
		);
	}
}
