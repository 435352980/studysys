export const MAP_KEY = '389880a06e3f893ea46036f030c94700';
export const MAP_VERSION = '1.4.7';

/**
 * 后台接口地址
 */
export const API_PORT = 'http://localhost:3000';
/**
 * 菜单配置
 */
// export const MENU_CONFIG = [
// 	{ key: 'report', name: '业务&报表', icon: 'table' },
// 	{ key: 'printVouch', name: '打印单据' },
// 	{ key: 'exportExcel', name: '导出excel' },
// 	{ key: 'charts', name: '图表', icon: 'pie-chart' },
// 	{ key: 'map', name: '高德地图', icon: 'global' },
// 	{ key: 'component', name: '组件测试', icon: 'appstore' },
// 	{ key: 'chosenCheck', name: '多选组件' },
// 	{ key: 'addList', name: '批量添加' }
// ];

export const MENU_CONFIG = {
	report: { name: '业务&报表', icon: 'table' },
	printVouch: { name: '打印单据' },
	exportExcel: { name: '导出excel' },
	charts: { name: '图表', icon: 'pie-chart' },
	map: { name: '高德地图', icon: 'global' },
	component: { name: '组件测试', icon: 'appstore' },
	chosenCheck: { name: '多选组件' },
	addList: { name: '批量添加' }
};
/**
 * 菜单组合排序规则
 */
export const MENU_DOC = `
	map 
	report{ printVouch exportExcel } 
    component{ chosenCheck addList } 
    charts 
`;
