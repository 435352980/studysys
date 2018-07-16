import React from 'react';
import classNames from 'classnames';
import './bootstrap-chosen.css';

export default class Chosen extends React.Component {
	state = {
		selectKeys: [],
		showing: false,
		default_text: '请选择',
		results_none_found: '未搜索到结果',
		search_text: '',
		checkAll: false,
		container_active: false
	};

	componentWillMount() {
		document.addEventListener('click', this.documentToggle);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.documentToggle);
	}

	isDescendant = (parent, child) => {
		let node = child.parentNode;
		while (node !== null) {
			if (node === parent) {
				return true;
			}
			node = node.parentNode;
		}
		return false;
	};

	documentToggle = e => {
		if (!this.isDescendant(this.refs.container, e.target)) {
			this.state.showing
				? this.setState({ showing: false })
				: this.setState({ container_active: false });
		}
	};

	toggle = e => {
		if (!(e.target.nodeName === 'ABBR')) {
			this.refs.chosenResult.scrollTop = 0;
			this.setState({ showing: !this.state.showing });
		}
		this.setState({ container_active: true });
		this.setFocus();
	};

	setFocus = () => this.refs.searchBox.focus();

	getText = selectKeys =>
		selectKeys.length === 0
			? '请选择'
			: selectKeys.length === 1
				? this.props.options.find(option => selectKeys.includes(option.key)).value
				: `选则了 【${selectKeys.length}】 个选项`;

	onSelect = key => {
		let selectKeys = [];
		if (!this.props.multi) {
			selectKeys = [ key ];
			const selectedOption = this.props.options.find(option => option.key === key);
			this.setState({ selectKeys, default_text: selectedOption.value, showing: false });
			return this.props.onChange(selectedOption.value);
		}
		if (this.state.selectKeys.includes(key)) {
			selectKeys = this.state.selectKeys.filter(val => val !== key);
		} else {
			selectKeys = [ ...this.state.selectKeys, key ];
		}
		const checkAll = selectKeys.length === this.props.options.length;
		const default_text =
			selectKeys.length === this.props.options.length ? '全部' : this.getText(selectKeys);
		this.setState({ selectKeys, checkAll, default_text });
		if (checkAll) {
			this.props.onChange([]);
		} else {
			this.props.onChange(
				this.props.options.filter(option => selectKeys.includes(option.key)).map(obj => obj.value)
			);
		}
		this.setFocus();
	};

	checkAll = e => {
		const checkAll = !this.state.checkAll;
		const selectKeys = checkAll ? this.props.options.map(option => option.key) : [];
		const default_text = checkAll ? '全部' : '请选择';
		this.setState({ selectKeys, checkAll, default_text });
		this.props.onChange([]);
		this.setFocus();
	};

	deSelect = e => {
		this.setState({ selectKeys: [], checkAll: false, default_text: '请选择' });
		this.props.onChange(this.props.multi ? [] : null);
	};

	render() {
		const { default_text, showing, results_none_found, search_text, container_active } = this.state;
		const options = this.props.options;
		const search_results =
			search_text === '' ? options : options.filter(item => item.value.includes(search_text));
		return (
			<div
				ref="container"
				style={this.props.style || {}}
				className={classNames(
					'chosen-container',
					'chosen-container-single',
					{ 'chosen-container-active': container_active },
					{ 'chosen-with-drop': showing }
				)}
			>
				<a
					onClick={this.toggle}
					className={classNames('chosen-single', 'chosen-default', {
						'chosen-single-with-deselect': this.props.clear
					})}
				>
					<span>{default_text}</span>
					{this.props.clear ? (
						<abbr onClick={this.deSelect} className="search-choice-close" />
					) : null}
					<div>
						<b />
					</div>
				</a>
				<div class="chosen-drop">
					{this.props.multi ? (
						<div>
							<input
								class="checkAll"
								type="checkbox"
								checked={this.state.checkAll}
								onClick={this.checkAll}
								style={{ marginLeft: 10 }}
							/>
							<span onClick={this.checkAll} style={{ cursor: 'pointer' }}>
								全部
							</span>
						</div>
					) : null}

					<div class="chosen-search">
						<input
							ref="searchBox"
							hidden={!this.props.hasSearch}
							type="text"
							value={search_text}
							onChange={({ target: { value } }) => {
								this.setState({ search_text: value });
							}}
							autocomplete="off"
						/>
					</div>
					<ul ref="chosenResult" class="chosen-results">
						{search_results.length > 0 ? (
							search_results.map(option => (
								<Option
									dataKey={option.key}
									selected={this.state.selectKeys.includes(option.key)}
									onSelect={this.onSelect}
									{...option}
								/>
							))
						) : (
							<li class="no-results">
								{results_none_found}
								<span />
							</li>
						)}
					</ul>
				</div>
			</div>
		);
	}
}

const Option = props => {
	const { dataKey, label, value, selected, onSelect } = props;
	return (
		<li
			onClick={() => onSelect(dataKey)}
			className={classNames('active-result', 'search-choice', { highlighted: selected })}
		>
			{label ? label : value}
		</li>
	);
};

Chosen.defaultProps = {
	hasSearch: false,
	options: [],
	multi: false,
	onChange: () => {},
	clear: true
};
