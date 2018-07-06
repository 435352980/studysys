const path = require('path');
const chalk = require('chalk'); //颜色
const webpack = require('webpack');
const cleanPlugin = require('clean-webpack-plugin'); //打包时清除文件
const ProgressBarPlugin = require('progress-bar-webpack-plugin'); //命令行进度条插件

const ROOT_DIR = __dirname;
const SOURCE_DIR = path.resolve('./src');
const NODE_MODULES_DIR = path.resolve('./node_modules');
const BUILD_DIR = path.resolve('./build');
/**
 * 尽量减小搜索范围
 * target: '_dll_[name]' 指定导出变量名字
 */

module.exports = {
	mode: process.env.NODE_ENV,
	entry: {
		vendor: [
			'react',
			'react-dom',
			'react-router',
			'redux',
			'react-redux',
			'history',
			'react-router-redux',
			'redux-observable',
			'rxjs',
			'axios',
			'numeral',
			'moment',
			'bignumber.js',
			'rc-print'
		]
	},
	output: {
		path: BUILD_DIR,
		publicPath: '/',
		filename: 'vendor/[name].dll.js',
		library: '[name]_library'
	},
	// manifest是描述文件
	plugins: [
		new cleanPlugin([ 'build' ], {
			root: ROOT_DIR, // 一个根的绝对路径.
			verbose: true, // 开启在控制台输出信息
			dry: false, // 不要删除任何东西，主要用于测试.
			exclude: [] // 排除不删除的目录，主要用于避免删除公用的文件
		}),
		new webpack.DllPlugin({
			name: '[name]_library',
			path: path.join(BUILD_DIR, 'vendor', 'manifest.json')
		}),
		new ProgressBarPlugin({
			format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)'
		})
	]
};
