const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const shared = {
    mode: 'production',
    devtool: 'source-map',
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.(m|j|t)s$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
    },
    optimization: {
        minimize: false,
    },
};

module.exports = [
    // CommonJS - Node.js `require()`
    {
        ...shared,
        target: 'node',
        output: {
            filename: 'index.cjs.js',
            path: path.resolve(__dirname, 'build'),
            library: {type: 'commonjs2'},
        },
    },
    // ES module - bundlers and Node.js `import`
    {
        ...shared,
        target: ['web', 'es2018'],
        experiments: {outputModule: true},
        output: {
            filename: 'index.mjs',
            path: path.resolve(__dirname, 'build'),
            library: {type: 'module'},
            module: true,
        },
    },
    // UMD - `<script>` tag, exposes the global `Devana`
    {
        ...shared,
        target: 'web',
        output: {
            filename: 'index.umd.js',
            path: path.resolve(__dirname, 'build'),
            library: {name: 'Devana', type: 'umd'},
            globalObject: 'this',
        },
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin({extractComments: false})],
        },
    },
];
