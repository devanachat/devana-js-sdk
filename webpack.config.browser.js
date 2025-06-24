const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "production",
    devtool: 'source-map',
    entry: './src/index.ts',
    target: 'web',
    output: {
        filename: 'index.umd.js',
        path: path.resolve(__dirname, 'build'),
        library: "PservClient",
        libraryTarget: 'umd',
        globalObject: 'this',
        clean: false
    },
    optimization: {
        minimize: true,
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
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: { esmodules: true } }],
                            '@babel/preset-typescript'
                        ],
                        plugins: [

                        ]
                    }
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader", options: { sourceMap: true } },
                ],
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'index.css',
        }),
    ],
    resolve: {
        extensions: ['.ts', '.js', '.json']
    }
};