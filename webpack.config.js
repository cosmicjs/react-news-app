
const appConfig = require('./config');

const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
	entry: './app/app.js',
	output: {
		path: path.join(__dirname, './build'),
		publicPath: '/',
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				options: {
					presets: ['es2015', 'react']
				}
			},
			{
				test: /\.less$/,
				loader: ExtractTextPlugin.extract({
					use: [{
						loader: 'css-loader'
					}, {
						loader: 'less-loader'
					}],
					fallback: 'style-loader'
				})
			}
		]
	},
	plugins: [
		new HtmlPlugin({
			title: appConfig.title,
			template: './app/app.html'
		}),
		new ExtractTextPlugin('styles.css')
	]
}

module.exports = config;
