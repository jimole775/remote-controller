/**
 * Created by Andy on 2017/12/16.
 */

export default function ({prayload, wsService, userStorage, ngTool}) {
    ngTool.alert.loading.hide();
    userStorage.setStorage("remoteId", prayload.serverData.remoteId);
    userStorage.setStorage("askerName", prayload.serverData.remoteUid.askerUid);
    userStorage.setStorage("helperName", prayload.serverData.remoteUid.helperUid);
    window.location.hash = `#!home`;    //Զ��Э��ҵ��ʼ�����˶�������ҳ
    if (prayload.serverData.remoteId == 1) {
        // ������
        userStorage.setStorage("oppositeName", prayload.serverData.remoteUid.helperUid);

        document.body.getElementsByTagName("section")[0].style.pointerEvents = "none";
        document.body.getElementsByTagName("footer")[0].style.pointerEvents = "none";

    }

    if (prayload.serverData.remoteId == 2) {

        // Э����
        userStorage.setStorage("oppositeName", prayload.serverData.remoteUid.askerUid);

    }

    return userStorage;
};

