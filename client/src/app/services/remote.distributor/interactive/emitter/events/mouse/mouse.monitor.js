/**
 * Created by Andy on 2017/11/9.
 */

/**
 *ȫ�ֵ���¼��Ĵ�������
 *����Զ�̹����¼��Ľ���ģʽ��
 *������������� Զ�̵���¼�ִ��֮ǰ���У����Բ�����������֡���ݣ�
 *�ѵ������ƴ���� sendRMTEventToApp �����ĵ�һ���������棬�ԡ�_|_��Ϊ��ʶ
 * */
body.ready(function () {

    body.delegate("button", "touchstart", function (e) {
        mouseEvent.coord.X = e.originalEvent.changedTouches[0].pageX / win.CONSTANT.WINDOW_WIDTH;
        mouseEvent.coord.Y = e.originalEvent.changedTouches[0].pageY / win.CONSTANT.WINDOW_HEIGHT;
        var curTarget = e.currentTarget;
        mouseEvent.type = "button";
        mouseEvent.index = $("body").find("button").index(curTarget);

        var scrollBody = $(curTarget).parents(".scroll-table-body");
        if (scrollBody.length) {
            if (scrollBody[0].scrollHeight - scrollBody.height() > 0) {
                mouseEvent.hasScrollBar = true;
            }
        }
    });

    body.delegate("input", "touchstart", function (e) {
        mouseEvent.coord.X = e.originalEvent.changedTouches[0].pageX / win.CONSTANT.WINDOW_WIDTH;
        mouseEvent.coord.Y = e.originalEvent.changedTouches[0].pageY / win.CONSTANT.WINDOW_HEIGHT;
        var curTarget = e.currentTarget;
        mouseEvent.type = "input";
        mouseEvent.index = $("body").find("input").index(curTarget);

        var scrollBody = $(curTarget).parents(".scroll-table-body");
        if (scrollBody.length) {
            if (scrollBody[0].scrollHeight - scrollBody.height() > 0) {
                mouseEvent.hasScrollBar = true;
            }
        }
    });
});