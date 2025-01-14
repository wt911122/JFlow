const path = require('path');
module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, '../src/index.js'),
    output: {
        filename: 'jflow.bundle.js',
        library: {
            name: '@joskii/jflow',
            type: 'umd',
        },
    },
    devtool: 'eval-source-map',
    module: {
       rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                    presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}