require('dotenv').config();

const common = require('./webpack.common.js');
const path = require('path');
const webpack = require('webpack');

module.exports = Object.assign({}, common.config, {
	mode: "development",
    devtool: "inline-source-map",
	devServer: {
        //contentBase: path.join(__dirname, "dist/"),
        contentBase: path.resolve(__dirname, './site'),
        compress: true,
        port: 3001,
        headers: { "Access-Control-Allow-Origin": "*" },
        historyApiFallback: {
            disableDotRule: true
        },
        watchContentBase: true,
    },
});
