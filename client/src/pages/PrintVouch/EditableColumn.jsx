import React from 'react';
import numeral from 'numeral';
import { Input } from 'antd';

const formatCurrency = value => (value ? numeral(value).format('0,0.00') : null);
const formatNumber = value => (value ? numeral(value).format('0,0') : null);

export default class EditableColumn extends React.Component {
	state = {
		editable: false,
		value: null
	};

	//默认值
	componentDidMount() {
		this.setState({ value: this.props.value });
	}

	//状态改变
	componentWillReceiveProps(nextProps) {
		const { editable, value } = nextProps;
		this.setState({ editable, value });
	}

	render() {
		const editable = this.state.editable;
		const formatType = this.props.formatType;
		if (editable) {
			return (
				<Input
					onKeyDown={e => {
						const keyCode = e.keyCode;
						if (
							!(
								(keyCode >= 48 && keyCode <= 57) ||
								(keyCode >= 96 && keyCode <= 105) ||
								keyCode === 45 ||
								keyCode === 46 ||
								keyCode === 8 ||
								keyCode === 190 ||
								keyCode === 110 ||
								keyCode == 37 ||
								keyCode == 39
							)
						) {
							e.preventDefault();
						}
					}}
					onChange={({ target: { value } }) => {
						if (!/^\d*\.?\d{0,2}$/.test(value)) {
							return;
						}
						this.setState({ value });
						this.props.onChange(value);
					}}
					value={this.state.value}
				/>
			);
		}
		return (
			<div>
				{formatType === 'currency' ? (
					formatCurrency(this.state.value)
				) : formatType === 'number' ? (
					formatNumber(this.state.value)
				) : (
					this.state.value
				)}
			</div>
		);
	}
}
