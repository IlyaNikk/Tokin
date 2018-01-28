'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: [
        './public/mech.js'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: path.join('assets', 'js', 'bundle.js'),
        publicPath: '/'
    },
    module: {
        loaders: [
            {
                test: /node_modules/,
                loader: 'ify-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include:[
                    path.join(__dirname, 'public'),
                ],
                query: {
                    presets: ['env'],
                }
            }, {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }
        ]
    },
    resolve: {
        alias: {}
    }
    ,
    plugins: [
        new CleanWebpackPlugin('dist'),
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'public', 'mech.html')
        }),
        new CopyWebpackPlugin([{
            from: path.join(__dirname, 'node_modules', 'gl-plot3d', 'lib', 'vertex.glsl'),
            to: path.join(__dirname, 'dist')
        }]),
        new CopyWebpackPlugin([{
            from: path.join(__dirname, 'node_modules', 'gl-plot3d', 'lib', 'composite.glsl'),
            to: path.join(__dirname, 'dist')
        }])
    ]
}
;