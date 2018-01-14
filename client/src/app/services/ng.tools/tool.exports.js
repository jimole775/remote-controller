/**
 * Created by Andy on 2017/12/2.
 */

import safeApply from "./safe.apply/safeApply.js";
import Layout from "./layout/Layout.js";
import Drag from "./drag/Drag.js";
import alertModule from "./alert/alert.exports.js";
import alertInterface from "./alert/interface/Alert.js";
import jroll from "./jroll/jroll.js";

export default angular.module("ngTool", [alertModule.name])
    .factory("ngTool", function () {
        "ngInject";
        let scope = {};
        return {

            // ���غ���������ֱ�ӵ���
            safeApply: function (fn) {
                safeApply(scope,fn);
                return this;
            },

            // safeApply��ǰ��������������ע�����л�����scope
            injectScope: function (_scope) {
                scope = _scope;
                return this;
            },

            // ���ع��캯����ʹ��ʱ���õ�ȫ�Ǿ�̬����
            layout:Layout,

            // ���ع��캯����ʹ��ʱ��Ҫʵ����
            Drag:Drag,

            // ���غ�����ֱ�ӵ���
            jroll:jroll,

            // ����ʵ����ֱ�ӵ���
            alert:alertInterface
        }
    })