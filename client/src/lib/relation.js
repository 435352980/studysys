//格式化文档，避免解析问题
const formatDoc = doc =>
	doc.replace(/\{\s+/g, '{').replace(/\s+\}/g, '}').replace(/\s+/g, ' ').replace(/(^\s*)|(\s*$)/g, '');

//判断给定的字符串内是否出现呈整数对的花括号
const isBracketBalance = str =>
	str.split('').reduce((prev, curr) => prev + (curr === '{' ? 1 : curr === '}' ? -1 : 0), 0) === 0;

//转换文档为chunk段
const formatChunks = doc => {
	let temp = '',
		result = [];
	for (let ch of formatDoc(doc)) {
		//读取到分隔符时执行添加判断，否则继续读取
		ch === ' ' && temp !== '' && isBracketBalance(temp) ? result.push(temp) && (temp = '') : (temp += ch);
	}
	//需判断最后chunk项有无添加进结果集
	return temp !== '' ? [ ...result, temp ] : result;
};

//根据节点关系文档与节点定义构建自顶向下的树结构，onBuild提供构建节点时的hook
export const buildDocTree = (config = {}, doc, onBuild = null, pKeys = null) =>
	formatChunks(doc).map(chunk => {
		let node = null;
		if (/\{|\}/.test(chunk)) {
			//父节点类型
			const key = chunk.split('{', 1)[0];
			const subDoc = chunk.substring(chunk.indexOf('{') + 1, chunk.lastIndexOf('}'));
			const subPkeys = pKeys ? [ ...pKeys, key ] : [ key ];
			node = {
				key,
				...config[key],
				paths: pKeys,
				children: buildDocTree(config, subDoc, onBuild, subPkeys)
			};
		} else {
			//子节点
			node = { key: chunk, ...config[chunk], paths: pKeys ? [ ...pKeys, chunk ] : [ chunk ] };
		}
		typeof onBuild === 'function' && onBuild(node);
		return node;
	});
