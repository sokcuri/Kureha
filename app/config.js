const path = require('path');
const fs = require('fs');

const Config = {
  _defaultConfigPath: path.join(__dirname, './default/def_conf.json'),,
  _filePath: path.join(__dirname, '../config.json'),
  load () {
    var config = JSON.parse(fs.readFileSync(this._defaultConfigPath));
    var userConfig = {};
    try {
      userConfig = JSON.parse(fs.readFileSync(this._filePath));
    } catch (e) {
      console.warn('Cannot read "config.json".');
    }
    Object.assign(config, userConfig);
    return config;
  },
  save (newConfig) {
    const jsonStr = JSON.stringify(newConfig, null, 2);
    fs.writeFileSync(this._filePath, jsonStr);
  },
};

module.exports = Config;
