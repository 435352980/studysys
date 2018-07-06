import { FETCH_VOUCHINFO, FETCH_VOUCHINFO_SUCCESS, FETCH_VOUCHINFO_FAILED } from '../actions/types';

const vouchReducer = (state = { header: null, details: [], loading: false }, action) => {
	switch (action.type) {
		case FETCH_VOUCHINFO:
			return { ...state, loading: true };
		case FETCH_VOUCHINFO_SUCCESS:
			return { ...state, ...action.payload, loading: false };
		case FETCH_VOUCHINFO_FAILED:
			return { ...state, loading: false };
		default:
			return state;
	}
};

export default vouchReducer;
