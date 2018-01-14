/**
 * Created by Andy on 2017/12/20.
 */
import main from "./main/main.js";
import loading from "./chunks/loading/loading.js";
import tips from "./chunks/tips/tips.js";
import warns from "./chunks/warns/warns.js";
import prompt from "./chunks/prompt/prompt.js";
import alertInterface from "./interface/Alert.js";
import $ from "jquery";
export default angular.module("ngTool.alert", [])

    // alertPluginģ�����componentsģ�崦Ƕ��
    .directive("alertPlugin",main)
        .directive("loading",loading)
        .directive("warns",warns)
        .directive("tips",tips)
        .directive("prompt",prompt)