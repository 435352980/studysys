import { FETCH_VOUCHINFO, FETCH_VOUCHINFO_SUCCESS } from './types';

export const fetchVouchInfo = () => ({ type: FETCH_VOUCHINFO });
export const fetchVouchInfoSucecess = payload => {
	return { type: FETCH_VOUCHINFO_SUCCESS, payload };
};
