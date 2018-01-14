/**
 * Created by Andy on 2017/10/25.
 */
const path = require("path");
const webpack = require("webpack");

const hostDist = path.join(__dirname);
const DBDist = path.join(__dirname,"DB");
const serverDis = path.join(__dirname, "server");
const publicDist = path.join(__dirname,"public");

var server = {
    target: "node"
};

server.entry = path.resolve(serverDis, "index.js");

server.output = {
    publicPath: path.join(hostDist),
    path: path.join(serverDis),
    filename: 'bundle.node.js'
};

server.plugins = [
    /*  new webpack.optimize.UglifyJsPlugin({
     compress:{
     warnings:true
     }
     })*/
];
server.node = {
    __filename: true,
    __dirname: true
};
server.resolve = {
    extensions: ['.js', '.json', '.css', '.scss'] //����ڴ˵ĺ�׺����Ӧ���ļ�����ʡ�Ժ�׺
    //ģ��������壬�������ֱ�����ñ����������д�����ĵ�ַ
    ,alias: {
        StorageRegister$: path.join(publicDist, 'plugin/StorageRegister/StorageRegister.js')
        , publicDist: path.join(publicDist)
        , DB: path.join(DBDist)
        , wsServer: path.join(__dirname, 'server/socket')
    }
};


module.exports = server;