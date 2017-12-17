const path = require('path');
const webpack = require('webpack');

const options = {
    entry:{
        bundle: './src/main.js'
    },
    output: {
        filename: 'index.js'
    },
    devServer: {
        open: false,
        contentBase: path.join(__dirname, './'),
        historyApiFallback: true
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }
        ],
        rules: [
            {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.(png|jpg|gif|svg)$/, loader: 'file-loader', options: {name: '[name].[ext]?[hash]'}}

        ]
    }
};

module.exports.devtool = 'inline-source-map';

module.exports = options;
