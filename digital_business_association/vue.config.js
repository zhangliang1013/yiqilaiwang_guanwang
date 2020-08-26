const Timestamp = new Date().getTime();
module.exports = {
	baseUrl: '/g/',
	outputDir: 'g',
	// indexPath: './index.html',
	lintOnSave: false,
	productionSourceMap: false,
	devServer: {
		port: 8043,
	// 	proxy: {
	// 		'/api': {
	// 			target: 'https://c.y.qq.com',//目标地址
	// 			ws: true, //// 是否启用websockets
	// 			changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
	// 			pathRewrite: {'^/api': '/'}    //这里重写路径
	// 		}
	// 	}
	},
	configureWebpack: { // webpack 配置
		output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
			// filename: './js/'+`[name].[chunkhash].${Timestamp}.js`,
			// chunkFilename: './js/'+`[name].[chunkhash].${Timestamp}.js`
		},
	}
}
