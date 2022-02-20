const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    mode: "development",
    devtool: "source-map",
    entry: "./src/scripts/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    devServer: {
        static: {
            directory: path.resolve("src"),
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: [/\.vert$/, /\.frag$/],
                use: "raw-loader",
            },
            {
                test: /\.(gif|png|mp3|jpe?g|svg|xml)$/i,
                use: "file-loader",
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                use: {
                    loader: "file-loader",
                    options: {
                        outputPath: "assets/fonts/",
                        name: "[name][hash].[ext]",
                    },
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            root: path.resolve(__dirname, "../"),
        }),
        new webpack.DefinePlugin({
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true),
        }),
        new HtmlWebpackPlugin({
            template: "./index.html",
        }),
    ],
};
