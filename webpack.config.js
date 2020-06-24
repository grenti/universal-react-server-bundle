const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');

const devMode = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');

const clientConfig = {
    mode: 'development',
    devtool: "cheap-module-source-map",
    devServer: {
        contentBase: path.resolve(__dirname, 'dist', 'public'),
        // outputPath: path.resolve(__dirname, 'dist', 'public'),
        hot: true,
    },
    entry: {
        client: './client/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist', 'public'),
        filename: '[name].bundle.js',
        publicPath: '/'
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
                            publicPath: '/',
                            hmr: true,
                            reloadAll: true,
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'local',
                                exportGlobals: true,
                                localIdentName: '[path]-[name]-[local]',
                            },
                            // onlyLocals: true,
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
        new webpack.ProgressPlugin(),
        // new CleanWebpackPlugin('public'),
        new MiniCssExtractPlugin({ filename: '[name].css' }),
        new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
        }),
        new webpack.HotModuleReplacementPlugin(),
    ]
};

const serverConfig = {
    mode: 'development',
    entry: './server.js',
    target: "node",
    externals: [nodeExternals()],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.bundle.js',
        libraryTarget: 'commonjs2',
        publicPath: '/',
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
                    // {
                    //     loader: 'style-loader'
                    // },
                    // {
                    //     loader: MiniCssExtractPlugin.loader,
                    //     options: {
                    //         publicPath: '/',
                    //         hmr: true,
                    //     }
                    // },
                    {
                        loader: 'css-loader',
                        options: {
                            onlyLocals: true,
                            modules: {
                                localIdentName: '[path]-[name]-[local]',
                            },
                            sourceMap: true,
                            import: true,
                            importLoaders: 1,
                        }
                    },
                    // {
                    //     loader: 'null-loader'
                    // }
                ]
            },
            // {
            //     test: /\.css$/i,
            //     exclude: /node_modules/,
            //     use: [ 'null-loader' ]
            // }
        ]
    },
    resolve: {
        extensions: ['.js', '.css'],
    },
    plugins: [
        new CleanWebpackPlugin({ dry: true }),
        new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false
        }),
        new webpack.ProgressPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ]
};

module.exports = [clientConfig, serverConfig];
