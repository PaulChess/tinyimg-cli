# tinyimg-cli
帮你自动完成图片压缩的cli


## 目标
* 上传图片
* 删除(重命名)图片
* 下载图片到本地
* cli指令化调用
* 支持设置压缩次数
* 跳过tinyimg官网上的次数限制

## 技术方案
* 上传、下载调用tinypng接口
* fs覆盖写入图片文件更新
* 支持配置压缩次数
* 随机xff头跳过数量限制

## 使用说明
```javascript
// 下载rmb指令工具, 就是我们这个脚手架
npm i tinypng-com-cli -g
```
### 压缩单张图片
```javascript
tinyimg ${imgPath}
```

### 压缩整个图片目录
```javascript
tinyimg ${imgDirPath}
```

### 设置压缩次数
```javascript
tinyimg ${imgDirPath} -c 3 // 压缩三遍
```

### 递归处理图片中的目录
```javascript
tinyimg ${imgDirPath} -d
```