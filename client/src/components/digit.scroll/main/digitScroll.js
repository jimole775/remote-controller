/**
 * Created by Andy on 2017/11/26.
 */
import "./digitScroll.scss";
import tpl from "./digitScroll.jade";
import $ from "jquery";
import JRoll from "jroll";

/** �洢���һ��ID�ŵ��������ڣ�
 ��new������ʱ��������ӵ�ǰʵ��HTML��wrapperԪ�ص�ID�����У�ÿ��new����֮���ԼӾ��У�
 ����������angular��Ⱦ�׶Σ�����������SpellWrapper���ͣ�BindEvent�����ֳ����첽������
 ͬһ��ģ���µ����У�SpellWrapper������ͬʱִ�У���ͬ�ģ���BindEvent��Ҳ��ͬһʱ��ִ�У�
 ��������ɣ�ʹ�ñ����� ���� or ��ȡ ��Ӧ��Ԫ��ʱ��ID���Ⱥ󲿷֣�

 ���磺
 ����Ⱦ�׶Σ��ȹ����� wrapper0-6���������첽�׶ΰ��¼���ʱ��
 ��������ID����Ϊ 7-13 �ĺ�����������Ȼ���Ҳ���Ԫ�أ���ʧ��~

 ������Ҫ����ÿ�ε��ò�ͬ��������ʱ��״̬���ֱ�洢���ߵ���׼ȷ��ID
 ��Ȼ����õķ���������Promise����generator������ʵ��ͬ����~
 */
let jrollCache = {
    //pluginId: {
    //    instances: [],
    //    appendixId: string | null
    //    spaceInPerHead: int
    //    startId:int
    //    latestId:int
    //}
};

export default function () {
    return {
        restrict: "E",
        scope: {
            fillSpace: "=fillSpace",
            maxRow: "=maxRow",
            maxColumn: "=maxColumn",
            appendTo: "@appendTo",
            pluginId: "@pluginId"
        },
        link: link,
        controller: JrollPlugin,
        template: tpl()
    }
}

function link($scope, $element, $attrs, that) {
    "ngInject";
    let values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    $scope.wrappers = that.spellWrappers(values);

    $scope.liStyle = {height: that.getLineHeight()};

    $scope.initListIndex = that.getInitListIndex();

    $scope.markFlagPosition = {
        top: that.getMarkFlagPosition()
    };

    $scope.wrapperHeight = {
        height: that.getWrapperHeight()
    };

    setTimeout(function () {
        that.definedEvents();
        that.bindEvents();
    });
}

class JrollPlugin {
    constructor($scope, $element, $attrs) {
        "ngInject";
        this.lineHeight = 3 * Number.parseInt($("html").css("fontSize"));  //��ȡÿ�е��иߣ����㷽ʽΪ 3 * �����Ĭ�������С
        this.maxColumn = $scope.maxColumn !== undefined ? $scope.maxColumn : $("body").width() > 720 ? 7 : 5;
        this.maxRow = $scope.maxRow !== undefined ? $scope.maxRow : $("body").height() > 720 ? 7 : 5;
        this.spaceInPerHead = $scope.fillSpace !== undefined ? $scope.fillSpace : $("body").height() > 720 ? 3 : 2;
        this.jrollEvents = []; //��������
        this.pluginId = $scope.pluginId;
        this.appendTo = $scope.appendTo;
        this.curMiddleIndexOfColumns = [];  //�洢ÿһ�еĵ�ǰ��ʾ���в���Ԫ�ص��±꣨�������ȡֵ��
        this.curTopIndexOfColumns = []; //�洢ÿһ�еĵ�ǰ��ʾ�ڶ�����Ԫ�ص��±�
        this.initJrollCache();
        //this.callback = callback;
        this.scrollStyle = {
            scrolling: {
                wrapper: "wrapper-scrolling",
                scroller: "scroller-scrolling"
            },
            selected: {
                listItem: "listItem-selected"
            }
        };
    }

    initJrollCache() {
        let startId = 1;

        for (let prop in jrollCache) {
            if (jrollCache.hasOwnProperty(prop)) {
                startId += jrollCache[prop].maxColumn
            }
        }

        if (!jrollCache[this.pluginId]) {
            jrollCache[this.pluginId] = {
                instances: [],
                appendixId: null,
                spaceInPerHead: this.spaceInPerHead,
                maxColumn: this.maxColumn,
                startId: startId,
                latestId: startId + this.maxColumn
            };
        }
    }

    definedEvents() {   //��ʼ��iscroll�¼�
        let thisPrototype = this;
        let scrollStyle = thisPrototype.scrollStyle;
        for (let i = 0; i < thisPrototype.maxColumn; i++) {
            thisPrototype.jrollEvents[i] = {
                snap: "li",
                momentum: true,
                usetransition: true,
                beforeScrollStart: function (e) {
                    e.preventDefault();   //�����ֻ���move�¼�
                },
                scrollStart: function (index, scrollEvent) {
                    let wrapper = scrollEvent.wrapper;
                    let scroller = scrollEvent.scroller;

                    if (scrollStyle) {
                        $(wrapper).addClass(scrollStyle.scrolling.wrapper);
                        $(scroller).addClass(scrollStyle.scrolling.scroller);
                    }


                },
                scrollEnd: function (index, scrollEvent) {
                    thisPrototype.curTopIndexOfColumns[index] = Math.round((scrollEvent.y / thisPrototype.lineHeight) * (-1));    //����&�洢��ǰ��mark����liԪ�ص��±�
                    thisPrototype.curMiddleIndexOfColumns[index] = thisPrototype.curTopIndexOfColumns[index] + thisPrototype.spaceInPerHead;    //����&�洢��ǰ��mark����liԪ�ص��±�

                    let wrapper = scrollEvent.wrapper;
                    let scroller = scrollEvent.scroller;

                    let curTopEl = scroller.children[thisPrototype.curTopIndexOfColumns[index]];
                    let curMiddleEl = scroller.children[thisPrototype.curMiddleIndexOfColumns[index]];


                    scrollEvent.scrollToElement(curTopEl, 300, false, function () { //����ʱ��300MS��Ҫ��transform�Ľ���ʱ��һ��

                        if (scrollStyle) {
                            $(scroller.children).removeClass(scrollStyle.selected.listItem);
                            $(wrapper).removeClass(scrollStyle.scrolling.wrapper);
                            $(scroller).removeClass(scrollStyle.scrolling.scroller);
                            $(curMiddleEl).addClass(scrollStyle.selected.listItem);
                        }

                        //���ﴫiΪ������������Ϊ�ڴ洢����jrollCache�����棬���е������͸������Ѿ�������ԣ�
                        // ֻҪ֪��һ�ߵ��±꣬��������±������һ�ߣ��Ϳ��Եõ���Ӧ��wrapper��ʵ��
                        thisPrototype.autoScroll(i, thisPrototype.curMiddleIndexOfColumns[index]);

                        //thisPrototype.callback();
                    });

                }
            }

        }
    }


    bindEvents() {       //��iscroll�¼�
        let thisPrototype = this;
        let thisInstances = [];
        for (let [index, item] of thisPrototype.jrollEvents.entries()) {
            let wrapperId = jrollCache[thisPrototype.pluginId].startId + index;
            thisInstances[index] = new JRoll("#wrapper" + wrapperId, item);

            thisInstances[index].on(
                "scrollStart", (function (_index, _item) {
                    return function () {
                        let scrollEvent = this;
                        _item.scrollStart(_index, scrollEvent)
                    };
                })(index, item)
            ).on(
                "scrollEnd", (function (_index, _item) {
                    return function () {
                        let scrollEvent = this;
                        _item.scrollEnd(_index, scrollEvent)
                    };
                })(index, item)
            )
        }

        this.cacheInstance(thisInstances);
    }

    cacheInstance(instances) {
        jrollCache[this.pluginId]["instances"] = instances;

        //����Ǹ���Ԫ�����͸���appendTo�ҵ���������������appendixId���������뵱ǰ��pluginId,ʵ�ֹ���
        if (this.appendTo) {
            let thatMasterPluginId = this.appendTo;
            jrollCache[thatMasterPluginId]["appendixId"] = this.pluginId;
        }
    }

    autoScroll(instanceIndex, curMiddleIndex) {
        let appendixId = jrollCache[this.pluginId]["appendixId"];
        let appendixInstance = jrollCache[appendixId]["instances"][instanceIndex];
        let appendixSpaceInPerHead = jrollCache[appendixId]["spaceInPerHead"];
        let appendixScroll = appendixInstance.scroller;
        let curMiddleIndexAfterQuerySpace = curMiddleIndex - this.spaceInPerHead;
        let appendixMiddleIndex = curMiddleIndexAfterQuerySpace + appendixSpaceInPerHead;
        let appendixMiddleEl = appendixScroll.children[appendixMiddleIndex];
        let appendixMiddleHigh = appendixMiddleIndex * this.lineHeight * -1;

        if (appendixId) {
            let scrollStyle = this.scrollStyle;
            appendixInstance.scrollTo(0, appendixMiddleHigh, 300, false, function () { //����ʱ��300MS��Ҫ��transform�Ľ���ʱ��һ��
                if (scrollStyle) {
                    $(appendixScroll.children).removeClass(scrollStyle.selected.listItem);
                    $(appendixMiddleEl).addClass(scrollStyle.selected.listItem);
                }
            });

        }
    }

    spellWrappers(_wrapperItems) {
        let wrappers = [];
        let wrapperItems = this.fillSpace(_wrapperItems);
        for (let i = jrollCache[this.pluginId].startId; i < jrollCache[this.pluginId].latestId; i++) {
            wrappers.push({id: "wrapper" + i, values: wrapperItems});
        }

        return wrappers;
    }

    getLineHeight() {
        return this.lineHeight + "px";
    }

    getMarkFlagPosition() {
        return (this.lineHeight * (( this.maxRow - this.maxRow % 2) / 2 + 1) - 2) + "px";    //�������м们����ĵײ��� -2PX��mark����ı߿�߶�
    }

    getInitListIndex() {
        return 0 + this.spaceInPerHead;
    }

    getWrapperHeight() {
        return (this.lineHeight * this.maxRow) + "px";
    }

    fillSpace(wrapperItems) {
        //���ݲ����С����ͷ�ŵĿ�Ԫ�ص�����
        for (let i of new Array(this.spaceInPerHead)) {
            wrapperItems.unshift("");
            wrapperItems.push("");
        }
        return wrapperItems;
    }

}