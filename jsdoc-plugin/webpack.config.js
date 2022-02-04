const path = require('path');
module.exports = {
    mode: 'production',
    entry: './er-graph.js',
    output: {
        filename: 'ergraphbundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
}