const path = require('path');
module.exports = {
    chainWebpack(config) {
        console.log(path.resolve(__dirname, '../../index.js'))
        config.resolve.alias
            .set('@joskii/jflow', path.resolve(__dirname, '../../index.js'));
    }
}