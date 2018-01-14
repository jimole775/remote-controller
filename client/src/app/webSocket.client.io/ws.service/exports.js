/**
 * Created by Andy on 2017/12/16.
 */

import openHandler from "./recv.handler/on.open/open.js";
import closeHandler from "./recv.handler/on.close/close.js";
import errHandler from "./recv.handler/on.err/err.js";
import msgHandler from "./recv.handler/on.message/host.js";
import emitHandler from "./emit.handler/emitHandler.js";

/**
 * ��wsע��ɷ����Ŀ�����ڣ�
 * ����ʹ�� $rootScope.$emit ʵʱˢ�»�ȡ�����ݸ�����ģ��ʹ��
 * */
export default function service($rootScope, ngTool, wsTool, userStorage, charState) {
    "ngInject";

    let that = this;
    let wsService = new WebSocket("ws://127.0.0.1:1111");

    // �����wsService���ṩ��ng-serviceע��֮ǰ��ģ��ʹ�õ�
    this.emit = wsService.emit = function (...arg) {
        let blob = emitHandler.query.apply(emitHandler, arg);
        wsService.send(blob);
        return that;
    };

    this.wsService = wsService;
    this.openHandler = openHandler;
    this.errHandler = errHandler;
    this.closeHandler = closeHandler;
    this.msgHandler = msgHandler;

    this.reConnect = function (url) {
        that.wsService = new WebSocket(url);
        that.bindListener();
    };

    // ������һ����   �����ṩ websocket �������Ƶ�
    this.scopeParams = {$rootScope, wsService, ngTool, wsTool, userStorage, charState};
    this.bindListener = function () {
        that.wsService.onopen = function (res) {
            that.openHandler(Object.assign({response: res}, that.scopeParams))
        };
        that.wsService.onerror = function (res) {
            that.errHandler(Object.assign({response: res}, that.scopeParams))
        };
        that.wsService.onclose = function (res) {
            that.closeHandler(Object.assign({response: res}, that.scopeParams))
        };
        that.wsService.onmessage = function (res) {
            that.msgHandler(Object.assign({response: res}, that.scopeParams))
        };
    };

    return this.bindListener();
}