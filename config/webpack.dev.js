const path = require('path');
const merge = require("webpack-merge");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const getLessVariables = require("./get-less-variables");

module.exports = merge({}, {
    mode: 'development',
    devtool: "inline-source-map",
    entry: { main: './src/index.js' },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'main.js'
    },
    devServer: {
        contentBase: path.join(__dirname, '../dist'),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":
                "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers":
                "X-Requested-With, content-type, Authorization"
        },
        compress: true,
        host: "127.0.0.1",
        port: 9966
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            sourceMap: true
                        }
                    },
                    "postcss-loader"
                ]
            },
            {
                test: /.less$/,
                use: [
                    "css-loader",
                    "postcss-loader",
                    {
                        loader: "less-loader",
                        options: {
                            strictMath: false,
                            noIeCompat: true,
                            javascriptEnabled: true,
                            globalVars: getLessVariables(
                                "./src/styles/theme.less"
                            ),
                            modifyVars: {
                                "primary-color": "#2a8cff"
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            inject: true
        })
    ]
});

