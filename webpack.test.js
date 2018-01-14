/**
 * Created by Andy on 2017/11/7s.
 */
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");
let test = {
    entry: "./test/useage.js",
    output: {path: __dirname + "/test", filename: "bundle.[chunkHash:5].js"},
    target: "web",
    resolve: { //�Զ���չ�ļ���׺������ζ������requireģ�����ʡ�Բ�д��׺��
        extensions: ['.js', '.json', '.scss'],

        //ģ��������壬�������ֱ�����ñ����������д�����ĵ�ַ
        alias: {
            SimulateSlider$: path.join(__dirname, 'public/plugin/SimulateSlider/SimulateSlider.js')     //����ֱ�� require('SimulateSlider') ����
            , StorageRegister$: path.join(__dirname, 'public/plugin/StorageRegister/StorageRegister.js')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'test',
            template: path.resolve(__dirname, 'test/template.html'),
            filename: path.resolve(__dirname, 'test/index.html'),
            inject: 'head',
            favicon: './fav.jpg'
        })
        , new ExtractTextPlugin("[id].[name].css")
    ]
};
module.exports = test;