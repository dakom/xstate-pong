const common = require('./webpack.common.js');
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = Object.assign({}, common.config, {
	mode: "production",
    //devtool: "source-map",
    optimization: {
		minimizer: [new TerserPlugin({
			parallel: true,
            //sourceMap: true
        })]
    }
});
