/**
 * Created by Andy on 2017/12/1.
 */


var win = window;
//var dtcHistory = "history";      //��ʷ������
//var dtcCurrent = "current";      //��ǰ������
//var dtcWithState = "status";     //��״̬������
var cachebadRequestParamArr = [];   //������������ʧ��ʱ�����������������Ҫ�Ĳ���
var showView = false;
var webViewListIndex = 0;               //���ڽ�����ʾ��ϵͳ���±ꣻ
angular.controller('systemCtrl', ['$scope', 'SystemManager', '$element', function ($scope, SystemManager, $element) {

    let safeApply = function (fn) {
        var phase = $scope.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        }
        else {
            $scope.$apply(fn);
        }
    };
    $scope.DTCTotal = [];
    $scope.bDoClear = false;                //�����������
    $scope.scanState = SystemScanState['scanning'];
    $scope.scanProcess = "��ʼ��ɨ�����";
    $scope.clickItemIndex = 0;

    $scope.originalSystemListIndex = SystemManager.index;
    $scope.webViewSystemList_arr = [];                              //*****�ؼ����ݣ�����webViewģ���*****
    $scope.originalSystemList_arr = SystemManager.systemList;       //*****�ؼ����ݣ�����ͬ����������*****

    showView = true;
    systemBindBottomBtn();
    $scope.originalSystemList_arr.length = 0;
    $scope.webViewSystemList_arr.length = 0;
    modifyScanStateAndConnectNextSys();


    function systemBindBottomBtn($rootScope) {
        $rootScope.footBtn({
            btn1Text: function () {
                return $scope.btnScanText;
            },
            btn2Text: '�������',
            btn3Text: '�˳�',
            btn1Disable: function () {
                return !$scope.isScanBtnDisable();
            },
            btn2Disable: function () {
                return $scope.isClearBtnDisable();
            },
            btn3Disable: function () {
                return $scope.isQuitBtnDisable();
            },
            btn1Callback: function () {
                onClickPauseOrContinue.apply(null, arguments);
            },
            btn2Callback: function () {
                onClickClearErrorCode();
            },
            btn3Callback: function () {
                systemQuitConfirm();
            }
        })
    }

    function systemQuitConfirm() {
        $scope.scanState = SystemScanState.pausing;

        var len = $scope.webViewSystemList_arr.length;
        while (len--) {

            var name = $scope.webViewSystemList_arr[len].name;
            var DTC = $scope.webViewSystemList_arr[len].dtcList;

            win.global.DTCLog.detail.push({
                systemName: name,
                DTC: DTC
            });
        }

        reset();

    }

    function reset() {
        $scope.originalSystemListIndex = 0;

        $scope.DTCTotal.length = 0;
        $scope.bDoClear = false;                //�����������
        $scope.scanState = SystemScanState['scanning'];
        $scope.scanProcess = "��ʼ��ɨ�����";
        $scope.clickItemIndex = 0;

        cachebadRequestParamArr.length = 0;   //������������ʧ��ʱ�����������������Ҫ�Ĳ���
        webViewListIndex = 0;               //���ڽ�����ʾ��ϵͳ���±ꣻ

        scanStateWtach();
    }

    //����ɨ��״̬���Դ˸��� �ײ���ť�ı�
    var scanStateWtach = $scope.$watch('scanState', function () {
        $scope.btnScanText = OperationText[$scope.scanState];

        //#hack for Զ�̼������ ��ť�ı��޷�ͬ��������
        //win.global.RMTID.systemScanState = $scope.scanState;
    });

    $scope.selectedSystemIndex = function () {

        if ($scope.scanState == SystemScanState['complete'] && !$scope.bDoClear) {
            return -1;
        }
        else {
            return $scope.originalSystemListIndex;
        }
    };

    //ɨ�谴ť ����
    $scope.isScanBtnDisable = function () {
        return ($scope.scanState == SystemScanState['pausing'] || $scope.bDoClear);
    };

    //�����ť ����
    $scope.isClearBtnDisable = function () {
        return ($scope.scanState == SystemScanState['complete'] && !$scope.bDoClear);
    };

    //�˳���ť ����
    $scope.isQuitBtnDisable = function () {
        return (($scope.scanState == SystemScanState['undone'] || $scope.scanState == SystemScanState['complete']) && !$scope.bDoClear);
    };

    $scope.onItemClick = function (viewIndex, originalIndex) {
        //win.RMTClickEvent.clickIntoDTCTable(viewIndex, originalIndex);
        clickIntoDTCTable();
    };

    function clickIntoDTCTable(viewIndex, originalIndex) {
        var viewIndex_int = parseFloat(viewIndex);
        var originalIndex_int = parseFloat(originalIndex);
        var clickSystem = $scope.webViewSystemList_arr[viewIndex_int];


        if (clickSystem.dtcOriginalPids.length > 0) {

            //֮ǰû��������������룬����Ҫ�ٴ��������
            if (clickSystem.dtcList.length <= 0) {
                var txt = $scope.webViewSystemList_arr[viewIndex_int].dtcScanStateText;
                var param = cachebadRequestParamArr[viewIndex_int];

                //��ֹ��ε����������������˷���Դ || �����������param��û���أ��Ͳ���Ҫ������������
                if (txt === "���¼��..." || !param) return;

                FunSendDTCPid2Server(param.index, param.dtcType, param.dtcPidList);
                $scope.webViewSystemList_arr[viewIndex_int].dtcScanStateText = '���¼��...';
                safeApply(function () {
                });
                return;
            }

            //win.moduleEntry.showDTC(originalIndex_int, systemBindBottomBtn);
        }
        else {
            $scope.scanProcess = '�޹�����Ϣ';
            $scope.clickItemIndex = viewIndex_int;
        }

        safeApply(function () {
        });
    };


    //��ʼ������ͣ��ť��
    function onClickPauseOrContinue(RMTScanState) {
        var curScanState = RMTScanState ? RMTScanState : $scope.scanState;
        switch (curScanState) {

            case SystemScanState['scanning']:    //���֮�������ť �ı�Ϊ ��ɨ���С�����ִ����ͣ�еĲ�����
                $scope.scanState = SystemScanState['pausing'];
                $scope.scanProcess = "��ͣ��...";
                break;

            case SystemScanState['complete']:    //�����ť״̬Ϊ����ɡ�ɨ�裬��ִ������ɨ�����
                $scope.originalSystemList_arr.forEach(function (item) {
                    item.reset();
                });

                //����ɨ��ʱ�����ó�����Ϣ����
                //global.rootCache.carSystem = {};
                $scope.DTCTotal.length = 0;
                $scope.webViewSystemList_arr.length = 0;
                $scope.scanState = SystemScanState['scanning'];
                modifyScanStateAndConnectNextSys();
                break;

            case SystemScanState['undone']:     //�����ť�ı�Ϊ ��������, �ͼ���ɨ�蹤��
                modifyScanStateAndConnectNextSys();
                $scope.scanState = SystemScanState['scanning'];
                break;
        }

        safeApply(function () {
        });
    }


    function onClickClearErrorCode() {
        if ($scope.webViewSystemList_arr.length <= 0) {

            tool.alert('ϵͳδ���ӣ������豸״̬����������ɨ��',
                function () {
                }
            );

        }
        else {
            if (checkDTCList()) {
                tool.alert(['�������������в��ṩ����ͣ�����ܣ�����ʱ����Գ����Ƿ������', 'ȷ��', 'ȡ��'],
                    function () {
                        clearErrorCodeConfirm();
                    },
                    function () {
                    }
                )
            }
            else {
                tool.alert('�豸�޹�����Ϣ',
                    function () {
                    }
                )
            }
        }
    }

    function clearErrorCodeConfirm() {
        $scope.bDoClear = true;
        modifyScanStateAndConnectNextSys();
    }

    function checkDTCList() {
        //�ж��Ƿ��������ӵ�ϵͳ���й����룬�����û�й����룬ֱ�Ӹ���������ֹ�����������Ϊ
        var i = $scope.webViewSystemList_arr.length, flag;
        while (i--) {
            if ($scope.webViewSystemList_arr[i].dtcList.length > 0) {
                flag = true;
                break;
            }
        }
        return flag;
    }


    //����ϵͳ
    function modifyScanStateAndConnectNextSys() {
        //$scope.ContactSystemTotal = $scope.originalSystemList_arr.length;

        //��⵽�ı�Ϊֹͣ�У���ˢ��Ϊ��ͣ��
        //����ɨ��״̬������$scope.$watch���������������߼���̫�������Է�����Ϊ�ֶδ���
        if ($scope.scanState == SystemScanState['pausing']) {
            $scope.scanState = SystemScanState['undone'];
            $scope.scanProcess = "��ͣ";
            safeApply(function () {
            });
            return;
        }

        $scope.scanProcess = $scope.bDoClear ? '�����������' : '����ɨ��ģ��';
        safeApply(function () {
        });
    }


    function scanProcessMonitor() {
        console.log($scope.originalSystemListIndex, $scope.originalSystemList_arr.length);
        //ɨ����ɺ�Ĺ���
        if (++$scope.originalSystemListIndex >= $scope.originalSystemList_arr.length - 1) {

            //�����±�
            $scope.originalSystemListIndex = 0;
            webViewListIndex = 0;

            //���������ѭ������
            if ($scope.bDoClear) {
                $scope.bDoClear = false;
                $scope.scanProcess = "������";
            }
            else {
                $scope.scanProcess = "ɨ�����";
            }
            $scope.scanState = SystemScanState['complete'];

            //ɨ�費��ϵͳ
            if ($scope.webViewSystemList_arr.length === 0) $scope.scanProcess = 'ϵͳδ����';

            setTimeout(function () {
                tool.layoutTable();
            }, 150);
        }
        else {
            modifyScanStateAndConnectNextSys();
        }

        safeApply(function () {
        });
    }

    //��ȡ��ǰ��Ѱϵͳ
    function getCurrentSystem() {
        return $scope.originalSystemList_arr[$scope.originalSystemListIndex];
    }

    function getSystemByIndex(index) {
        return $scope.originalSystemList_arr[index];
    }


    //���õ�ǰϵͳ��״̬
    function setCurSystemState(linkable) {
        getCurrentSystem().updataSystemState(linkable ? 'linkable' : 'unlinkable');
        safeApply(function () {
        });
    }

    function countDTCNull(index) {
        var devReturnNull = getSystemByIndex(index).devReturnNull.length;
        if (devReturnNull == 3) {
            getSystemByIndex(index).dtcScanStateText = '�޹���';
        }
    }


    /**
     *
     * @param index ��Ӧϵͳ�б���±�
     * @param dtcType ���������ͣ���ʷ����ǰ����״̬
     * @param dtcPidList ���豸��ȡ���Ĺ�����pid����
     */
    function FunSendDTCPid2Server(index, dtcType, dtcPidList) {

        var DataPack = {
            pub: getCurrentSystem()['N']['publicfilename'],
            dbfilename: getCurrentSystem()['N']['dbfilename'],
            type: dtcType == dtcWithState ? 2 : 1,//��״̬����������Ϊ2������Ϊ1
            pids: dtcPidList
        };

        var markParams = {
            webViewIndex: index.webView - 1,
            originalIndex: index.original,
            dtcType: dtcType,
            index: index,
            dtcPidList: dtcPidList
        };
        win.server.request(
            global.businessInfo.serverType,
            {
                key: "DTC",
                cartype: global.businessInfo.carType
            },
            DataPack,
            win.server.addRetryFn(win.server.addCallbackParam(win.serverRequestCallback.DTC_simple, [markParams]),
                handleBadRequest)
        );
    }

    function handleBadRequest(params) {
        cachebadRequestParamArr[params.webViewIndex] = params;
        $scope.webViewSystemList_arr[params.webViewIndex].dtcScanStateText = '��������ʧ��(�������)';
        safeApply(function () {
        });
    }

    let DTC_simple = function (responseObject, params) {
        if (!responseObject.items.length) {
            $scope.webViewSystemList_arr[params.webViewIndex].dtcScanStateText = '�޹���';
            safeApply(function () {
            });
        }
        else {

            //������ͼ
            $scope.webViewSystemList_arr[params.webViewIndex].dtcScanStateText = '����';
            $scope.DTCTotal[params.webViewIndex] = true;
            safeApply(function () {
            });

            var items = responseObject.items || [];
            for (var i in items) {
                if (!items.hasOwnProperty(i))continue;
                var item = items[i];
                if (item.data.length == 0) {
                }

                //���data�ĳ���ֻ��1��������ʷ ���� ��ǰ ����
                /*   else if (item.data.length == 1 && (params.dtcType == dtcHistory || params.dtcType == dtcCurrent)) {
                 getSystemByIndex(params.originalIndex).dtcList.push(
                 new Dtc({
                 show: true,
                 danwei: item.data[0].danwei,
                 name: item.data[0].name,
                 status: item.data[0].name == 'δ����' ? '' : (params.dtcType == dtcHistory ? "��ʷ" : "��ǰ")
                 })
                 );
                 }*/

                //���data�ĳ�����2�������Ǵ�״̬����
                else if (item.data.length == 2 && (params.dtcType == dtcWithState)) {

                    //������dataʱ,name&&danweiȡtypeΪ2������,statusȡtypeΪ9������
                    var type2 = item.data[0].type == '2' ? 0 : 1;
                    var type9 = item.data[0].type == '9' ? 0 : 1;
                    getSystemByIndex(params.originalIndex).dtcList.push(
                        new Dtc({
                            show: true,
                            danwei: item.data[type2].danwei,             //name&&danweiȡtypeΪ2������
                            name: item.data[type2].name,
                            status: item.data[type9].name           //statusȡtypeΪ9������
                        })
                    );
                }

                else if (item.data.length == 1 && (params.dtcType == dtcWithState) && item.data[0].type == '2') {

                    //ֻ��һ��dataʱ,ֻȡtypeΪ2������,ֱ�Ӻ���9
                    getSystemByIndex(params.originalIndex).dtcList.push(
                        new Dtc({
                            show: true,
                            danwei: item.data[0].danwei,
                            name: item.data[0].name,
                            status: ''
                        })
                    );
                }

                //����
                getSystemByIndex(params.originalIndex).dtcList.sort(function (a, b) {
                    if (a.name == "ϵͳ�޹�����" && b.name != "ϵͳ�޹�����") {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                });
            }
        }
    }
}]).config(
    function ($provide) {
        function randomString() {
            var len = 32;
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            var maxPos = $chars.length;
            var randomString = '';
            for (var i = 0; i < len; i++) {
                randomString += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            console.log('randomString:', randomString);
            return randomString;
        }

        $provide.factory("SystemManager", function () {
            return {
                index: 0,
                scanRandom: randomString(),//ɨ�������
                systemList: [
                    {
                        name: "2",
                        N: {
                            nodeaddress: "",
                            dbfilename: "",
                            pubfilename: ""
                        },
                        dtcOriginalPids: [
                            {
                                type: 'history',
                                originalPids: ""
                            },
                            {
                                type: 'current',
                                originalPids: ""
                            },
                            {
                                type: 'state',
                                originalPids: ""
                            }
                        ],
                        dtcList: []
                    }
                ]
            };
        });

    }
);

function System(attr, index) {

    var self = this;

    self.show = true;
    self.name = attr.name;
    self.N = attr.N;
    self.index = index;
    self.dtcOriginalPids = [];

    self.dtcList = [];

    //��ӹ�����ԭʼpids
    self.addDtcOriginalPids = function (dtcType, pidList) {
        self.dtcOriginalPids.push(new DtcOriginalPids({
            dtcType: dtcType,
            originalPids: pidList
        }));
    };

    //ϵͳ�Ƿ������
    self.systemLinkable = false;

    //ϵͳ״̬
    self.systemStateText = SystemState['init'];

    self.updataSystemState = function (status) {
        self.systemStateText = SystemState[status];
        self.systemLinkable = (status == 'linkable');
    };

    self.dtcClearStateText = DtcClearState['init'];

    //�����������
    self.updataDtcClearState = function (status) {
        self.dtcClearStateText = DtcClearState[status];
        self.dtcStateText();
    };

    self.dtcScanStateText = DtcScanState['init'];
    self.updataDtcScanState = function (status) {
        self.dtcScanStateText = DtcScanState[status];
    };

    self.dtcStateText = function () {
        if (self.systemLinkable) {
            if (self.dtcClearStateText != "" && self.dtcScanStateText == "����") {
                return self.dtcScanStateText + "/" + self.dtcClearStateText;
            }
            else {
                return self.dtcScanStateText;
            }
        }
        else {
            return self.dtcScanStateText = "";
        }
    };


    self.devReturnNull = [];           //�豸���صĴ�71098X��ָ��
    //����
    self.reset = function () {
        self.devReturnNull.length = 0;
        self.dtcOriginalPids.length = 0;
        self.dtcList.length = 0;
        self.systemLinkable = false;
        self.systemStateText = SystemState['init'];
        self.dtcScanStateText = DtcScanState['init'];
        self.dtcClearStateText = DtcClearState['init'];
    }
}

function Dtc(attr) {

    attr = attr || {};
    this.show = attr.show;
    this.name = attr.name;
    this.danwei = attr.danwei;
    this.pid = attr.pid;
    this.appid = attr.appid;
    this.diagid = attr.diagid;
    this.fomula = attr.fomula;
    this.fomulaname = attr.fomulaname;
    this.status = attr.status;
}

var SystemState = {
    init: "",
    linkable: "O",
    unlinkable: "X"
};

var DtcClearState = {
    init: "",
    clearSucceed: "�����",
    clearFailure: "���ʧ��"
};

var DtcScanState = {
    init: "",
    checking: "�����...",
    hasDtc: "����",
    noDtc: "�޹���"
};

var SystemScanState = {
    scanning: 'scanning',
    pausing: 'pausing',
    undone: 'undone',
    complete: 'complete'
};

var OperationText = {
    scanning: '��ͣ',
    pausing: '��ͣ��',
    undone: '����',
    complete: '����ɨ��'
};
