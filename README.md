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


package.json:
"bin": {
  "tinyimg": "./bin/tinyimg.js"
},

tinyimg命令对应的可执行文件为 bin/tinyimg.js。
npm会寻找这个文件，在node_modules/.bin

上面代码指定，someTool 命令对应的可执行文件为 bin 子目录下的 someTool.js。Npm会寻找这个文件，在node_modules/.bin/目录下建立符号链接。在上面的例子中，someTool.js会建立符号链接node_modules/.bin/someTool。由于node_modules/.bin/目录会在运行时加入系统的PATH变量，因此在运行npm时，就可以不带路径，直接通过命令来调用这些脚本。