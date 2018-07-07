export const isUndefined = obj => obj === void 0;
export const isNull = obj => obj === null;
export const isObj = obj => Object.prototype.toString.call(obj) === '[object Object]';
export const isBoolean = obj => Object.prototype.toString.call(obj) === '[object Boolean]';
export const isNumber = obj => Object.prototype.toString.call(obj) === '[object Number]';
export const isString = obj => Object.prototype.toString.call(obj) === '[object String]';
export const isNaN = obj => obj !== obj;
export const isFunction = obj => typeof obj === 'function';

export const jsonField = (name, value) => {
	if (!name) {
		return null;
	}
	if (value == null || (isObj(value) && Object.keys(value).length === 0)) {
		return null;
	}
	return { [name]: value };
};

export const toJsDate = date => (date ? new Date(date) : null);

/**
 * 正则表达式转换
 * @param {*} fieldValue 字段值
 * @param {boolean} isIgonreCase 是否忽略大小写
 */
export const regFormatter = function(fieldValue, isIgonreCase) {
	if (!fieldValue) {
		return null;
	}
	if (isIgonreCase) {
		return new RegExp(fieldValue, 'i');
	}
	return new RegExp(fieldValue);
};

/**
 * 联合查询条件为mongodb or 对象格式
 * @param {*} objects (可变长参数)
 */
export const joinObjsInArray = function(...objects) {
	let arr = [];
	objects.map(function(object) {
		if (object) {
			arr.push(object);
		}
	});
	if (arr.length > 0) {
		return arr;
	} else {
		return null;
	}
};

/**
 * 根据分隔符分割字符串为数组
 * @param {*} str (需要转换的字符串)
 * @param {*} separator (分隔符)
 */
export const splitStringToArray = function(str, separator = ',') {
	if (str) {
		return str.split(separator);
	} else {
		return null;
	}
};
/**
 * 判断是否为空，空返回TRUE，否则为FALSE
 * @param {*} value 
 */
export const isEmpty = value => !value;

/**
 * 合并多个对象至一个对象
 * @param {*} objs 可变长参数
 */
export let mergeObjs = function(...objs) {
	let result = {};
	for (let obj of objs) {
		if (isJsonObj(obj)) {
			deleteEmptyField(obj);
			if (!isEmptyObj(obj)) {
				Object.assign(result, obj);
			}
		}
		if (obj instanceof Function && obj.name) {
			Object.assign(result, { [obj.name]: obj });
		}
	}
	if (!isEmptyObj(result)) {
		return result;
	} else {
		return null;
	}
};

/**
 * 判断是否为JSON对象
 * @param {*} obj
 */
const isJsonObj = function(obj) {
	return (
		typeof obj == 'object' &&
		Object.prototype.toString.call(obj).toLowerCase() == '[object object]' &&
		!obj.length
	);
};

/**
 * 判断是否为空对象
 * @param {*} obj
 */
export const isEmptyObj = function(obj) {
	return !(Object.keys(obj).length > 0);
};

/**
 * 删除对象中为空的属性值
 * @param {*} obj
 */
export const deleteEmptyField = function(obj) {
	for (let key of Object.keys(obj)) {
		if (obj[key] == null) {
			delete obj[key];
		}
	}
	return obj;
};

/**
 * 获取文件后缀名
 * @param {*} name 
 */
export let getSuffix = name => name.substring(name.lastIndexOf('.'));

/**
 * 设置excel响应头
 * @param {*} userAgent 
 * @param {*} res 
 * @param {*} filename 
 */
export const setResHeaderForExcel = (userAgent, res, filename) => {
	if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
		res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename));
	} else if (userAgent.indexOf('firefox') >= 0) {
		res.setHeader(
			'Content-Disposition',
			"attachment; filename*=\"utf8''" + encodeURIComponent(filename) + '"'
		);
	} else {
		/* safari等其他非主流浏览器只能自求多福了 */
		res.setHeader(
			'Content-Disposition',
			'attachment; filename=' + new Buffer(filename).toString('binary')
		);
	}
};
