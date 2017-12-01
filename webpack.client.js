/**
 * Created by Andy on 2017/10/25.
 */

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const clientDist = path.resolve(__dirname, "client");
const publicDist = path.resolve(__dirname, "public");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const webClient = {
    entry: [
        "babel-polyfill",
        path.resolve(publicDist, "css/base.scss"),
        path.resolve(clientDist, "src/template.js")
    ],
    target: "web",

    output: {
        publicPath: "../src/",   //cdn��Դ���ص�ͳһ·��
        path: path.resolve(clientDist, "src"),  //webpack����ļ���ͳһ���·��
        filename: 'assets/js/bundle.[chunkHash:5].js'
    }
};

webClient.plugins = [
    new HtmlWebpackPlugin({
        title: 'RMT',
        template: path.resolve(clientDist, 'src/template.html'),
        filename: path.resolve(clientDist, 'src/index.html'),
        inject: 'body',
        favicon: path.resolve(clientDist, 'src/fav.jpg')
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
        filename: "assets/css/bundle.[chunkHash:5].css",
        allChunks: true
    })
];

webClient.resolve = {

    //�Զ���չ�ļ���׺������ζ������requireģ�����ʡ�Բ�д��׺��
    extensions: ['.js', '.json', '.scss'],

    //ģ��������壬�������ֱ�����ñ����������д�����ĵ�ַ
    alias: {
        SimulateSlider$: path.join(publicDist, 'plugin/SimulateSlider/SimulateSlider.js')     //����ֱ�� require('SimulateSlider') ����
        , StorageRegister$: path.join(publicDist, 'plugin/StorageRegister/StorageRegister.js')
        //, JrollDefaultOption$: path.join(publicDist, 'plugin/JrollDefaultOption/JrollDefaultOption.js')
        , RMT$: path.join(clientDist, 'webSocket/remote.router/RMTDistributor/RMTDistributor.js')
        , publicDist: path.join(publicDist)
        , clientDist: path.join(clientDist)
    }
};


module.exports = webClient;