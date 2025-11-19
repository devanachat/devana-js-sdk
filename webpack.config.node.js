const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: "production",
    devtool: 'source-map',
    entry: './src/index.ts',
    target: 'node',
    output: {
        filename: 'index.cjs.js',
        path: path.resolve(__dirname, 'build'),
        libraryTarget: 'commonjs2',
        clean: false
    },
    optimization: {
        minimize: false,
        minimizer: [
            new TerserPlugin({ extractComments: false }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.(m|j|t)s$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    }
};