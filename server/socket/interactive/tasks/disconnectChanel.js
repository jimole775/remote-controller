/**
 * Created by Andy on 2017/11/4.
 */

import TR from "wsServer/services/socket.storage/socketStorage";
import emitter from "../../emitter/emitter.js";

export default function (socket, data) {
    let fromUid = socket.uid;
    let clients = TR.getStorage("clients");
    let namesMap = TR.getStorage("namesMap");
    let remoteChanelMap = TR.getStorage("remoteChanelMap") || [];
    let askerUid = null;
    let helperUid = null;

    // �Ų�Ͽ����û�������Ƿ��������û���ͨѶ
    // ɾ�����ͨ��������֪ͨ�ŵ���һ��
    remoteChanelMap.forEach(function (item, index) {
        if (item.askerUid == fromUid || item.helperUid == fromUid) {

            askerUid = item.askerUid;
            helperUid = item.helperUid;
            emitter(
                0xFF,
                {
                    remoteId:0,
                    remoteChanelMap: TR.delStorage("remoteChanelMap", index).getStorage("remoteChanelMap")
                },
                clients[(askerUid == fromUid ? helperUid : askerUid)]
            );
        }
    });


    // ����֪ͨ�������е��û� �������û�����Զ��ҵ��
    // ����û��б���"busing"״̬��ʹ����Ա�ѡȡ
    namesMap.forEach(function (item) {
        if (askerUid == item || helperUid == item)return;
        emitter(0x07,
            {
                remoteChanelMap: TR.getStorage("remoteChanelMap")
            },
            clients[item]
        );
    });
};