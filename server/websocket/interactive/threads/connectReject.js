/**
 * Created by Andy on 2017/11/4.
 */

import TR from "/server/websocket/socketRegister/socketRegister";
import emitter from "/server/websocket/interactive/threads/emitter";

    //Զ������,��Ӧ����Ϣ�Ƹ�ѯ����
export default function (data, socket) {

    let clients = TR.getStorage("clients");
    let asker = clients[data.items.remoteUid.askerUid];

    emitter(
        0x04,
        {},
        asker
    );
};