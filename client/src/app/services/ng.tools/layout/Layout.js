/**
 * Created by Andy on 2017/12/3.
 */
import $ from "jquery";
import _ from "lodash";
export default class Layout {

    /**
     * ���ַ�����һ��Ѵ��� ��Ϊ3�����֣�
     *
     * ͷ�������� #title ��.groupNav , .scroll-table-header��
     * �м�ɹ������� ��.scroll-table-body��
     * �Ų���#footer��#bottomBtn��.scroll-table-footer��
     *
     *@params flag:init  ���ÿ�¡��Ԫ��
     * */
    static init(element = $("section"), flag = 1) {
        let dataBox = null;

        /**
         * section��ǩ��uiRouter�Ŀ��������ӣ�
         * div��ǩ��directive�Ŀ���������
         * */
        if (element[0].nodeName === "SECTION") {

            //�����������uiView��ƽ�д��ڣ���ô��Ĭ�ϵ�һ��dataBox���ǵ�ǰuiRouter�Ŀ���������
            //�����Ķ���directive�Ŀ���������
            //***һ��·����תֻ����һ��$state��N��directive***
            dataBox = $($(element[0]).children[0]);
        } else {
            dataBox = $(element[0]);
        }
        let elementIndex = $("section").find("div").index(dataBox);
        let $curContentBody = dataBox.find(".scroll-table-body");
        console.log("elementIndex: ", elementIndex);
        if (flag == 1) {
            Layout.showTable(dataBox);

            //��ҳ�桾�󡿣�̽����ǰҳ��û�д洢�й�������¼
            let curScrollTop = parseFloat(sessionStorage.getItem(elementIndex));
            if (curScrollTop != undefined && curScrollTop != null) {
                $curContentBody.scrollTop(curScrollTop);
            }
        }
        else {
            //�ر�ҳ�桾ǰ�����洢��ǰҳ�Ĺ������߶�
            sessionStorage.setItem(elementIndex, $curContentBody.scrollTop());

            Layout.hideTable(dataBox);
        }
    }

    static showTable(box) {

        let boxChildren = box.children();
        /**
         * 1������angular��ȾԪ����ԭ��JS֮�󣬻�ȡ������Ӧ��Ԫ��
         * ���� ��angular����£����� �Ѳ���д�� html ����
         *
         * 2���ڷ�angular����£����������� 3������
         */
            //���css����Ϊdata-box,�����Ҳ���.scroll-table-body��������Ϊ�������3�����֣�
            //if (!box.find(".scroll-table-body").length) {
            //    let header = "<div class='scroll-table-header'></div>";
            //    let body = "<div class='scroll-table-body'></div>";
            //    let footer = "<div class='scroll-table-footer'></div>";
            //    let title = boxChildren.eq(0);
            //    let content = boxChildren.eq(1);
            //    let footerBtn = boxChildren.eq(2);
            //    box.append(header, body, footer);
            //    title.appendTo(box.find(".scroll-table-header"));
            //    content.appendTo(box.find(".scroll-table-body"));
            //    footerBtn.appendTo(box.find(".scroll-table-footer"));
            //}
            //box.removeClass().addClass("data-box");

        box.show();
        setTimeout(function () {
            Layout.resize(box);
        });
    }

    static hideTable(box) {

        box.hide();

    }

    /**
     * ���ַ�����һ��Ѵ��� ��Ϊ3�����֣�
     *
     * ͷ�������� #title ��.groupNav , .scroll-table-header��
     * �м�ɹ������� ��.scroll-table-body��
     * �Ų���#footer��#bottomBtn��.scroll-table-footer��
     *
     *@params flag:init  ���ÿ�¡��Ԫ��
     * */
    static resize(box, flag) {
        let curFrame = null;
        if (box === undefined || !$(box).is("div")) {
            curFrame = _.find($("section").find("div"), function (el) {
                return $(el).is(':visible');
            });
        } else {
            curFrame = box;
        }

        if (!curFrame) {
            return;
        }

        if (flag === 'init') {          //�˳�ǰ���� ��¡��ͷ��Ԫ�أ��������½���ʱ��������Ԫ���ص�
            Layout.removeCloneHead(curFrame);
        }
        else {

            Layout.cloneThead(curFrame);

            Layout.layout(curFrame);

        }

    }

    static cloneThead(curFrame) {

        let frameHeader = $(curFrame).find('.scroll-table-header');
        let frameBody = $(curFrame).find('.scroll-table-body');
        if (frameBody.find('table').length > 0) {     //����table����Ԫ�صĲ��֣�

            let bodyThead = frameBody.find('thead');

            if (!frameHeader.find('table').length && bodyThead.length) {       		//�����ظ���¡��������Щ������û��thead�ģ��Ͳ���Ҫ��¡
                frameHeader.append('<table></table>');
                frameHeader.find('table').append(bodyThead.clone());
            }
        }
    }

    static removeCloneHead(curFrame) {
        let frameBody = $(curFrame).find('.scroll-table-body');
        if (frameBody.find('thead').length > 0) {
            $(frameBody.find('thead')).remove();
        }
    }

    static layout(curFrame) {

        let frameHeader = $(curFrame).find('.scroll-table-header');
        let frameBody = $(curFrame).find('.scroll-table-body');
        let footer = $("footer");
        let titleHeight = $("#Title").height() || 0;
        let frameHeaderHeight = frameHeader.height() || 0;
        let footHeight = footer.is(':visible') ? footer.height() : 0;
        let thead_cloneHeight = frameHeader.height();

        let bodyHeight = $("html").height() - titleHeight - frameHeaderHeight - footHeight + thead_cloneHeight;


        frameBody.css('height',bodyHeight);

        if(frameBody.css("position") === "absolute"){
            frameBody.css({
                'top': frameHeaderHeight - thead_cloneHeight + titleHeight
            });
        }else{
            frameBody.css({
                'top': - thead_cloneHeight
            });
        }

        if(frameHeader.css("position") === "absolute"){
            frameHeader.css({
                'top': titleHeight
            });
        }

    }
}