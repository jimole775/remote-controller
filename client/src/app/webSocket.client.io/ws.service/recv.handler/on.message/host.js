/**
 * Created by Andy on 2017/12/15.
 */
import addUsers from "./tasks/addUsers.js";
import connectSniff from "./tasks/connectSniff.js";
import signConnectedUser from "./tasks/signConnectedUser.js";
import signDisconnectUser from "./tasks/signDisconnectUser.js";
import acceptConnect from "./tasks/acceptConnect.js";
import rejectConnect from "./tasks/rejectConnect.js";
import reduceUser from "./tasks/reduceUser.js";
import disconnectChanel from "./tasks/disconnectChanel.js";
import heartBeat from "./tasks/heartBeat.js";
import charSystem from "./tasks/charSystem.js";
import remoteAjax from "./tasks/remoteAjax.js";
import receiverClickEvent from "./tasks/receiverClickEvent.js";
import callbackStorage from "../../callback.storage/callbackStorage.js";
import activeRemoteEventsListener from "./tasks/activeRemoteEventsListener.js";
import activeRemoteScrollListener from "./tasks/activeRemoteScrollListener.js";
import takeRemoteScrollCoordinate from "./tasks/takeRemoteScrollCoordinate.js";


export default function ({
    response, $rootScope, wsService, ngTool, wsTool, userStorage, charState
    }) {
    wsTool.blobDiscompiler(response.data, function (prayload) {

        if (!prayload) return;

        // ����ͻ��˴��лص��ģ����ȴ���
        if(prayload.clientData && prayload.clientData.callbackId !== undefined){
            let callbackId = prayload.clientData.callbackId;
            let callback = callbackStorage.getStorage(callbackId)[0] || function(){};
            let callbackParams = callbackStorage.getStorage(callbackId)[1] || [];
            callbackParams.unshift(prayload);
            callback.apply(null,callbackParams);
            callbackStorage.delStorage(callbackId);
        }

        let params = {
            $rootScope,
            ngTool,
            wsTool,
            prayload,
            wsService,
            userStorage,
            charState
        };

        switch (prayload.status) {
            case 0x00:  // �����00���ͷ���һ���Ք��������F����
                heartBeat(params);
                break;
            case 0x01:  // ˢ���û��б�
                $rootScope.$emit(addUsers(params));
                break;
            case 0x02:  // Э��ͨ����ѯ��
                $rootScope.$emit(connectSniff(params));
                break;
            case 0x03:  // ����Զ��Э����������ͨ��(˫��ִ��)
                $rootScope.$emit(acceptConnect(params));
                activeRemoteEventsListener(params);
                activeRemoteScrollListener(params);
                break;
            case 0x04:  // �ܾ�Զ��Э��
                $rootScope.$emit(rejectConnect(params));
                break;
            case 0x05:  // Զ��Э������ͨ��
                $rootScope.$emit(receiverClickEvent(params));
                break;
            case 0x06:  // �������Զ��ҵ����û�
                $rootScope.$emit(signConnectedUser(params));
                break;
            case 0x07:  // ȡ���������Զ��ҵ����û�
                $rootScope.$emit(signDisconnectUser(params));
                break;
            case 0x08:  // �������ݽ���
                $rootScope.$emit(charSystem(params));
                break;
            case 0x09:  // ����Զ��ҵ����ajax����ͬ��
                $rootScope.$emit(remoteAjax(params));
                break;
            case 0x0A:  // ����Զ��ҵ����scroll����ͬ��
                $rootScope.$emit(takeRemoteScrollCoordinate(params));
                break;
            case 0xFE:  // �h�������˵��û�
                $rootScope.$emit(reduceUser(params));
                break;
            case 0xFF:  // �Ͽ�Э��ͨ��֪ͨ
                $rootScope.$emit(disconnectChanel(params));
                break;
            default :
                break;
        }
    });

};
