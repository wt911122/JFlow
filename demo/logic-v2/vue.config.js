const path = require('path');
module.exports = {
    indexPath: 'logic-v2-demo.html',
    publicPath: '',
    chainWebpack(config) {
        console.log(path.resolve(__dirname, '../../index.js'))
        config.resolve.alias
            .set('@joskii/jflow', path.resolve(__dirname, '../../src/index'));
    }
}