/**
 * Created by Andy on 2017/11/4.
 */
import TR from "/server/websocket/socketRegister/socketRegister";
import emitter from "/server/websocket/interactive/threads/emitter";



export default function (data, socket) {

    let namesMap = TR.getStorage("namesMap");
    let clients = TR.getStorage("clients");

    let askerUid = data.items.remoteUid.askerUid;
    let helperUid = data.items.remoteUid.helperUid;

    //�洢Զ��ҵ���е����ˣ���Ҫ�������û�δע���ʱ��һ����������ͨ������ǰ�ˣ���ǰ���Լ�����
    TR.setStorage("remoteChanelMap",{askerUid: askerUid, helperUid: helperUid});

    //֪ͨ���е��û��������û����ڽ���Զ��ҵ��
    namesMap.forEach(function (item) {
        if (askerUid == item || helperUid == item)return;
        emitter(0x06,
            {
                remoteUid: {
                    askerUid: askerUid,
                    helperUid: helperUid
                }
            },
            clients[item]
        );
    });

    var asker = clients[askerUid];
    var helper = clients[helperUid];

    emitter(0x03, {remoteRole: 1}, asker);
    emitter(0x03, {remoteRole: 2}, helper);
};