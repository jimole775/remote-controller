/**
 * Created by Andy on 2017/11/4.
 */

import TR from "/server/websocket/socketRegister/socketRegister";
import emitter from "/server/websocket/interactive/threads/emitter";



    //Զ������ѯ�ʣ���ѯ����Ϣ�Ƹ�Э����
export default function (data, socket) {
    let clients = TR.getStorage("clients");
    let helper = clients[data.items.remoteUid.helperUid];
    emitter(
        0x02,
        {
            remoteUid: {
                askerUid: data.items.remoteUid.askerUid,
                helperUid: data.items.remoteUid.helperUid
            },
            RMTResponse: data.items.RMTResponse
        },
        helper
    );
};
