#!/usr/bin/env node

/**
 * @author shenjiaqi
 * @date 2021-03-30
 * @description 图片压缩入口程序
 */
const Liftoff = require('liftoff');
const argv = require('minimist')(process.argv.slice(2));
const version = require('../package.json').version;
const commander = require('commander');
const { exec } = require('child_process');
const tinyImg = require('../command/tinyimg');
// 依赖的基础库
require('../lib/index');

const cli = new Liftoff({
  name: 'spress',
  precessTitle: 'spress',
  moduleName: 'spress',
  extensions: {
    '.js': null
  }
})

class App {
  register(commander, argv, env) {
    commander.version(version, '-v, --version');
    if (argv._.length === 0) {
      exec('tinyimg --help', (err, info) => {
        console.log(info);
      })
    }
    const program = commander
        .description('automatic download images from tinypng.com')
        .option('-p, --path <value>', 'tinypimg image path', '')
        .option('-c, --count <value>', 'compress frequency', '')
        .option('-d, --deep', 'deeploop director', '');
    // action
    program.action(() => {
      tinyImg(argv, env, program);
    });
    commander.parse(process.argv);
  }
}


cli.launch({
  cwd: argv.r || argv.root
}, (env) => {
  // liftoff回调中提供env环境变量
  const appInstance = new App();
  appInstance.register(commander, argv, env);
})
