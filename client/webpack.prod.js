const path = require('path');
const cleanPlugin = require('clean-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');

const SOURCE_DIR = path.resolve('./src');
const NODE_MODULES_DIR = path.resolve('./node_modules');
const BUILD_DIR = path.resolve('./build');

module.exports = {
	resolve: {
		extensions: [ '.js', '.jsx', '.json' ]
	},
	entry: {
		app: path.join(SOURCE_DIR, 'pages/App.jsx')
	},
	output: {
		path: BUILD_DIR,
		filename: 'js/[name][hash].js'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				include: SOURCE_DIR,
				exclude: NODE_MODULES_DIR,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ 'react', [ 'env', { module: false } ], 'stage-0' ]
					}
				}
			}
		]
	},
	plugins: [
		new cleanPlugin([ 'build' ], {
			root: __dirname, // 一个根的绝对路径.
			verbose: true, // 开启在控制台输出信息
			dry: false, // 不要删除任何东西，主要用于测试.
			exclude: [] // 排除不删除的目录，主要用于避免删除公用的文件
		}),
		new htmlPlugin({
			template: path.join(SOURCE_DIR, 'index.html'),
			filename: 'index.html',
			chunks: [ 'app' ],
			inject: 'body'
		})
	]
};
