const webpack = require("webpack");
const path = require("path");
const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const getLessVariables = require("./get-less-variables");

function resolve(dir) {
    return path.join(__dirname, "..", dir);
}

module.exports = merge({}, {
    mode: "production",
    // devtool: "source-map",
    performance: {
        hints: "warning"
    },
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "../public/build/[hash:16]"),
        chunkFilename: "js/[name].js"
    },
    // 抽取公有代码
    optimization: {
        runtimeChunk: {
            name: "js/manifest"
        },

        splitChunks: {
            chunks: "async", //必须三选一： "initial" | "all"(推荐) | "async" (默认就是async)
            minSize: 30000, //压缩前的最小大小
            maxSize: 0, //压缩前的最小大小
            minChunks: 1, //引用次数
            maxAsyncRequests: 5, // 最大异步请求数， 默认5
            maxInitialRequests: 3, // 最大初始化请求数，默认3
            automaticNameDelimiter: "~", // 打包分隔符
            name: true, //默认为 true，表示自动生成文件名，打包后的名称，此选项可接收 function

            // 缓存组
            cacheGroups: {
                commons: {
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "initial",
                    name: "vendor",
                    priority: 10,
                    enforce: true
                },
                styles: {
                    name: "styles",
                    test: /\.css|less$/,
                    chunks: "all",
                    enforce: true,
                    priority: 20
                }
            }
        },
        minimizer: [
            new UglifyJsPlugin({
                test: /\.js($|\?)/i,
                include: path.join(__dirname, "/../src"),
                sourceMap: true,
                parallel: true,
                cache: true,
                uglifyOptions: {
                    ie8: false,
                    ecma: 8
                }
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "./"
                        }
                    },
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
                test: /.less$/, // antd 中的less
                include: resolve("node_modules"),
                // exclude: [/src/],
                // include: path.resolve(__dirname, 'node_modules/antd'),
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "./"
                        }
                    },
                    "css-loader",
                    "postcss-loader",
                    {
                        loader: "less-loader",
                        options: {
                            strictMath: false,
                            noIeCompat: true,
                            javascriptEnabled: true,
                            modifyVars: {
                                "primary-color": "#2a8cff"
                            }
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                include: path.join(__dirname, "/../src"),
                // exclude: [/node_modules/],
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            // modules: true,
                            // localIdentName: '[local]--[hash:base64:5]',
                            // importLoaders: 2,
                        }
                    },
                    "postcss-loader",
                    {
                        loader: "less-loader",
                        options: {
                            strictMath: false,
                            noIeCompat: true,
                            javascriptEnabled: true,
                            globalVars: getLessVariables(
                                "./src/styles/theme.less"
                            )
                        }
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(
            path.resolve(__dirname, "../public/build"),
            {
                root: path.resolve(__dirname, "../"), // 设置root
                verbose: true
            }
        ),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "index.html",
            chunksSortMode: function(chunk1, chunk2) {
                return chunk1.id - chunk2.id;
            },
            minify: {
                collapseWhitespace: true
            }
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].css"
        }),
        new webpack.HashedModuleIdsPlugin()
    ]
});
