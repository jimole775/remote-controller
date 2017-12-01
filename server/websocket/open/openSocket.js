import tool from "/server/tool/main";
import host from "/server/websocket/interactive/host/host";
import handshake from "../handshake/handshake";

export default function () {
    require('net').createServer(function (socket) {
        socket.on('error', function (e) {
            console.log(e);
        });
        socket.on('data', function (e) {
            let frame = tool.frameDecode(e);
            //��һ������
            if (frame.FIN === 0) {
                console.log("����");
                handshake(e, socket);
            }
            //���ݽ���
            else {
                host(frame, socket);
            }
        });

    }).listen(81, () => {});
}
