/**
 * Created by Andy on 2017/10/31.
 */

let RMT = new Proxy({}, {
    set(target, key, val){
        return  Reflect.defineProperty(target,key,{
            configurable:true,
            writable:false,
            value:new Proxy(function() {}, {
                apply: function(target, thisArg, argumentsList) {
                    distributorHandler(key, argumentsList);
                    console.log('called: ' + argumentsList.join(', '));
                    return Reflect.apply(val, thisArg, argumentsList);
                }
            })

        });
    }
});

RMT.uiRouter = function ($state, newUrl, params) {

    if(!newUrl && !params) return;
    let curUrl = window.location.hash.split("/").pop();

    if (curUrl == newUrl.split("/").pop()) {
        console.log("do nothing~");
    } else {
        window.location.replace(window.location.href + newUrl + "?" + JSON.stringify(params?params:""));
    }

};


function distributorHandler(fnName, params){
    //return (...args) => {
    //    console.log("�ɷ����ݣ�", args);
    //    let temp = [], RMT_params = "";
    //    let len = args.length, i = 0;
    //
    //    /**�����в���������ִ�����ÿ������֮����ӡ�_|_�����ţ�*/
    //    while (i < len) {
    //        temp[i] = typeof args[i] === "string" ? args[i] : JSON.stringify(args[i]);
    //        if (i === len - 1) RMT_params += temp[i++];                      //��� �����һ��,�Ͳ��ü�"_|_" ����
    //        else RMT_params += temp[i++] + "_|_";       //������Զ��ҵ��Ĳ���!,ȫ��ת���ִ�,��"_|_"Ϊ�ָ���!
    //    }
    //
    //    dataEmitter(type, fnName, RMT_params);
    //
    //    /**������ִ�еĲ�������argumentsƴ�����飬Ȼ��ʹ��apply���е���*/
    //    let local_params = [];                                              //ֱ�ӻ�ȡ���غ�����ִ�в���
    //    let local_len = args.length, k = 0;                            //ֱ�ӻ�ȡ���غ�����ִ�в���
    //    while (k < local_len) local_params[k] = args[k++];             //ֱ�ӻ�ȡ���غ�����ִ�в���
    //    //ֱ�ӻ�ȡ���غ�����ִ�в���
    //    callback.apply(window, local_params);
    //};
    console.log(fnName, params);
}

export default RMT;