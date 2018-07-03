/**
 * 通过doc构建关系对象数组序列
 * @param {*} doc 
 */
function getDocChunks(doc) {
	return spliltDocChunk(doc).map(chunk => {
		if (/\{|\}/.test(chunk)) {
			return formatParentChunk(chunk);
		} else {
			return chunk;
		}
	});
}

const formatParentChunk = doc => {
	var start = doc.indexOf('{');
	var key = doc.substring(0, start);
	doc = doc.substring(start + 1);
	doc = doc.substring(0, doc.length - 1);
	return { key, children: getDocChunks(doc) };
};

/**
 * 拆分doc段(xxx/xxx{...})格式
 * @param {*} doc 
 */
function spliltDocChunk(doc) {
	var token = '', //读取缓存
		times = 1, //循环次数
		docLength = doc.length,
		result = [];
	for (var ch of doc) {
		if (/(\s|\})/.test(ch)) {
			//读到语句块结束标志
			if (ch === '}' || /(\{|\})/.test(token)) {
				//读取到结束括号时需要把括号并入token再执行判断
				token += ch;
				token = token.replace(/\s+/g, ' '); //保留子项结构
			}
			if (token != '' && isBracketBalance(token)) {
				result.push(token);
				token = '';
			}
		} else {
			//继续读取
			token += ch;
			if (times === docLength && token != '' && isBracketBalance(token)) {
				//读取到末尾
				result.push(token);
				token = '';
			}
		}
		times++;
	}
	return result;
}
/**
 * 判断token是否存在成对花括号
 * @param {*} token 
 */
function isBracketBalance(token) {
	var leftBracketNum = 0; // 用于保存左括号个数的变量
	for (var temp of token) {
		if (temp === '{') {
			leftBracketNum++; // 如果是左括号，则leftBracketNum++
		}
		if (temp === '}') {
			leftBracketNum--; // 如果是右括号，则leftBracketNum--
		}
	}
	return leftBracketNum === 0; // 最后判断leftBracketNum，如果为0表示平衡否则不平衡
}

/**
 * 
 * @param {*} relation 关系图[...(key|info)]
 * @param {*} nodes 无序集合
 * @param {*} ignore 表示是否创建关系图中的key在nodes中找不到的项
 */
export const buildRelationFromDoc = (doc = '', nodes = [], ignore = true) => {
	const rule = (key, node) => node.key === key;
	//let result = [];
	let docChunkInfos = getDocChunks(doc);
	//获取结果
	const getResult = chunkInfos => {
		let result = [];
		for (let info of chunkInfos) {
			if (Object.prototype.toString.call(info) === '[object String]') {
				const node = nodes.find(node => rule(info, node));
				if (node) {
					result.push(node);
				} else {
					ignore && result.push({ key: info });
				}
			} else {
				const node = nodes.find(node => rule(info.key, node));
				if (node) {
					result.push({
						...node,
						children: getResult(info.children, nodes, rule)
					});
				} else {
					ignore &&
						result.push({
							key: info.key,
							children: getResult(info.children, nodes, rule)
						});
				}
			}
		}
		return result;
	};
	return getResult(docChunkInfos);

	//return result;
};

const getAllFieldsFromDoc = doc =>
	doc.replace(/(\s|\{|\})+/g, ' ').replace(/(^\s*)|(\s*$)/g, '').split(' ');
