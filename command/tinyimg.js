const path = require('path');
const fs = require('fs');
const https = require('https');
const chalk = require('chalk');
const Figures = require('figures');

const basicConf = {
  exts: ['.jpg', 'jpeg', '.png'],
  max: 5000000,
  files: {}
}

class TinyImg {
  constructor(imgEntryPath, compressCount, isDeep) {
    this.conf = {
      ...basicConf,
      imgEntryPath,
      compressCount,
      isDeep
    }
  }

  compress(imgEntryPath = this.conf.imgEntryPath) {
    try {
      const filePath = path.join(imgEntryPath);
      if (!fs.existsSync(filePath)) {
        return global.tinyimg.log.error(chalk.red('目录或文件不存在!'));
      }
      const status = fs.statSync(filePath);
      if (!status.isDirectory()) {
        this.handleImgFile(status.isFile(), status.size, filePath);
      } else {
        fs.readdirSync(filePath).forEach(file => {
          const fullFilePath = path.join(filePath, file);
          const fileStatus = fs.statSync(fullFilePath);
          this.handleImgFile(fileStatus.isFile(), fileStatus.size, fullFilePath);
          // 是否深度递归处理文件夹
        })
      }
    } catch (e) {
      global.tinyimg.log.error(chalk.red(e.message));
    }
  }

  handleImgFile(isFile, fileSize, file) {
    if (this.isTinyImgFile(isFile, fileSize, file)) {
      this.fileUpload(file);
    }
  }

  // 校验文件安全性/后缀名/大小限制
  isTinyImgFile(isFile, fileSize, file) {
    return isFile
      && this.conf.exts.includes(path.extname(file))
      && fileSize < this.conf.max;
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // 请求体
  buildRequestParams() {
      const TINYIMG_URL = ['tinyjpg.com', 'tinypng.com'];
      return {
          method: 'POST',
          hostname: TINYIMG_URL[this.getRandomInt(0, 2)],
          path: '/web/shrink',
          headers: {
              rejectUnauthorized: false,
              'X-Forwarded-For': this.getRandomIP(),
              'Cache-Control': 'no-cache',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Postman-Token': Date.now(),
              "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
          }
      };
  }

  getRandomIP() {
    return Array.from(Array(4)).map(() => parseInt(Math.random() * 255)).join('.')
  }


  // 图片上传，返回的结果就是压缩后的图片
  fileUpload(imgPath) {
    return new Promise((resolve, reject) => {
      const req = https.request(this.buildRequestParams(), res => {
        res.on('data', buffer => {
          const postInfo = JSON.parse(buffer.toString());
          if (postInfo.error) {
            global.tinyimg.log.error(chalk.red(`压缩失败！\n 当前文件：${imgPath} \n ${postInfo.message}`));
            reject(postInfo.error);
          } else {
            // 更新本地图片
            this.fileUpdate(imgPath, postInfo);
            resolve(postInfo);
          }
        })
      })
      req.write(fs.readFileSync(imgPath), 'binary');
      req.on('error', err => global.tinyimg.log.error(chalk.red(`请求错误! \n 当前文件：${imgPath} \n, e)`)));
      req.end();
    })
  }

  fileUpdate(entryImgPath, info) {
    const options = new URL(info.output.url);
    const req = https.request(options, res => {
      let body = '';
      res.setEncoding('binary');
      res.on('data', data => {
        body += data;
      });
      res.on('end', () => {
        fs.writeFile(entryImgPath, body, 'binary', err => {
          if (err) {
            return global.tinyimg.log.error(chalk.green.red(log));
          }
          let log = '';
          let oldSize = `${(info.input.size / 1024).toFixed(2)}KB`;
          let newSize = `${(info.output.size / 1024).toFixed(2)}KB`;
          let ratio = `${((1 - info.output.ratio) * 100).toFixed(2)}%`
          log = `${Figures.tick} Compressed [${chalk.yellowBright(entryImgPath)}] completed: Old Size ${chalk.yellowBright.bold(oldSize)}, New Size ${chalk.yellowBright.bold(newSize)}, Optimization Ratio ${chalk.yellowBright.bold(ratio)}`;
          global.tinyimg.log.info(chalk.green(log));
        });
      });
    });
    req.on('error', e => global.tinyimg.log.error(chalk.green.bold(e)));
    req.end();
  }


  /**
   * from webpack-tiny
   */
  uploadImg(imgPath) {
    return new Promise((resolve, reject) => {
      const req = https.request(this.buildRequestParams(), res => {
        res.on('data', buffer => {
          const postInfo = JSON.parse(buffer.toString());
          postInfo.error ? reject(postInfo.message) : resolve(postInfo)
        });
      });
      req.write(fs.readFileSync(imgPath), 'binary');
      req.onError(err => reject(err));
      req.end();
    })
  }

  /**
   * from webpack-tiny
   * @param {*} remoteImgUrl 
   * @returns 
   */
  downloadImg(remoteImgUrl) {
    const urlOptions = new Url.URL(remoteImgUrl);
    return new Promise((resolve, reject) => {
      const req = https.request(urlOptions, res => {
        let file = '';
        res.setEncoding('binary');
        res.on('data', chunk => file += chunk);
        res.on('end', () => resolve(file));
      });
      req.on('error', err => reject(err));
      req.end();
    });
  }
}

module.exports = function (argv, env, program) {
  const imgEntryPath = argv._[0] || program.path;
  const compressCount = argv._[1] || program.count;
  const isDeep = program.deep || program.d;
  const tinyImg = new TinyImg();
  tinyImg.compress(imgEntryPath, compressCount, isDeep);
}
