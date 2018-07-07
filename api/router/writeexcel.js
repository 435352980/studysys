import { Router } from 'express';
import fs from 'fs';
import util from 'util';
import moment from 'moment';
import { mock } from 'mockjs';
import ejsexcel from 'ejsExcel';

import { setResHeaderForExcel } from '../lib/util';
import excelConfig from './excelConfig';

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const router = Router();

const getData = () => {
	let data = [];
	for (let i = 0; i < 12; i++) {
		data.push(mock('@float(200, 4000, 0, 2)'));
	}
	return data;
};
const excelData = [];
for (let i = 0; i < 20; i++) {
	excelData.push({ [mock('@first')]: getData() });
}

router.get('/', (req, res) => {
	res.send(excelData);
});

router.post('/', async (req, res) => {
	const { option, ...params } = JSON.parse(req.body.searchParam);
	const { name, path } = excelConfig[option];
	switch (option) {
		case 'sales':
			//查询数据得到promise 后续处理调用promise.then(data.....)
			break;
	}
	//获得Excel模板的buffer对象
	const exlBuf = await readFileAsync(path);
	//数据源
	const data = { title: name, data: excelData };
	//用数据源(对象)data渲染Excel模板
	const exlBuf2 = await ejsexcel.renderExcel(exlBuf, data);
	setResHeaderForExcel(
		(req.headers['user-agent'] || '').toLowerCase(),
		res,
		`${name}${moment().format('YYYY-MM-DD')}.xlsx`
	);
	res.end(exlBuf2, 'binnary');
});
export default router;
