
/**
 * Created by Andy on 2017/3/14.
 */
import TR from "/server/websocket/socketRegister/socketRegister";

import close from "../threads/close";
import pushNameMap from "../threads/pushNameMap";
import distributeUid from "../threads/distributeUid";
import connectAsk from "../threads/connectAsk";
import connectAccept from "../threads/connectAccept";
import connectReject from "../threads/connectReject";
import interActivePassageway from "../threads/interActivePassageway";

export default function (frame, socket) {
    switch (frame.Opcode) {
        case 8:
            let msg = frame.PayloadData.slice(2).toString();
            console.log("�Ự�Ѿ�����:", socket, msg);
            socket.end();
            if (msg)if (/^[\{\[]/.test(msg))close(JSON.parse(msg), socket);
            break;
        default :
            TR.setStorage("opcode",frame.Opcode);
            let data = JSON.parse(frame.PayloadData.toString()) || "";
            switch (data.status) {
                case 0x00:
                    pushNameMap(data, socket);
                    break;
                case 0x01: //���map����û�д��û����ʹ洢session�������û���
                    distributeUid(data, socket);
                    break;
                case 0x02:    //Э��ͨ����ѯ��
                    connectAsk(data, socket);
                    break;
                case 0x03:  //Э��ͨ����Ӧ��
                    connectAccept(data, socket);
                    break;
                case 0x04:
                    connectReject(data, socket);
                    break;
                case 0x05:    //Զ��Э������ͨ��
                    interActivePassageway(data);
                    break;
                case 0x06:
                    break;
                case 0x07:
                    break;
                case 0xFF: //�Ͽ�Э��ͨ��//�ر�ws
                    //that.close(data);
                    //console.log("�ж�Զ���û�");
                    break;
                default :
                    break;
            }
            break;
    }
};
