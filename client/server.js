var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config')
var path = require('path')

var ip = process.env.IP || '0.0.0.0'
var port = process.env.PORT || 3000

function start () {
  new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    host: ip,
    stats: false,
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'public')
  }).listen(port, ip, function (err, result) {
    if (err) {
      return console.log(err)
    }

    console.log('Listening at http://' + ip + ':' + port)
  })
}

module.exports = { start: start }

if (!module.parent) {
  start()
}
