const os = require('os'); //获取本地系统信息
const chalk = require('chalk'); //颜色
const path = require('path'); //路径

const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin'); //打包时清除指定文件/文件夹
const HtmlPlugin = require('html-webpack-plugin'); //加载html模板，引入js文件
const ProgressBarPlugin = require('progress-bar-webpack-plugin'); //命令行进度条插件

const CopyWebpackPlugin = require('copy-webpack-plugin'); //复制文件到指定位置

const HappyPack = require('happypack'); //多线程打包优化
const threadPool = HappyPack.ThreadPool({ size: os.cpus().length }); //按cpu线程数指定线程数

const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //替代extract-text-plugin但与happypack不兼容
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin'); //压缩css

const ROOT_DIR = __dirname;
const SOURCE_DIR = path.resolve('./src');
const NODE_MODULES_DIR = path.resolve('./node_modules');
const BUILD_DIR = path.resolve('./build');
const publicPath = 'http://localhost:8080/';

const isDevelopment = process.env.NODE_ENV === 'development';

const devtool = isDevelopment ? { devtool: 'eval-source-map' } : null;
const devServerConfig = isDevelopment ? { contentBase: path.join(BUILD_DIR), publicPath } : null; //静态文件根目录

const config = {
	mode: process.env.NODE_ENV,
	...devtool,
	resolve: {
		extensions: [ '.js', '.jsx', '.json', '.gql', '.less' ]
	},
	externals: {
		echarts: 'echarts'
	},
	entry: {
		app: path.join(SOURCE_DIR, 'App.jsx')
	},
	output: {
		path: BUILD_DIR,
		filename: 'js/[name][chunkhash:16].js',
		publicPath: '/'
	},
	devServer: { ...devServerConfig },
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				include: SOURCE_DIR,
				exclude: NODE_MODULES_DIR,
				use: { loader: 'happypack/loader', options: { id: 'jsx' } }
			},
			{
				test: /\.less$/,
				use: (isDevelopment ? [ 'css-hot-loader' ] : []).concat([
					{ loader: MiniCssExtractPlugin.loader, options: { publicPath: '../' } },
					{ loader: 'css-loader', options: { importLoaders: 1 } },
					'postcss-loader',
					{ loader: 'less-loader', options: { javascriptEnabled: true } }
				]),
				include: path.join(NODE_MODULES_DIR, 'antd', 'es'),
				exclude: SOURCE_DIR
			},
			{
				test: /\.less$/,
				use: (isDevelopment ? [ 'css-hot-loader' ] : []).concat([
					{ loader: MiniCssExtractPlugin.loader, options: { publicPath: '../' } },
					{ loader: 'css-loader', options: { modules: true, importLoaders: 1 } },
					'postcss-loader',
					{ loader: 'less-loader', options: { javascriptEnabled: true } }
				]),
				include: SOURCE_DIR,
				exclude: path.join(NODE_MODULES_DIR, 'antd', 'es')
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: { limit: 2048, name: 'assets/[name].[ext]' }
					}
				]
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
				use: [ { loader: 'url-loader', options: { limit: 8192, name: 'assets/[name].[ext]' } } ]
			},
			{
				test: /\.(graphql|gql)$/,
				exclude: /node_modules/,
				loader: 'graphql-tag/loader'
			}
		]
	},
	//webpack4.x的最新优化配置项，用于提取公共代码
	optimization: {
		splitChunks: {
			//chunks: 'initial', // 只对入口文件处理
			cacheGroups: {
				// commons: {
				// 	chunks: 'initial', //表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
				// 	name: 'common', //拆分出来块的名字(Chunk Names)，默认由块名和hash值自动生成
				// 	minChunks: 2, //表示被引用次数，默认为1
				// 	maxInitialRequests: 5, // The default limit is too small to showcase the effect
				// 	minSize: 0, // 表示在压缩前的最小模块大小，默认为0
				// 	reuseExistingChunk: true // 可设置是否重用该chunk（查看源码没有发现默认值）
				// }
				// 将第三方模块提取出来---针对多入口应用
				//split `node_modules`目录下被打包的代码到 `vendor.js && .css` 没找到可打包文件的话，
				//则没有。css需要依赖 `ExtractTextPlugin`
				// commons: {
				// 	test: NODE_MODULES_DIR,
				// 	chunks: 'initial',
				// 	name: 'common',
				// 	priority: 10, // 优先
				// 	enforce: true
				// }
			}
		}
	},
	plugins: (isDevelopment
		? []
		: [ new OptimizeCSSPlugin({ cssProcessorOptions: { safe: true } }) ]).concat([
		new HappyPack({
			id: 'jsx',
			threadPool: threadPool,
			loaders: [
				{
					loader: 'babel-loader',
					options: {
						presets: [ 'react', [ 'env', { module: false } ], 'stage-0' ],
						plugins: [
							'transform-decorators-legacy',
							[ 'import', { libraryName: 'antd', libraryDirectory: 'es', style: true } ]
						] // `style: true` 会加载 less 文件]
					}
				}
			]
		}),
		new CleanPlugin([ 'build' ], {
			root: ROOT_DIR, // 一个根的绝对路径.
			verbose: true, // 开启在控制台输出信息
			dry: false, // 不要删除任何东西，主要用于测试.
			exclude: [ 'vendor' ] // 排除不删除的目录，主要用于避免删除公用的文件
		}),
		new CopyWebpackPlugin([
			{
				from: path.join(SOURCE_DIR, 'assets'),
				to: path.join(BUILD_DIR, 'assets')
			}
		]),
		new webpack.DllReferencePlugin({
			manifest: path.join(BUILD_DIR, 'vendor', 'manifest.json')
		}),
		new HtmlPlugin({
			minify: {
				html5: true
			},
			hash: false,
			template: path.join(SOURCE_DIR, 'index.html'),
			filename: 'index.html',
			chunks: [ 'common', 'app' ],
			vendor: '/vendor/vendor.dll.js', //注意publicPath
			inject: 'body'
		}),
		new MiniCssExtractPlugin({
			filename: 'css/[name][chunkhash:16].css'
		}),
		new ProgressBarPlugin({
			format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)'
		})
	])
};

module.exports = config;
