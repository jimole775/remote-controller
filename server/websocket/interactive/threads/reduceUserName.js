/**
 * Created by Andy on 2017/11/4.
 */

import TR from "/server/websocket/socketRegister/socketRegister";
import emitter from "/server/websocket/interactive/threads/emitter";

//֪ͨǰ��ɾ���Ͽ����û�
export default function (data, socket) {

    let namesMap = TR.getStorage("nameMap");
    let clients = TR.getStorage("clients");

    socket.destroy();   //ɾ�����ߵ�session��

    if (data.uid) {
        TR.delStorage("clients",data.uid);

        //ɾ�����ߵ��û�����
        let index = namesMap.indexOf(data.uid);
        TR.delStorage("namesMap",index);
    }

    //ˢ���û��б��ͻ���
    TR.getStorage("nameMap").forEach(function (item, index) {
        let clients = TR.getStorage("clients");
        emitter(0xFE, {deadUid: data.uid}, clients[item]);
    });
};