const path = require('path');
const fs = require('fs');

const Config = {
  _filePath: path.join(__dirname, '../config.json'),
  load () {
    console.info('filePath: "%s"', this._filePath);
    var json;
    try {
      json = require(this._filePath);
    } catch (e) {
      throw new Error('Fail to read config file!');
    }
    return json;
  },
  save (newConfig) {
    const jsonStr = JSON.stringify(newConfig, null, 2);
    fs.writeFileSync(this._filePath, jsonStr);
  },
};

module.exports = Config;
