### ���ʹ������Ȱ�װ����

[Node](https://nodejs.org)

[Git](http://www.git-scm.com/downloads)(�Ǳ��裬���Ƽ�)

### �����������ظ���������

���������н���windowsϵͳΪ����, ���Էֿ��������أ������Ⱥ�

* webpack
```bash
$ npm install webpack --save-dev
```

* jade��Ҫʹ��jade������Ҫ��װһ��express����Ȼ����Ŀ��δʹ�õ�express���κ�API
```bash
$ npm install express jade --save-dev
```

* babel��ES6,7����Ҫ���ع���
```bash
$ npm install babel-loader babel-core babel-preset-es2015 babel-polyfill --save-dev
```

* css����Ϊsass������node-sass������һ������
```bash
$ npm install css-loader style-loader sass-loader node-sass --save-dev
```

* file����Ҫ���ڴ���ͼƬ�ļ���
```bash
$ npm install image-webpack-loader url-loader file-loader --save-dev
```

### ������Ŀ

����������װ���֮�󣬾Ϳ���ʹ�� webpack ������д��

* �������ɹ����ڸ�Ŀ¼��������ָ��Կ�����Ŀ

```bash
$ node server/bundle.node.js
```

�����ɹ�֮�󣬴򿪵�ַ 127.0.0.1:1110 ���ܴ󹦸����

* ��Ҫ����Զ�̲����Ļ�������˫���ɣ������ȽϷ���㣨����Chrome������������������δ���ԣ�ʹ��ʱ����������׼������
