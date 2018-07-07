import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Layout, Row, Table, Button, Card, Icon } from 'antd';
import { API_PORT } from '../../config';

const Content = Layout.Content;

export default class ExportExcel extends React.Component {
	state = {
		tableData: []
	};

	componentDidMount() {
		axios.get(`${API_PORT}/excel`).then(res => {
			const data = res.data;
			let result = [];
			for (let item of data) {
				result.push([ Object.keys(item)[0], ...item[Object.keys(item)[0]] ]);
			}
			const tableData = result.map(obj => ({
				name: obj[0],
				1: obj[1],
				2: obj[2],
				3: obj[3],
				4: obj[4],
				5: obj[5],
				6: obj[6],
				7: obj[7],
				8: obj[8],
				9: obj[9],
				10: obj[10],
				11: obj[11],
				12: obj[12]
			}));
			this.setState({ tableData });
		});
	}
	render() {
		const columns = [
			{ width: 100, title: '名称', dataIndex: 'name' },
			{ width: 100, title: '1月', dataIndex: '1' },
			{ width: 100, title: '2月', dataIndex: '2' },
			{ width: 100, title: '3月', dataIndex: '3' },
			{ width: 100, title: '4月', dataIndex: '4' },
			{ width: 100, title: '5月', dataIndex: '5' },
			{ width: 100, title: '6月', dataIndex: '6' },
			{ width: 100, title: '7月', dataIndex: '7' },
			{ width: 100, title: '8月', dataIndex: '8' },
			{ width: 100, title: '9月', dataIndex: '9' },
			{ width: 100, title: '10月', dataIndex: '10' },
			{ width: 100, title: '11月', dataIndex: '11' },
			{ width: 100, title: '12月', dataIndex: '12' }
		];
		return (
			<Content>
				<iframe name="salesexcel" hidden />

				<Row style={{ background: '#fff', flexDirection: 'row' }} className="bottomSpace">
					{/* <Button
						style={{ margin: '16px 0 16px 16px' }}
						onClick={() => this.props.dispatch(fetchVouchInfo())}
					>
						mock测试
					</Button> */}

					<form target="salesexcel" method="post" action={`${API_PORT}/excel`}>
						<input type="hidden" name="searchParam" value={JSON.stringify({ option: 'sales' })} />
						<Button style={{ margin: '16px 0 16px 16px' }} type="primary" htmlType="submit">
							{'导出Excel'} <Icon type="download" />
						</Button>
					</form>
				</Row>
				<Card>
					<Table
						size="small"
						rowKey={record => record.name}
						title={() => <span style={{ fontSize: 20 }}>全年销售</span>}
						// scroll={{ y: 500 }}
						pagination={false}
						bordered
						locale={{ emptyText: '暂无数据' }}
						columns={columns}
						dataSource={this.state.tableData}
					/>
				</Card>
			</Content>
		);
	}
}
