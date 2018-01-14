/**
 * Created by Andy on 2018/1/5.
 */
import JRoll from "jroll";
import $ from "jquery";
let jroll = [];
export default function(ele, position){

    let tagName = ele.tagName;
    let tagId = $("body").find(tagName).index(ele);
    // �ӳ�300ms����Ⱦʱ�䣬��jroll�����¼�
    setTimeout(function () {
        if (!jroll[tagId]) {

            jroll[tagId] = new JRoll(ele, {
                edgeRelease: true,
                mousewheel: true
            });

            var userAgent = navigator.userAgent.toLowerCase();
            var isWin = (userAgent.indexOf("windows") != -1); // �����Windowsϵͳ���򷵻�true
            var isMac = (userAgent.indexOf("mac") != -1 && userAgent.indexOf("iphone") == -1); // �����Macintoshϵͳ���򷵻�true
            var isUnix = (userAgent.indexOf("x11") != -1); // �����Unixϵͳ���򷵻�true
            var isLinux = (userAgent.indexOf("linux") != -1); // �����Linuxϵͳ���򷵻�true ���´󲿷�������
            // �����PC�ˣ���ֹ�ڹ�����ʱ�򴥷�����¼�
            if (isWin || isMac || isUnix || isLinux) {

                let startY = 0;
                let scrollY = 0;
                jroll[tagId].on("scrollStart", function (e) {
                    //startY = e.pageY;
                    //ele.style.pointerEvents = null;
                });

                jroll[tagId].on("scroll", function (e) {
                    //scrollY = e.pageY;

                    // ȷ���Ѿ������������ص���¼�
                    //if (scrollY - startY >= 2) {
                        ele.style.pointerEvents = "none";
                    //}
                });

                // ������ϣ��ظ�����¼�
                jroll[tagId].on("scrollEnd", function () {
                    console.log("scrollEnd");
                    ele.style.pointerEvents = null;
                });
            }

        } else {

            // ˢ��JROll�ĸ߿�
            jroll[tagId].refresh();

            let beyondEdge = ele.firstChild.clientHeight - ele.clientHeight;

            // ִ�й�������
            if(position === "bottom" && beyondEdge > 0){
                jroll[tagId].scrollTo(0, -beyondEdge, 300);
            }
            if(position === "top"){
                jroll[tagId].scrollTo(0, 0, 300);
            }

        }
    }, 100);


}