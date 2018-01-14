/**
 * Created by Andy on 2017/12/16.
 */

export default function ({prayload, wsService, userStorage, ngTool}) {
    ngTool.alert.loading.hide();
    userStorage.setStorage("remoteId", prayload.serverData.remoteId);
    userStorage.setStorage("askerName", prayload.serverData.remoteUid.askerUid);
    userStorage.setStorage("helperName", prayload.serverData.remoteUid.helperUid);
    window.location.hash = `#!home`;    //Զ��Э��ҵ��ʼ�����˶�������ҳ
    if(prayload.serverData.remoteId == 1){
        // ������
        userStorage.setStorage("oppositeName", prayload.serverData.remoteUid.helperUid);

    }

    if(prayload.serverData.remoteId == 2){

        // Э����
        userStorage.setStorage("oppositeName", prayload.serverData.remoteUid.askerUid);

    }

    return userStorage;
};

