# hxm-compress-img
基于tinypng.com帮你自动完成图片压缩的node-cli

### 目标
* cli指令化调用
* 上传、下载调用tinypng接口
* 随机xff头跳过tinyimg官网上的次数限制

### 使用
1. 全局安装
```javascript
npm install -g hxm-compress-img
```

2. 压缩一张图片
```javascript
// `hxm-compress-img`后面跟的是图片路径
hxm-compress-img ./assets/flower.png
```

3. 压缩一整个图片文件夹
```javascript
// `hxm-compress-img后面跟的是图片文件夹路径`
hxm-compress-img ./assets
```

注意: 由于`tinypng`支持上传`png`和`jpg`的图片，压缩时其他文件后缀都会被过滤。图片后缀请提前处理。
