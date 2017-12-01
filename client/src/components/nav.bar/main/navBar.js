/**
 * Created by Andy on 2017/11/15.
 */
import ngView from "./navBar.jade";
import "./navBar.scss";

export default function () {
    //isBack����ӳ������û���ϵͳ�˵����أ�
    if (arguments[0] === -1) {
        $scope.pagesOptionChosenRecord.splice($scope.pagesOptionChosenRecord.length - 1);

        //ֻʹ��һ�Σ�pagesOptionChosenRecordֻҪ�仯��$scope.isBack�ͻ���Ϊ��
        $scope.isBack = true;

        //������������淵�ش˽����ʱ��ҳ���¼Ϊ�գ��ڼ���������ᱻ����һ�Σ�
        //isBack�����ڵ�һʱ������Ϊfalse,����ɵ�һ�ε���¼���Ч��BUG��
        if ($scope.pagesDataIndex-- == 1) $scope.isBack = false;
        //tool.processBar("��ȡ����ϵͳ�ɹ�");

    }
    else {    //��������������
        $scope.isBack = false;
        reset();
        requestData($scope.pagesOptionChosenRecord);
    }

    safeApply(function () {
        //���²�����Ҫ�Ӻ󣬵ȴ�nav�б���Ⱦ����ٽ��У������޷�׼ȷ����nav�߶�
        setTimeout(function () {
            tool.layout(thisBoxId, 1);
        }, 45);
    });
    /**
     * �����б�Ļص�����,���ڳн�Զ�̺���
     * @item   �ص�������
     * */
    $scope.handleSelect = function (parentIndex, item) {
        win.RMTClickEvent.carTypeHandleSelect(parentIndex, item);
    };

    /**
     * ����ѡ���¼�
     * @param curClickPageIndex
     * @param item
     * */
    win.RMTClickEvent.carTypeHandleSelect = function (curClickPageIndex, item) {
        //ÿ�η�ҳ�����ѹ������ö�
        thisBox.find(".scroll-table-body").scrollTop(0);

        //Զ�̽��뺯�����������ֶ�ת�������ִ�
        var curClickPageIndex_int = parseFloat(curClickPageIndex);

        //���֮�����ϼ�1����Ϊ���ѡ�����Ŀ�ظ������ܲ�ȥ���������
        $scope.pagesDataIndex = curClickPageIndex_int + 1;

        var recordIndex = $scope.pagesOptionChosenRecord.length;

        //���ѡ�˲��ظ�����Ŀ����ɾ�� ��ǰ�±�֮��� ѡ���¼��$scope.pagesOptionChosenRecord�� ��ҳ�����ݡ�$scope.pagesData����ͨ���������� ѡ���¼ ����������

        //��һ��������������ѡ���ͣ���ǰҳ����±� С�� ѡ���¼�ĳ���
        if ($scope.pagesDataIndex < recordIndex) {

            //ѡ���˲�ͬ������޸�ѡ���¼��
            if (item.name !== $scope.pagesOptionChosenRecord[$scope.pagesDataIndex - 1]) {

                //record�±��pages�±���1�Ĳ����Ҫͬ����ʾ������£�����pages���±��ʱ����� -1��
                //record�±��pages�±���1�Ĳ����Ҫͬ����ʾ������£�����record���±��ʱ����� +1��
                $scope.pagesOptionChosenRecord.splice($scope.pagesDataIndex - 1);
                $scope.pagesData.splice($scope.pagesDataIndex);

                //global.rootCache.carType[$scope.pagesOptionChosenRecord.length] = item.name;
                $scope.pagesOptionChosenRecord[$scope.pagesOptionChosenRecord.length] = item.name;
                win.global.DTCLog.systemName = item.name;

            }
            else {   //ѡ������ͬ�ֱ���޸�show���ԣ�
                showPageDataFromClientChoosen($scope.pagesDataIndex);
            }

        }

        //�ڶ���������������ѡ���ͣ�ѡ���� ѡ���¼�����һ��
        else if ($scope.pagesDataIndex === recordIndex) {

            //ѡ�˲�ͬ�ֱ���޸� ѡ���¼��
            if (item.name !== $scope.pagesOptionChosenRecord[recordIndex - 1]) {
                $scope.pagesOptionChosenRecord[recordIndex - 1] = item.name;
            }
            //ѡ������ͬ�ֱ���޸� show���ԣ�
            else {
                showPageDataFromClientChoosen($scope.pagesDataIndex);
            }

        }

        //���������������ѡ��������Ӽ�¼���ȣ�������������������
        else {

            //�ֶ�����parents��ֵ����$watchCollection��������Ч
            $scope.pagesOptionChosenRecord[$scope.pagesOptionChosenRecord.length] = item.name;
            win.global.DTCLog.systemName = item.name;
        }

        safeApply(function () {
            //���²�����Ҫ�Ӻ󣬵ȴ�nav�б���Ⱦ����ٽ��У������޷�׼ȷ����nav�߶�
            setTimeout(function () {
                tool.layoutTable();
            }, 45);
        });
    };

    $scope.navSelection = function (recordIndex) {
        win.RMTClickEvent.carTypeNavSelection({nav: recordIndex});
    };

    /**
     * ����������¼�
     * @param obj ;this param's type like {record:index} || {pagesDataIndex:index}
     * */
    win.RMTClickEvent.carTypeNavSelection = function (obj) {

        //����� ��� �������� ���� �� �������һ������ť����
        if (obj.hasOwnProperty("nav")) {
            var record = parseFloat(obj.nav);                //Զ�̶�ֻ֧���ִ���ʽ������
            $scope.pagesDataIndex = record + 1;
            showPageDataFromClientChoosen(record + 1);          //record�±��pages�±���1�Ĳ����Ҫͬ����ʾ������£�
            //����record���±��ʱ����� +1��
        }
        else {
            var pagesDataIndex_int = parseFloat(obj.btn);
            showPageDataFromClientChoosen(pagesDataIndex_int);
        }

        checkBtnTextBasisCurIndex();
        safeApply(function () {
        });
    };

    /**
     * ��̬ˢ�°�ť�ı�
     * */
    function checkBtnTextBasisCurIndex() {
        return $scope.pagesDataIndex > 0 ? "��һ��" : "����";
    }

    /**
     * ���ذ�ť����¼�,��Ϊ����һ�����͡��˳���ϡ��������ܣ����ݵ�ǰҳ���Index�����ж�
     * */
    function backToPrvLevel() {

        if ($scope.pagesDataIndex <= 0) {
            quit();
        }
        else {
            win.RMTClickEvent.carTypeNavSelection({btn: --$scope.pagesDataIndex});
        }
        safeApply(function () {
        });
    }

    /**
     * �����Ƿ���� nodeaddress
     * �����ҵ������
     * ���� $scope.pagesOptionChosenRecord �ı仯������Ӧ�Ĵ���
     * */
    $scope.$watchCollection('pagesOptionChosenRecord', function () {

        //��������ִ�������������룬�����ڴ˶½أ���ֹ����
        if (!$scope.pagesOptionChosenRecord[0] || "" == $scope.pagesOptionChosenRecord[0]) {

            return;
        }

        var curRecordIndex = $scope.pagesOptionChosenRecord.length - 1;
        //��ȡÿ���б�㼶����ѭ�������Ƿ����nodeaddress��
        var itemLen = $scope.pagesData[curRecordIndex].length;
        if (itemLen > 0) {
            for (var i = 0; i < itemLen; i++) {
                var item = $scope.pagesData[curRecordIndex][i];

                //������ڣ�ֱ�������¸����̣�ȡ��ȷ����ť
                if (item.name == $scope.pagesOptionChosenRecord[curRecordIndex] && item['N']) {

                    $scope.dbFilename = item['N']['dbfilename'];
                    $scope.publicfilename = item['N']['publicfilename'];

                    safeApply(function () {
                    });
                    outputPrompt(item['N']['nodeaddress']);
                    return;
                }
            }
        }

        //���������淵�ص�ʱ��ֱ�Ӷ�ȡ�������ݣ�����Ҫ���������
        if ($scope.isBack === true) {
            $scope.isBack = false;
            return;
        }

        requestData($scope.pagesOptionChosenRecord);

    });

    /**
     * ҳ�����ʾ���ش���
     * ����Ϊ--��ȫ�����أ�Ȼ����ʾ��ǰ��Ҫ��ʾ��
     * */
    function showPageDataFromClientChoosen(pagesDataIndex) {
        //���������У�
        var j = $scope.pagesData.length;
        while (j--) {
            var k = $scope.pagesData[j].length;
            while (k--) {
                $scope.pagesData[j][k].show = false;
                $scope.pagesData[j][k].imgShow = false;
            }
        }

        //����ʾ��ǰ��
        var n = $scope.pagesData[pagesDataIndex].length;
        while (n--) $scope.pagesData[pagesDataIndex][n].show = true;
    }

    /**
     * ���������������װ
     * @param pagesOptionChosenRecord ;������ѡ���¼�����鷢�͸�������
     * */
    function requestData(pagesOptionChosenRecord) {
        if (showView)win.tool.loading({pos: "body", text: '��ȡ����...'});
        getItemsByParents(
            pagesOptionChosenRecord,
            win.server.addRetryFn(win.server.addCallbackParam(win.serverRequestCallback.CTYPE, [pagesOptionChosenRecord]),
                [requestData, backToPrvLevel])
        );
    }

    /**
     * �����������ʼ�����ݷ�װ
     * @param pagesOptionChosenRecord ;ѡ���¼
     * @param callback ;��������ص�
     * */
    function getItemsByParents(pagesOptionChosenRecord, callback) {

        var callbackFunc = callback || function () {
            };
        var DataPack = {
            mkey: '',
            parents: pagesOptionChosenRecord       //������������Ϊ parents��
        };

        win.server.request(
            global.businessInfo.serverType,
            {
                key: "CTYPE",
                cartype: global.businessInfo.carType
            },
            DataPack,
            win.server.addCallbackParam(callbackFunc, [pagesOptionChosenRecord]),
            [requestData, backToPrvLevel]
        );
    }


}