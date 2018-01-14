/**
 * Created by Andy on 2017/11/4.
 */
import TR from "wsServer/services/socket.storage/socketStorage";
import emitter from "../../emitter/emitter.js";

export default function (socket, data) {

    let namesMap = TR.getStorage("namesMap");
    let clients = TR.getStorage("clients");

    let askerUid = data.remoteUid.askerUid;
    let helperUid = data.remoteUid.helperUid;

    // �洢Զ��ҵ���е����ˣ���Ҫ�������û�δע���ʱ��һ����������ͨ������ǰ�ˣ���ǰ���Լ�����
    TR.addStorage("remoteChanelMap",{"askerUid": askerUid, "helperUid": helperUid});

    // ֪ͨ���е��û��������û����ڽ���Զ��ҵ��
    namesMap.forEach(function (item) {
        if (askerUid == item || helperUid == item) return;
        emitter(0x06,
            {
                remoteChanel:  {"askerUid": askerUid, "helperUid": helperUid}
            },
            clients[item]
        );
    });

    var asker = clients[askerUid];
    var helper = clients[helperUid];

    // ��ͨѶ�е��û��ɷ���ݱ�ʶ ��������ID��1��Э����ID��2��
    emitter(0x03, {remoteId: 1,remoteUid: {
        "askerUid": askerUid,
        "helperUid": helperUid
    }}, asker);

    emitter(0x03, {remoteId: 2,remoteUid: {
        "askerUid": askerUid,
        "helperUid": helperUid
    }}, helper);
};