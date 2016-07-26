const path = require('path');
const fs = require('fs');

const defaultConfigPath = path.join(__dirname, '../app/default/def_conf.json');

const Config = {
  _defaultConfig: JSON.parse(fs.readFileSync(defaultConfigPath)),
  _filePath: path.join(__dirname, '../config.json'),
  load () {
    var config = this._defaultConfig;
    var userConfig = JSON.parse(fs.readFileSync(this._filePath));
    Object.assign(config, userConfig);
    return config;
  },
  save (newConfig) {
    const jsonStr = JSON.stringify(newConfig, null, 2);
    fs.writeFileSync(this._filePath, jsonStr);
  },
};



module.exports = Config;
