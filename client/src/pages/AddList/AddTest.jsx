import React from 'react';
import { Button, Row, Col } from 'antd';
import SimpleUser from './SimpleUser';

const colStyle = {
	style: {
		display: 'flex',
		height: 32,
		backgroundColor: '#E8E8E8',
		alignItems: 'center',
		justifyContent: 'center'
	}
};

export default class AddTest extends React.Component {
	state = {
		dataList: [ { dataKey: 0 } ],
		key: 0
	};

	handleDelete = dataKey => {
		const dataList = this.state.dataList.filter(user => user.dataKey !== dataKey);
		console.log('delete', dataList);
		this.setState({ dataList });
		this.props.handleChange(dataList);
	};

	handleAdd = () => {
		const key = this.state.key + 1;
		const dataList = [ ...this.state.dataList, { dataKey: key } ];
		console.log('add', dataList);
		this.setState({ dataList, key });
		this.props.handleChange(dataList);
	};

	handleChange = (index, dataKey, value) => {
		const dataList = [
			...this.state.dataList.filter((item, i) => i < index),
			{ dataKey, ...value },
			...this.state.dataList.filter((item, i) => i > index)
		];
		console.log('change', dataList);
		this.setState({ dataList });
		this.props.handleChange(dataList);
	};

	render() {
		const dataList = this.state.dataList;
		return (
			<div {...this.props}>
				<Row>
					<Col span={4} {...colStyle}>
						<span>姓名</span>
					</Col>
					<Col span={4} {...colStyle}>
						<span>年龄</span>
					</Col>
					<Col span={4} {...colStyle}>
						<span>性别</span>
					</Col>

					<Button type="primary" icon="plus-circle-o" onClick={this.handleAdd}>
						添加
					</Button>
				</Row>
				{dataList.map((user, index) => (
					<SimpleUser
						key={user.dataKey}
						disabled={this.props.disabled}
						index={index}
						onChange={item => this.handleChange(index, user.dataKey, item)}
						{...user}
						handleDelete={() => this.handleDelete(user.dataKey)}
					/>
				))}
			</div>
		);
	}
}
