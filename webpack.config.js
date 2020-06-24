const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');

const clientConfig = {
    mode: 'development',
    devtool: "cheap-module-source-map",
    entry: {
        client: './client/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        publicPath: 'public'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/i,
                exclude: /node_modules/,
                use: [
                    // 'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // publicPath: 'public',
                            hmr: true,
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: true,
                            import: true,
                        }
                }]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.css']
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: '[name].css' }),
        new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
        }),
    ]
};

const serverConfig = {
    mode: 'development',
    entry: './server.js',
    target: "node",
    externals: [nodeExternals()],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            // {
            //     test: /\.css$/i,
            //     exclude: /node_modules/,
            //     use: [
            //         // {
            //         //     loader: 'style-loader'
            //         // },
            //         MiniCssExtractPlugin.loader,
            //         {
            //             loader: 'css-loader',
            //             options: {
            //                 modules: true,
            //                 sourceMap: true,
            //                 import: true,
            //             }
            //     }]
            // }
            {
                test: /\.css$/i,
                exclude: /node_modules/,
                use: [ 'null-loader' ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.css'],
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false
        })
    ]
};

module.exports = [clientConfig, serverConfig];
