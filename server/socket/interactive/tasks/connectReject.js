/**
 * Created by Andy on 2017/11/4.
 */

import TR from "wsServer/services/socket.storage/socketStorage";
import emitter from "../../emitter/emitter.js";
    //Զ������,��Ӧ����Ϣ�Ƹ�ѯ����
export default function (socket, data) {

    let clients = TR.getStorage("clients");
    let asker = clients[data.remoteUid.askerUid];

    emitter(
        0x04,
        {},
        asker
    );
};