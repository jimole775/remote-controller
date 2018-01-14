/**
 * Created by Andy on 2017/10/31.
 */

(function ($) {
    var win = window;
    var doc = document;
    var body = $("body");
    var split_mark_outer = "_!_";
    var split_mark_inner = "_|_";

    /**
     * ����APPң�ػ��� ��ťͬ�� ָ��
     * @param action        1:���ƶ˷��������� 2��ҵ��˷��������� 3����ʾ�������� ҵ����������� ��ֱ���˳� 4����ʾ���粻�ȶ�����ʾ�û��Ƿ����Զ��

     * @param varFuncName   ������������Ϊ�ִ�
     * @param varParams     ִ�к���ʱ��Ҫ�Ĳ��������ݸ�ʽΪ "stringJSON_|_stringJSON_|_stringJSON"
     *                                         ��̬��������ʽ "stringJSON_|_stringJSON_!_stringJSON_|_stringJSON"
     *                                         ���Ϸ�����Ҫ��Ϊ�˼��ݵ����������� \" ת���ʱ,����JSON.stringify���ת�����ʧ��BUG
     * */

    win.RecvRMTEventFromApp = function (action, varFuncName, varParams) {

        //Զ�����ݶ������ִ�����ʽ���룬����Ҫʹ�����֣�����Ҫת��һ��
        var action_int = parseFloat(action);

        var funcName = "";
        //ת���ĺ�������ʱ����Ҫƴ��_|_
        if (/_|_/.test(varFuncName)) {

            //��ȡ������ ����¼�����(�ٷֱ�)
            funcName = varFuncName.split("_|_")[0];

            //Զ�̵����������Ҫ�����ݶ�ƴ���ں�����֮��ִ��Զ�̵���¼�֮ǰ�������
            var RMTClickAnimationData = varFuncName.split("_|_")[1];

        }
        else {
            funcName = varFuncName;
        }

        switch (action_int) {
            case 1:
                decodeRMTDataPackage(funcName, varParams);
                break;
            case 2:
                if (RMTClickAnimationData) {
                    runClickAnimationFirst(funcName, RMTClickAnimationData, varParams);                //ҵ������յ�����ʱ��һ��ֻ�е���¼�����ҵ�������ִ�е������
                }
                else {
                    decodeRMTDataPackage(funcName, varParams);
                }
                break;
            case 3:
                errHandlerAct3();
                break;
            case 4:
                errHandlerAct4();                  //���������쳣��֪ͨ˫���Ͽ�Զ��ҵ��
                break;
            case 5:
                uncommunicateForNativeAct5();      //֪ͨҵ���ȡ��Զ�̻Ự���������ֲ㣩�����ƻ������쳣�������˳���APP���ݴ˶˿�֪ͨҵ����ֶ��˳�
                break;
            case 6:
                networkDelayAct6(funcName);     //��ȡ�����ӳ٣���ʾ�����Ͻ�
                break;
            default :
                break;
        }
    };

    function HiddenRMTCover() {
        var RMTCover = document.getElementById("RMTCover");
        if (RMTCover) RMTCover.style.display = "none";
    }

    function ShowRMTCover() {
        var RMTCover = document.getElementById("RMTCover");
        if (RMTCover) RMTCover.style.display = "block";
    }

    /*function decodeRMTDataPackage(varFuncName, varParams) {
        var func = eval(varFuncName) || function () {};

        var RMTParams_strArr = [],                                          //�洢split(_|_)���
            wholePageData_strAry = [],                                      //��̬������--�洢split(_!_)�Ľ��
            singleData_strAry = [],                                         //��̬������--�洢split(_!_)֮����split(_|_)�Ľ��
            RMTParams_objArr = [],                                          //����applyʹ�ò���
            len, innerLen, i, j, deCodeParams;

        try {
            if (/CALC_ONE_ANS/i.test(varFuncName) ||
                /CHANNEL_DATA/i.test(varFuncName) ||
                /DTC_simple/i.test(varFuncName) ||
                /FREEZE_RESULT/i.test(varFuncName)
            ) {
                //�ӡ�_!_�����ȡ�����в�����base64�ִ���
                wholePageData_strAry = varParams.split(split_mark_outer);
                i = 0;
                len = wholePageData_strAry.length;
                while (i < len) {
                    //������base64��
                    deCodeParams = getBse64Decode(wholePageData_strAry[i++]);

                    //�ӡ�_|_�����ȡ�����в����ִ���
                    singleData_strAry = deCodeParams.split(split_mark_inner);

                    j = 0;
                    innerLen = singleData_strAry.length;
                    while (j < innerLen) RMTParams_objArr[j] = JSON.parse(singleData_strAry[j++]);

                    //ѭ���׳������˳����ӣ���CPU����ʱ��ִ��
                    func.apply(func, RMTParams_objArr);
                }
            }
            else {
                deCodeParams = getBse64Decode(varParams);
                RMTParams_strArr = deCodeParams.split(split_mark_inner);
                i = 0;
                len = RMTParams_strArr.length;
                while (i < len) {
                    RMTParams_objArr[i] = /[\[\{]/.test(RMTParams_strArr[i].substr(0, 5)) ?               //����������Ĳ�������JSON�ִ�,��֤��ֻ����ͨ�ִ�
                        JSON.parse(RMTParams_strArr[i++]) : RMTParams_strArr[i++];
                }                     //,�Ƚ�����JSON����

                //�ڴ��������ݵ�ʱ���ӳ�100���룬�����ڡ��豸��������ʱ��APP����һ�����ݣ�����޷�Ԥ�ϵ�BUG
                if (/\.CTYPE/g.test(varFuncName))
                    setTimeout(function () { func.apply(func, RMTParams_objArr); }, 100);
                else
                    func.apply(func, RMTParams_objArr);

            }
        } catch (e) {
            console.log(e.message);
            if (tool.loading.status.display) {
                tool.alert("���ݽ������ִ�������ȷ���˳�����",
                    function () {
                        win.devService.sendDataToDev("3109FF");
                    })
            }

        }
        console.log("����Զ������:", "varFuncName:", varFuncName, "varParams:", deCodeParams);
    }*/
    /*
    var cssParams =
    {
        transform: "scale(1, 1)",
        width: "8rem",
        height: "8rem",
        position: "absolute",
        top: "0px",
        left: "0px",
        zIndex: 1000,
        background: "rgba(0, 254, 25, 0.6)",
        borderRadius: "100%",
        display: "none"
    };

    if (!$("#hitAnimation").length) {
        body.append("<div id='hitAnimation' class='animation'></div>");
        $("#hitAnimation").css(cssParams);
    }

    function runClickAnimationFirst(funcName, RMTClickAnimationData, varParams) {

        var dataArr = RMTClickAnimationData.split(",");

        var clickCoords = dataArr[0];
        var clickItem = dataArr[1];
        var theControllerHasScrollBar = dataArr[2];

        var pageX = parseFloat(clickCoords.split("_!_")[0]);
        var pageY = parseFloat(clickCoords.split("_!_")[1]);

        var clickItemType = clickItem.split("_!_")[0];
        var clickItemIndex = parseFloat(clickItem.split("_!_")[1]);

        //��ÿ��Զ�����ݴ������֮�󣬶�������win.CONSTANT.CLICK_POSITION_X �� CLICK_POSITION_Y,
        //���ԣ�������ֵ��Ϊ0��ʱ��֤�� button �Ĵ����¼�û�д��������͹������ǻ����¼� ���� �����¼���
        //����Ҫ �������������ȡԶ�����ݾͿ�����
        if (pageX == "0" && pageY == "0") {
            decodeRMTDataPackage(funcName, varParams);
            return;
        }

        //�����������ĵ���¼� �� button ���� input ��ǩ�����ģ���Ѱ�Ҷ�Ӧ�ı�ǩ���ı䱳��ɫ
        if (clickItemIndex >= 0) {
            var clickElement = $($("body").find(clickItemType).eq(clickItemIndex));

            //disable-RMTActive ��Ϊ�ܾ�Զ�� �������
            if (!clickElement.hasClass("disable-RMTActive")) {
                var scrollBody = clickElement.parents(".scroll-table-body");
                var originalBackground = clickElement.css("backgroundColor");

                //����Է�û�й��������������У��Ǿ��Ȱ���Ҫ�����Ԫ�� ������ҳ�涥��֮�� ��ִ�е���¼�
                if (scrollBody.length && theControllerHasScrollBar === "false" && scrollBody[0].scrollHeight - scrollBody.height() > 0) {

                    $(scrollBody).animate({scrollTop: clickElement[0].offsetTop}, 300, function () {
                        clickElement.addClass("animation").css({
                            transform: "scale(0.9, 0.9)",
                            backgroundColor: "#002750"
                        });
                    });

                }
                else {

                    clickElement.addClass("animation").css({
                        transform: "scale(0.9, 0.9)",
                        backgroundColor: "#002750"
                    });

                }

                setTimeout(function () {
                    clickElement.css({transform: "scale(1, 1)", "backgroundColor": originalBackground});
                }, 200);
            }
        }

        //��500MS���¼����е����������ִ��Զ���¼�
        setTimeout(function () {decodeRMTDataPackage(funcName, varParams)}, 500);
    }*/

    function networkDelayAct6(delay) {
        console.log("�����ӳ٣�", delay);
    }

    function uncommunicateForNativeAct5() {
        HiddenRMTCover();
        tool.alert("Э�����Ѿ��Ͽ����ӣ�Զ��Э���Ѿ��޷����������ȷ��֮���˳�Э��ģʽ", function () {});
    }

    function errHandlerAct3() {
        HiddenRMTCover();
        setTimeout(function () {
            tool.alert(
                "�ֻ����豸ͨѶ���ȶ�,Զ��Э���Ѿ��޷����������ȷ��֮���˳�Э��ģʽ",
                function () { win.appService.sendDataToApp(3999, "", ""); });
        }, 500);
    }

    function errHandlerAct4() {
        var loadingTxt = "";
        var tipsParams = "";

        //���Ի�ȡloading���ı�,ֻ��loading������ʾ״̬��ʱ���ִ�У��û���������ȴ�ʱ������loading��
        if (tool.loading.status && tool.loading.status.display)
            loadingTxt = tool.loading.status.text;

        //���Ի�ȡtips�����в�����ֻ��tips������ʾ״̬��ʱ���ִ�У��û���������ȴ�ʱ������tips��
        if (tool.alert.status && tool.alert.status.display)
            tipsParams = tool.alert.status.params;

        tool.loading.status.disable = true;

        //Զ���У�ҵ��˺Ϳ��ƶ����ֶԴ�
        if (global.RMTID.role == "1") {
            HiddenRMTCover();
            //�����������֣���������ʾ����Ե��������û�ѡ�񡾼����ȴ������ٽ����ֲ㷵����
            //������ʾ���粻�ȶ�֮ǰ�� ���� �� �������֣������û����ѡ�񣬶�����ԭ������
            tool.alert(
                "����ͨѶ���ȶ���Զ��Э���Ѿ��޷����������ȷ��֮���˳�Э��ģʽ",
                function () {
                    tool.loading.status.disable = false;

                    //ȷ����ȡ�ı�֮�󣬷�������֮ǰ�����ֲ�û�����κε��޸ģ�
                    if (loadingTxt && tool.loading.status.text) {
                        tool.loading({text: tool.loading.status.text});
                        loadingTxt = "";
                    }

                    if (tipsParams)
                    //@���ӳ�������ǰ�ص� ���� ��ص�tipsBox�ĳ�ͻ����������һ��������Զ��ر���ʾ��
                        setTimeout(function () {
                            tool.alert.apply(tool, tipsParams);
                            tipsParams = "";
                        }, 450);

                    //֪ͨAPP��Ҫ��ת��Զ�����ݣ���ҵ��������˳�
                    win.appService.sendDataToApp(win.CONSTANT.JS_TO_APP.INFORM_APP_IS_TIMEOUT, "", "");
                }
            );
        }
        else {
            tool.alert(
                "����ͨѶ���ȶ���Զ��Э���Ѿ��޷����������ȷ��֮���˳�Э��ģʽ",
                //����ǿ��ƻ�������3999���ر�UI����
                function () {win.appService.sendDataToApp(3999, "", "");}
            );
        }
    }

})(jQuery);