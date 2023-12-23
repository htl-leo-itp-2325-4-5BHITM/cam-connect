const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const baseHref = "/";

module.exports = {
    entry: './src/index.ts',
    mode: "development",
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                exclude: [/\.styles.scss$/, /node_modules/],
                use: [
                    { loader: "style-loader" },
                    { loader: "css-modules-typescript-loader"},
                    { loader: "css-loader", options: { modules: true } },
                    { loader: "sass-loader" },
                ]
            },
            {
                test: /\.styles.scss$/,
                exclude: /node_modules/,
                use: [
                    "sass-to-string",
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                outputStyle: "compressed",
                            },
                        },
                    },
                ],
            },
        ]
    },
    devtool: "cheap-module-source-map",
    resolve: {
        extensions: ['.ts', '.js', '.scss'],
        alias: {
            Model: path.resolve(__dirname, "src/model")
        }
    },
    output: {
        filename: 'bundle-[fullhash].js',
        path: path.resolve(__dirname, './target'),
        publicPath: "/"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "index.html",
            filename: "index.html"
        }),
        new webpack.EnvironmentPlugin({
            BASE_HREF: baseHref
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, '/'),
        },
        compress: true,
        port: 4200,
        proxy: {
            '/api': 'http://localhost:8080',
        },
        historyApiFallback: true
    }
};