const path = require('path');
const fs = require('fs');

const Config = {
  _filePath: path.join(__dirname, '../config.json'),
  load () {
    console.info('filePath: "%s"', this._filePath);
    try {
      let json = fs.readFileSync(this._filePath);
      json = JSON.parse(json);
      return json;
    }
    catch (e) {
      console.warn("Cannot read `config.json`. Reading default configuration.");
      let json = fs.readFileSync(path.join(__dirname, 'default/def_conf.json'));
      json = JSON.parse(json);
      return json;
    }
  },
  save (newConfig) {
    const jsonStr = JSON.stringify(newConfig, null, 2);
    fs.writeFileSync(this._filePath, jsonStr);
  },
};

module.exports = Config;
