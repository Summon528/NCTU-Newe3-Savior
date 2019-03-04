const path = require('path');

module.exports = {
    devtool: 'inline-source-map',
    entry: {
        'index': './src/index.ts',
        'hide_loading': './src/hide_loading',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
};
