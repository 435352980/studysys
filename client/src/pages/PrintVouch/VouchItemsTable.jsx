import React from 'react';
import numeral from 'numeral';
import { Button, Table } from 'antd';
import EditableColumn from './EditableColumn';

const formatCurrency = value => (value ? numeral(value).format('0,0.00') : null);
const formatNumber = value => (value ? numeral(value).format('0,0') : null);

export default class VouchItemsTable extends React.Component {
	state = {
		vouchItems: []
	};

	componentWillReceiveProps(nextProps) {
		const { vouchItems } = nextProps;
		//对比差异数据，更新并返回新数据
		const onEditableColumns = this.state.vouchItems.filter(item => item.editable === true);
		let newVouchItems = [];
		for (let info of vouchItems) {
			//如果返回数据中的行能在正在编辑的行中找到则用正在编辑的行代替props传入的对应的行
			const editableColumn = onEditableColumns.find(item => item.id === info.id);
			if (editableColumn) {
				newVouchItems.push(editableColumn);
			} else {
				newVouchItems.push(info);
			}
		}

		this.setState({ vouchItems: newVouchItems });
	}

	updateItem(type, record, index) {
		const vouchItems = this.state.vouchItems || [];
		let newVouchItems = [ ...vouchItems ];
		newVouchItems[index] = { ...record, editable: !record.editable };
		this.setState({ vouchItems: newVouchItems }, () => this.setEditable());
		if (type !== 'edit' && type !== 'cancel') {
			this.props.handleUpdate(record);
		}
	}

	deleteItem(type, record, index) {
		const vouchItems = this.state.vouchItems || [];
		const newVouchItems = vouchItems.filter(item => item.id !== record.id);
		this.setState({ vouchItems: newVouchItems }, () => this.setEditable());
		this.props.handleDelete(record.id);
	}

	setEditable() {
		const vouchItems = this.state.vouchItems || [];
		if (vouchItems.find(item => item.editable === true)) {
			this.props.setEditable(true);
		} else {
			this.props.setEditable(false);
		}
	}

	render() {
		const disabled = this.props.disabled;
		const vouchItems = this.state.vouchItems;
		const btnProps = { type: 'primary', shape: 'circle', size: 'small', disabled };
		const column = [
			{ width: 60, title: '序号', dataIndex: 'rowNo', render: (text, record, index) => index + 1 },
			// {
			// 	width: 50,
			// 	title: '操作',
			// 	dataIndex: 'operation',
			// 	render: (text, record, index) => (
			// 		<div disabled={disabled}>
			// 			<div hidden={!record.editable} style={{ textAlign: 'center' }}>
			// 				<Button
			// 					{...btnProps}
			// 					icon="close"
			// 					onClick={() => this.updateItem('cancel', record, index)}
			// 				/>
			// 				&nbsp;&nbsp;
			// 				<Button
			// 					{...btnProps}
			// 					icon="save"
			// 					onClick={() => this.updateItem('save', record, index)}
			// 				/>
			// 			</div>
			// 			<div hidden={record.editable} style={{ textAlign: 'center' }}>
			// 				<Button
			// 					{...btnProps}
			// 					icon="edit"
			// 					onClick={() => this.updateItem('edit', record, index)}
			// 				/>
			// 				&nbsp;&nbsp;
			// 				<Button
			// 					{...btnProps}
			// 					icon="delete"
			// 					onClick={() => this.deleteItem('delete', record, index)}
			// 				/>
			// 			</div>
			// 		</div>
			// 	)
			// },
			{ width: 100, title: '产品类别', dataIndex: 'cat' },
			{ width: 100, title: '产品型号', dataIndex: 'model' },
			{ width: 100, title: '产品颜色', dataIndex: 'color' },
			{
				width: 100,
				title: '数量',
				dataIndex: 'qty',
				render: (text, record, index) => (
					<EditableColumn
						onChange={value => {
							let newVouchItems = [ ...vouchItems ];
							newVouchItems[index] = { ...record, qty: value };
							this.setState({ vouchItems: newVouchItems });
						}}
						editable={record.editable}
						value={record.qty}
						formatType="number"
					/>
				)
			},
			{
				width: 150,
				title: '零售单价',
				dataIndex: 'price',
				render: (text, record, index) => (
					<EditableColumn
						onChange={value => {
							let newVouchItems = [ ...vouchItems ];
							newVouchItems[index] = { ...record, price: value };
							this.setState({ vouchItems: newVouchItems });
						}}
						editable={record.editable}
						value={record.price}
						formatType="currency"
					/>
				)
			}
		];
		return (
			<Table
				size="small"
				rowKey={record => record.id}
				title={() => <span style={{ fontSize: 20 }}>单据明细</span>}
				// scroll={{ y: 500 }}
				pagination={false}
				bordered
				locale={{ emptyText: '暂无数据' }}
				columns={column}
				dataSource={vouchItems}
			/>
		);
	}
}
