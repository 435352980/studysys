import React from 'react';
import { Layout, Row, Table, Button, Card, Icon, Select, message } from 'antd';
import Chosen from '../../lib/chosen';

const data = [
	{ key: '1EDaDB5D-c399-A50B-D536-f5cC7B36DaBc', value: '雷强' },
	{ key: '048B243e-b332-Dd49-6b6b-4fC5CecCEdAb', value: '谢刚' },
	{ key: 'Aae8ebBB-C1CE-7fbE-D893-5c2Fb16dc17F', value: '胡军' },
	{ key: '627BcFCB-f46D-fc69-ec85-AfCD24EDc3Ba', value: '赵明' },
	{ key: 'C855bA2F-5D5c-BC5E-e7B0-Ad1350b2eC87', value: '苏艳' },
	{ key: 'B2cdfee3-6ee9-aCB4-cb9E-Ce56bcE037Fe', value: '陈丽' },
	{ key: 'D9DAD242-c7b2-b0ae-33A5-b52B6cAfB74D', value: '许伟' },
	{ key: 'df7E6dFe-279B-B6Ff-6C76-fFF6E86fAd9E', value: '廖涛' },
	{ key: '8e7b3bf9-eBAC-d2Ab-F0f4-bA4CfB4155AB', value: '陈军' },
	{ key: 'a1dB6d2f-9153-cd08-E825-9C9bC9EEADCD', value: '郝艳' },
	{ key: '8da4e2CA-c9C4-7baC-dbDB-8e988008E12B', value: '石勇' },
	{ key: 'F46eae9c-0AbF-eE5c-221c-585feFBc95CA', value: '田涛' },
	{ key: '0fECbB9C-D4ed-B9B8-ccCA-3fB2E0DfdFbe', value: '金桂英' },
	{ key: 'b9276d09-87Ba-B79b-36c4-e217cc3cceE5', value: '邹平' },
	{ key: 'd0EE20F7-e822-FE73-bDfE-478d3258bFb0', value: '段娟' },
	{ key: 'eE38b82b-54ca-B2e8-3E96-9c3DF857CFD1', value: '董磊' },
	{ key: 'cABcca7E-2ccB-EE9A-F3EE-EdA8EFc78D2F', value: '崔杰' },
	{ key: 'BCa22fe1-08D4-cB7C-ABA6-8B54244478a6', value: '刘娜' },
	{ key: 'E2E1FDed-c147-cF8B-cf51-bF8A9E91C9cc', value: '邱平' },
	{ key: '6E5A66cE-d591-FE3d-A1f8-cA41D22DD96b', value: '傅秀英' }
];
const Content = Layout.Content;
export default class ChosenCheck extends React.Component {
	state = {
		value: [],
		options: []
	};
	componentDidMount() {
		this.setState({ options: data });
	}
	render() {
		return (
			<Content>
				<Row
					style={{
						background: '#fff',
						flexDirection: 'row',
						minHeight: 55,
						padding: '16px 0px 16px 16px'
					}}
					className="bottomSpace"
				>
					<div>
						{this.state.value instanceof Array ? this.state.value.join(' ') : this.state.value}
					</div>
				</Row>
				<Row
					style={{ background: '#fff', flexDirection: 'row', padding: '16px 0px 16px 16px' }}
					className="bottomSpace"
				>
					<Chosen
						options={this.state.options}
						multi
						style={{ width: 200 }}
						hasSearch
						onChange={value => {
							this.setState({ value });
						}}
					/>
					<Chosen
						options={this.state.options}
						style={{ width: 200 }}
						onChange={value => {
							this.setState({ value });
						}}
					/>
				</Row>
			</Content>
		);
	}
}
