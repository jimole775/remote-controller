/**
 * Created by Andy on 2017/11/1.
 */
import "animations.scss";
import tpl from "animations.template.jade";
import $ from "jQuery";

export default function (funcName, RMTClickAnimationData, varParams) {

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
            if (scrollBody.length &&
                theControllerHasScrollBar === "false" &&
                scrollBody[0].scrollHeight - scrollBody.height() > 0) {

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
    setTimeout(function () {
        decodeRMTDataPackage(funcName, varParams)
    }, 500);
}