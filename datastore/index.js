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
    console.log("ITEMMMMSSS:", items)
    var data = _.map(items, (file) => {
      // console.log('TEXXXXTT', file)
      // id = id +1
      // // file = file.slice(0,-4)
      // readFile()
      // id = zeroPaddedNumber(id)
      var id = path.basename(file, '.txt')
      return {text: id, id: id};
    });
    callback(null, data);
    // return data
  })
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir,`${id}.txt`), (err, text)=> {
    // console.log(Number(text), 'DAYAAAAA')
    if (err) {
      callback(err)
    } else {
      text = text.toString()
      console.log({id, text})
      callback(null, {id, text})
    }
  })

  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, ((err) => {
      callback(null,  {id, text})
    }))
  };
  })
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
    fs.rm(path.join(exports.dataDir, `${id}.txt`), (err) => {
      if (err) {
        callback(new Error(`No item with id: ${id}`));
      } else {
        callback(null)
      }
    })
  };
  })
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
