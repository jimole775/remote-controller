/**
 * Created by Andy on 2017/12/18.
 */

import Rg from "StorageRegister"

let storage = {
    nativeName:null,    // ����ע���ߵ�����
    oppositeName:null,  // ��ʶ�����뱾��ע����ͨ�ŵ�Ŀ�� [������ȷ��˭�ǿ��ƻ���Э���ߣ�]
    helperName:null,    // ��ʶ���ƻ� [����nativeName��oppositeNameƥ�����֪��˭�ǿ��ƻ���Э���ߣ�]
    askerName:null,     // ��ʶ������
    remoteId:0,         // Զ��ҵ���е���� [����nativeName��oppositeNameƥ��Ľ��]
    userList:[],        // ���������û����б���socket������ʵʱ����
    newUserCount:0,     // �����û�����
    isChatting:false,   // ��ʾ�����ı�ʶ
    remoteChanelMap:[],  // ������ڽ���Զ��ͨѶҵ����û�
    name:"userStorage"  // ������ڽ���Զ��ͨѶҵ����û�
};

export default new Rg(storage);