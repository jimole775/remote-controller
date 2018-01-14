/**
 * Created by Andy on 2018/1/10.
 */
import TR from "wsServer/services/socket.storage/socketStorage";
import emitter from "../../emitter/emitter.js";

let ajaxDataCache = new Map();

export default function (socket, data) {
    let clients = TR.getStorage("clients");
    let helperUid = data.remoteUid.helperUid;
    let askerUid = data.remoteUid.askerUid;
    let fromUid = data.uid;


    if (askerUid === fromUid) {
        // ����������� asker���ʹ洢�������������helper������֡����
        ajaxDataCache.set(data.items.ajaxCallbackId, {
            json: data.items.json,
            ajaxCallbackId: data.items.ajaxCallbackId,
            status: data.items.status
        });


    }

    if (helperUid === fromUid) {
        let doneId = data.items.doneId;
        sniff(ajaxDataCache, doneId, 5, function(){

            emitter(0x09,
                {
                    status: ajaxDataCache.get(doneId).status,
                    json: ajaxDataCache.get(doneId).json,
                    ajaxCallbackId: ajaxDataCache.get(doneId).ajaxCallbackId
                },
                clients[helperUid]
            );

            // �������֮������
            ajaxDataCache.delete(doneId);
        });
    }

}


function sniff(ajaxDataCache, doneId, times, callback) {

    if(times <= 0){
        console.log("callbackId δ�ܼ�ʱ�ϴ�~");
        return;
    }

    let promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            let result = ajaxDataCache.get(doneId);
            result ? resolve(result) : reject(result);
        }, 500)
    });

    promise.then(callback,function(){
        sniff(ajaxDataCache, doneId, --times, callback)
    })
}


