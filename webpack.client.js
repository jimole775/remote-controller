/**
 * Created by Andy on 2017/10/25.
 */

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const webClient = {
    entry: [
        "babel-polyfill",
        path.join(__dirname, "public/css/base.scss"),
        path.join(__dirname, "client/src/app/index.js")
    ],
    target: "web",

    output: {
        //publicPath: "../",   //cdn��Դ���ص�ͳһ·��
        path: path.join(__dirname, "client/src"),  //webpack����ļ���ͳһ���·��
        filename: 'assets/js/bundle.js'
    }
};

webClient.plugins = [
    new HtmlWebpackPlugin({
        title: 'RMT',
        template: path.join(__dirname, 'client/src/app/index.html'),
        filename: path.join(__dirname, 'client/src/index.html'),
        inject: 'body',
        favicon: path.join(__dirname, 'client/src/favicon.ico')
    }),
    new webpack.DllReferencePlugin(
        {
            context: __dirname,
            manifest: require('./public/lib/manifest.json')
        }
    )/*,
     new webpack.optimize.UglifyJsPlugin({
     compress: {
     warnings: false
     }
     })*/
    , new ExtractTextPlugin({
        filename: "assets/css/bundle.css",
        allChunks: true
    })
];

webClient.resolve = {

    //�Զ���չ�ļ���׺������ζ������requireģ�����ʡ�Բ�д��׺��
    extensions: ['.js', '.json', '.scss'],

    //ģ��������壬�������ֱ�����ñ����������д�����ĵ�ַ
    alias: {
        SimulateSlider$: path.join(__dirname, 'public/plugin/SimulateSlider/SimulateSlider.js')     //����ֱ�� require('SimulateSlider') ����
        , StorageRegister$: path.join(__dirname, 'public/plugin/StorageRegister/StorageRegister.js')
        , client: path.join(__dirname,'client')

        , wsClient: path.join(__dirname, 'client/src/app/webSocket.client.io')

        //, RMTDistributor$: path.join(__dirname, 'client/src/app/services/remote.distributor/distributor/distributor.js')
    }
};


module.exports = webClient;