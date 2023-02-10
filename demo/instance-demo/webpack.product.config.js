const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')
 module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, './src/main.js'),
    output: {
        filename: 'textgroup-demo-bundle.js',
        path: path.resolve(__dirname, 'dist'),

    },
    // resolve: {
    //     alias: {
    //       '@joskii/jflow': path.resolve(__dirname, '../src/index.js'),
    //     },
    // },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: 'textgroup-demo.html',
            template: path.resolve(__dirname, './src/index.html')
        }),
    ],
 };