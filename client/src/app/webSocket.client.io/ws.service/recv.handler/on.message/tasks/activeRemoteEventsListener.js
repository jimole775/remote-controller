/**
 * Created by Andy on 2018/1/9.
 */
import $ from "jquery";
export default function ({prayload, wsService}) {
    if (prayload.serverData.remoteId == 1) {

    }

    if (prayload.serverData.remoteId == 2) {

        // ��ֹ���п��ð�ť���¼����´��������Ⲷ�񵽲����Ԫ��
        //stopEventsPropagation();
        document.body.addEventListener("click",function(e){
            matchTheButtonElement(e.target);
            let target = matchTheButtonElement.target;

            // ��ð��·���л����Ҳ��� �������͵�Ԫ�� �Ļ�����ֱ���˳�
            if (!/INPUT|BUTTON|SUBMIT/i.test(target.tagName)) return;
            queryTarget(target, wsService);
        });

    }
}
function matchTheButtonElement(target){
    if (/INPUT|BUTTON|SUBMIT/i.test(target.tagName) || target.tagName.toUpperCase() === "BODY") {
        matchTheButtonElement.target = target;
    }else{
        matchTheButtonElement(target.parentNode)
    }
}

function queryTarget(curTarget, wsService){

    console.log("event target: ", curTarget);

    // ����ҵ�����ͣ���ֹһЩ�¼����䣬���磺����ϵͳ
    // ע��html��Ԫ����������֧���շ����д��ʽ
    if (curTarget.attributes["unremote"]) return;

    let targetName = curTarget.tagName.toUpperCase();

    let index = $("body").find(targetName).index(curTarget);

    wsService.emit(0x05, {buttonIndex: index, buttonType: targetName});
}


function stopEventsPropagation(){


    $("button").on("click",function(e){
        e.stopPropagation();
    });
    $("submit").on("click",function(e){
        e.stopPropagation();
    });
    $("input").on("click",function(e){
        e.stopPropagation();
    });
    $("a").on("click",function(e){
        e.stopPropagation();
    });

}