const Timestamp = new Date().getTime();
module.exports = {
	lintOnSave: false,
	productionSourceMap: false,
	devServer: {
		port: 8093,
	},
	configureWebpack: { // webpack 配置
		output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
			// filename: 'js/'+`[name].[chunkhash].${Timestamp}.js`,
			// chunkFilename: 'js/'+`[name].[chunkhash].${Timestamp}.js`
		},
	}
}
