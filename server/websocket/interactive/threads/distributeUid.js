/**
 * Created by Andy on 2017/11/4.
 */

import TR from "/server/websocket/socketRegister/socketRegister";
import emitter from "/server/websocket/interactive/threads/emitter";

//���û���Ϣ
export default function (data, socket) {
    socket.uid = data.uid;

    let namesMap = TR.getStorage("namesMap");
    let clients = TR.getStorage("clients");

    if (namesMap.indexOf(data.uid) < 0) {
        TR.setStorage("namesMap",data.uid);
    }

    TR.setStorage("clients",data.uid, socket);
    //clients[data.uid] = socket;

    //�����е��û������û���
    TR.getStorage("namesMap").forEach(function (item, index) {
        clients = TR.getStorage("clients"); //����ǰ���в�����������֮ǰ���»�ȡ
        emitter(0x01, {namesMap: JSON.stringify(namesMap)}, clients[item]);
    });
};