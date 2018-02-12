/**
 * Created by Andy on 2017/8/15.
 */
const ExtractTextPlugin = require("extract-text-webpack-plugin");
let client = require("./webpack.client.js");
var server = require("./webpack.server.js");
let test = require("./webpack.test.js");

//module.exports = [client,server,test];

let $module = {
    
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                options: {presets: ["es2015"]},
                exclude: [/node_modules/,/lib/]
            },
            {
                test: /\.jade$/,
                loader: "jade-loader"
            },
            {
                test: /\.(css|scss)$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!sass-loader"
                })

            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets/images/',
                            name: '[hash].[ext]'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true
                            },
                            gifsicle: {
                                interlaced: true
                            },
                            optipng: {
                                optimizationLevel: 7
                            }
                        }

                    }]
            }
        ]
    }
};
let $devtool;
$devtool = {devtool: "cheap-module-eval-source-map"};
// $devtool = $devtool ? $devtool : {};    // 在注销devtool时，不用修改后面的代码
client = Object.assign(client, $module, $devtool);
server = Object.assign(server, $module, $devtool);
module.exports = [client,server];