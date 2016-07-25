const path = require('path');
const fs = require('fs');

const Config = {
  _filePath: path.join(__dirname, '../config.json'),
  load () {
    console.info('filePath: "%s"', this._filePath);
    var json = fs.readFileSync(this._filePath);
    json = JSON.parse(json);
    return json;
  },
  save (newConfig) {
    const jsonStr = JSON.stringify(newConfig, null, 2);
    fs.writeFileSync(this._filePath, jsonStr);
  },
};

module.exports = Config;
