// var webpack = require('webpack');
//运行服务器时，在内存中生成mobileBuild，由webpackDevMiddleware 服务器来管理mobileBuild 以及热加载后文件的更新
// var webpackDevMiddleware = require('webpack-dev-middleware');
// var webpackHotMiddleware = require('webpack-hot-middleware');
// var config = require('./webpack_config/webpack.config.mobile');
var path = require('path');
var express = require('express');

var app = express();
// var port = 8093;

// var compiler = webpack(config);
// app.use(webpackDevMiddleware(compiler, {
//     noInfo: true, publicPath: config.output.publicPath
// }));
// app.use(webpackHotMiddleware(compiler));

app.use("/lib", express.static(__dirname + '/lib'));
app.use("/html/lib", express.static(__dirname + '/lib'));

app.use('/html/:filename', function(req, res) {
    var filename = req.params.filename;
    res.sendFile(path.join(__dirname, filename))
});

app.listen(port, function(error) {
    if (error) {
        console.error(error)
    } else {
        console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
    }
});