/**
 * Created by Andy on 2017/10/31.
 */
import scrollHandler from "events/scroll/scroll.handler.js";
import mouseHandler from "events/mouse/mouse.handler.js";
import multiHandler from "package.encode/multi/multi.handler.js";
import singleHandler from "package.encode/single/single.handler.js";
//import $ from "jQuery";

let dataEmitter = function(type, fnName, params){
    var [success,result] = [false,null];
    switch(type){
        case "scroll":
            [success,result] = scrollHandler(fnName, params);
            break;
        case "mouse":
            [success,result] = mouseHandler(fnName, params);
            break;
        case "multi":
            [success,result] = multiHandler(fnName, params);
            break;
        case "single":
            [success,result] = singleHandler(fnName, params);
            break;
    }

    if(success)
        external.SendRMTEventToApp(result);
    else
        console.log("�����쳣");

};


export default dataEmitter;

(function ($) {
    var win = window;
    var body = $("body");
    var clockStart = false;
    var clocker = 0;

    var processStore = [];

    var split_mark_outer = "_!_";
    var split_mark_inner = "_|_";
    var mouseEvent = {};                           //�洢�����Ϣ
    mouseEvent.index = -1;
    mouseEvent.type = "none";
    mouseEvent.coord = {};
    mouseEvent.coord.X = 0;
    mouseEvent.coord.Y = 0;
    /**
     * Զ��Э���У�ң�ػ�֪ͨҵ�������ͬ��������
     * @param varFuncName ��������ͳһΪ�ִ���ʽ��������ȫ�ֺ�����
     * @param varParams ִ�к���ʱ��Ҫ�Ĳ����� ͳһת�� "stringJSON_|_stringJSON_|_stringJSON" ����ʽ���͸�Զ�̻�
     *                                      ��̬��������ת��
     *                                      "stringJSON_|_stringJSON_|_stringJSON_!_stringJSON_|_stringJSON_|_stringJSON"����ʽ
     * */
    win.sendRMTEventToApp = function (varFuncName, varParams) {
        var strParams, result = "",funcName, RMTClickAnimationData;

        //����ǹ����¼����;ܾ����ʹ�������꣩�¼������в�����Զ�̶˾Ͳ���ִ�е������
        //ԭ�򣺣�����������꣩�¼� �Ĳ������Ǵ� touchstart ��ȡ�ģ������¼��ض����� touchstart�����ԣ����������ش�������¼�
        if (/scroll/i.test(varFuncName)) {
            RMTClickAnimationData = "";
        }
        else {
            RMTClickAnimationData = mouseEvent.coord.X + split_mark_outer + mouseEvent.coord.Y + "," +
            mouseEvent.type + split_mark_outer + mouseEvent.index + "," +
            mouseEvent.hasScrollBar;
        }

        funcName = (varFuncName || 'String') + split_mark_inner + RMTClickAnimationData;

        //ÿ�������ݷ��Ͷ�����ϴ����¼�����ֵ�����ԣ�����һ�ξ�����һ�Σ����û����ֵ�����ʱ��Ϳ����ж�
        mouseEvent.coord.X = 0;
        mouseEvent.coord.Y = 0;
        mouseEvent.index = -1;
        mouseEvent.type = "none";
        mouseEvent.hasScrollBar = false;

        if (global.RMTID.role == 0) return;                                                  //����ҵ��ת��
        else if (/tool/.test(funcName) && global.RMTID.role == 1) return;                    //ҵ�����ת�������¼�
        else if (/moduleEntry/.test(funcName) && global.RMTID.role == 1) return;             //ҵ�����ת������¼�
        else if (/RMTClickEvent/.test(funcName) && global.RMTID.role == 1) return;           //ҵ�����ת������¼�
        else if (/jsRecvAppData/.test(funcName) && global.RMTID.role == 2) return;           //���ƻ���ת������������
        else if (/serverRequestCallback/.test(funcName) && global.RMTID.role == 2) return;   //���ƻ���ת���������ص��¼�

        switch (typeof varParams) {
            case "string":
                strParams = varParams ? varParams : "[]";
                break;
            case "object":  //����Ƕ���������߶��������ٽ������֣����ͽ��н⹹ƴ��
                if (varParams instanceof Array) {
                    varParams.forEach(function(item){
                        result += (typeof item === "object" ? JSON.stringify(item) : item) + split_mark_inner;
                    });
                    strParams = result.substring(0, result.length - 3);   //�ɵ����һ���ָ���
                }
                else if (varParams instanceof Object) {
                    strParams = JSON.stringify(varParams);
                }
                else {
                    console.log("error:Զ��ҵ��Ҫ���亯��ʵ��!!!");
                }
                break;
        }
        console.log("ת��ҵ������:", global.RMTID.role, "funcName:", funcName, typeof strParams + ":", strParams);

        /**
         * ����̬���ݡ���ͨ�����ݡ���������ʽ
         * �湻һҳ�ٽ���ת�������������豸ָ��ת��
         * ��ǰҳ������ʵʱˢ��**/
        var queryJson = getBse64Encode(strParams);
        if (/CALC_ONE_ANS/i.test(funcName) ||
            /CHANNEL_DATA/i.test(funcName)) {
            win.global.RMTID.DataStream_JsonString += queryJson + split_mark_outer;                                  //��"_!_"Ϊ�ָ���,����"_|_"
            var tempStore_str = global.RMTID.DataStream_JsonString.substring(0, global.RMTID.DataStream_JsonString.length - 3);     //�ص����һ���ָ���
            var tempArr = tempStore_str.split(split_mark_outer);                                              //����ִ��飬�ж�����

            var rowsInEachPage = global.DataStream_CurPageLinesCount;       //��̬����ÿҳ��������

            if (tempArr.length >= rowsInEachPage) {
                external.SendRMTEventToApp(global.RMTID.role, funcName, tempStore_str);
                win.global.RMTID.DataStream_JsonString = "";
            }
        }

        /**��������ϡ���������֡��
         * ����Ϊ��
         * 1���ӷ�һ֡��
         * �������ݳ��ȴ���50K��ʱ��Ҳ����Ȼ�������ʱ��**/
        else if (/DTC_simple/i.test(funcName) ||
            /FREEZE_RESULT/i.test(funcName)) {
            win.global.RMTID.DataStream_JsonString += queryJson + split_mark_outer;

            if (global.RMTID.DataStream_JsonString.length >= 50000) { //������ݳ��ȴ���50K����һ���Է��ͳ�ȥ�����򣬾ͽ���1�뵹��ʱ
                clearTimeout(clocker);
                external.SendRMTEventToApp(global.RMTID.role, funcName,
                    win.global.RMTID.DataStream_JsonString.substring(0, global.RMTID.DataStream_JsonString.length - 3));
                win.global.RMTID.DataStream_JsonString = "";

            }
            else {

                if (!clockStart) {        //��ʱ�����û�������ͽ���setTimeout
                    clockStart = true;
                    clocker = setTimeout(function () {
                        clockStart = false;

                        if (global.RMTID.DataStream_JsonString) {
                            external.SendRMTEventToApp(
                                global.RMTID.role,
                                funcName,
                                win.global.RMTID.DataStream_JsonString.substring(0, global.RMTID.DataStream_JsonString.length - 3)
                            );
                            win.global.RMTID.DataStream_JsonString = "";
                        }

                    }, 1000);
                }
            }
        }

        /**������Ŀ������������һ�Σ�����һ֡**/
        else {
            external.SendRMTEventToApp(global.RMTID.role, funcName, queryJson);
        }
    };

})(jQuery);

