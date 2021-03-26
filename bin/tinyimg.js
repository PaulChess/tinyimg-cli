#!/usr/bin/env node

const Liftoff = require('liftoff');

const cli = new Liftoff({
  name: 'tinyimg',
  processTitle: 'tinyimg',
  moduleName: 'tinyimg',
  extensions: {
    '.js': null
  }
})