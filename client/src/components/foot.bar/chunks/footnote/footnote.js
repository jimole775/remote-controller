/**
 * Created by Andy on 2017/11/12.
 */
import tpl from "./footnote.jade";
import "./footnote.scss";

export default function () {
    return {
        restrict: "EA",
        replace: true,
        //link:linkBind,
        controller: Ctrl,
        template: tpl()
    }
}

class Ctrl {
    constructor($scope, $rootScope) {
        "ngInject";
        $scope.progressHints = "";
        //let boxid = "";
        $rootScope.$on("progressHints", function (scope) {
            $scope.progressHints = scope.targetScope[scope.name];
        });

        //$scope.$emit ("progressHints");
       /* if (typeof active === "string") {                 //����ֻ����������ʱ�����
            boxid = active;
            active = null;
        }

        var tool = this;
        var logCount = 0;
        var id = boxid || "ShowStatusMessage";
        var box = document.getElementById(id);
        var isDucBoxid = false;

        if (!message) {                                   //����ֶ��ÿ��ı���������ʱ��Ҳ�ɵ���
            clearInterval(tool.timer);
            box.innerText = "";
            tool.timer = null;
            return;
        }

        if (!tool.statuBarBoxids)tool.statuBarBoxids = [];
        var len = tool.statuBarBoxids.length;
        while (len--) {
            if (boxid === tool.statuBarBoxids[len]) {
                isDucBoxid = true;
                tool.statuBarBoxids.splice(len);
                break;
            }
        }
        tool.statuBarBoxids.push(boxid);


        //һ�������������Ҫע�⣺
        // 1��statuBar�������ڶദ�ط�ʹ�ã������active�����������ʱ��������Ҫ���һ�����������Ǳ��봦����ͬ�ĺ����е�ʱ���ٴ���
        //      ���ֱ���жϣ��ᵼ��ֻ�����һ��ʹ��statuBar�����ĵط���Ч��
        // 2���뵽��˵...
        if (isDucBoxid && !active) {
            clearInterval(tool.timer);
        }

        box.innerText = message;
        logCount = 0;
        if (active) {
            clearInterval(tool.timer);                 //�������������ʱ����
            tool.timer = setInterval(function () {
                var mod = logCount % 4;
                var suffixMessage = '';
                for (var i = 0; i < mod; i++) {
                    suffixMessage += '.';
                }
                box.innerText = message + suffixMessage;
                logCount++;
            }, 450);
        }*/
    }
}