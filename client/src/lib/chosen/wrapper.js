import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';
import shallowEqualFuzzy from 'shallow-equal-fuzzy';
import './chosen';
import './bootstrap-chosen.css';

const namespace = 'react-chosen';

export default class Chosen extends React.Component {
	static propTypes = {
		events: PropTypes.array,
		data: PropTypes.array,
		options: PropTypes.object,
		multiple: PropTypes.bool,
		onChange: PropTypes.func
	};

	static defaultProps = {
		events: [ [ `change.${namespace}`, 'onChange' ] ],
		data: [],
		options: {},
		multiple: false
	};

	constructor(props) {
		super(props);
		this.el = null;
		this.forceUpdateValue = false;
		this.initialRender = true;
		this.updateChosenValue = this.updateChosenValue.bind(this);
	}

	componentDidMount() {
		this.initChosen(this.props);
		this.updateValue();
	}

	componentWillReceiveProps(nextProps) {
		this.initialRender = false;
		this.updChosen(nextProps);
	}

	componentDidUpdate() {
		this.updateValue();
	}

	componentWillUnmount() {
		this.destroyChosen();
	}

	initChosen(props) {
		// const { option, max_selected_options = null } = props;
		const { options } = props;

		this.el = $(ReactDOM.findDOMNode(this));
		// fix for updating selected value when data is changing
		if (this.forceUpdateValue) {
			this.updateChosenValue(null);
		}
		// this.el.chosen({ max_selected_options });
		this.el.chosen({ ...options });
		this.attachEventHandlers(props);
	}

	updChosen(props) {
		const prevProps = this.props;

		if (!shallowEqualFuzzy(prevProps.data, props.data)) {
			this.forceUpdateValue = true;
			this.destroyChosen(false);
			this.initChosen(props);
			return;
		}

		const { options } = props;
		if (!shallowEqualFuzzy(prevProps.options, options)) {
			this.el.chosen();
		}

		const handlerChanged = e => prevProps[e[1]] !== props[e[1]];
		if (props.events.some(handlerChanged)) {
			this.detachEventHandlers();
			this.attachEventHandlers(props);
		}
	}

	updateChosenValue(value) {
		this.el.off(`change.${namespace}`).val(value).trigger('chosen:updated');
		let handleChange = e => {
			const val = [ ...$(e.target).val() ];
			// if(val.length===this.props.data.length){
			//     this.props.onChange([])
			// }else{
			//     this.props.onChange(val)
			// }
			this.props.onChange && this.props.onChange(val);
		};
		this.el.on(`change.${namespace}`, handleChange);
	}

	updateValue() {
		const { value, defaultValue, multiple } = this.props;
		const newValue = this.prepareValue(value, defaultValue);
		const currentValue = multiple ? this.el.val() || [] : this.el.val();

		if (!this.fuzzyValuesEqual(currentValue, newValue) || this.forceUpdateValue) {
			this.updateChosenValue(newValue);
			if (!this.initialRender) {
				this.el.trigger('chosen:updated');
			}
			this.forceUpdateValue = false;
		}
	}

	fuzzyValuesEqual(currentValue, newValue) {
		return (currentValue === null && newValue === '') || shallowEqualFuzzy(currentValue, newValue);
	}

	destroyChosen(withCallbacks = true) {
		if (withCallbacks) {
			this.detachEventHandlers();
		}

		this.el.chosen('destroy');
		this.el = null;
	}

	attachEventHandlers(props) {
		props.events.forEach(event => {
			if (typeof props[event[1]] !== 'undefined') {
				this.el.on(event[0], props[event[1]]);
			}
		});
	}

	detachEventHandlers() {
		this.props.events.forEach(event => {
			if (typeof this.props[event[1]] !== 'undefined') {
				this.el.off(event[0]);
			}
		});
	}

	prepareValue(value, defaultValue) {
		const issetValue = typeof value !== 'undefined' && value !== null;
		const issetDefaultValue = typeof defaultValue !== 'undefined';

		if (!issetValue && issetDefaultValue) {
			return defaultValue;
		}
		return value;
	}

	makeOption({ key, value, label = value }) {
		return (
			<option key={`option-${key}`} value={value}>
				{label}
			</option>
		);
	}

	render() {
		const { data, value, ...props } = this.props;
		delete props.events;
		delete props.options;
		delete props.onChange;
		delete props.max_selected_options;
		return (
			<select {...props}>
				{data.map((item, k) => {
					return this.makeOption(item);
				})}
			</select>
		);
	}
}
