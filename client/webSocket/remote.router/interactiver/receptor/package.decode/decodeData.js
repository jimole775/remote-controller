/**
 * Created by Andy on 2017/11/1.
 */

export default function (varFuncName, varParams) {
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
}