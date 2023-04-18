const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
// const zeroPaddedNumber = require('./counter')
const sprintf = require('sprintf-js').sprintf;


var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////


exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, ((err) => {
        callback(null,  {id, text})
      }));
  })
};

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

exports.readAll = (callback) => { //check if there is any data, if not pass errBack, if NO ERROR, pass null
  fs.readdir(path.join(exports.dataDir), (err,items)=> {
    var data = _.map(items, (text, id) => {
      id = id +1
      text = text.slice(0,-4)
      id = zeroPaddedNumber(id)
      return {text, id};
    });
    callback(null, data);
    return data
  })
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
