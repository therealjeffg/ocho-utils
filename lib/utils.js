/**

A utility module for translating csv data defining midi parameters from usercamp's data set
into JSON files for use in OCHO.

This utility scans a git checkout of the git repo[1] and produces the following artifacts:
 * JSON cc parameter mappings in a format currently used by the alternative open-midi-rtc-schema
 * when necessary, stub JSON files meant to contain meta-data for a given synth
   that is used by the OCHO max for live device and other devices.

[1] git@github.com:canuckistani/midi.git
**/

const _ = require('lodash');
const fs = require('fs');
const parse = require('csv-parse');

function getAllCSVSources(root, callback) {
  if (!fs.existsSync(root)) {
    throw `Supplied directory argument ${root} doesn't exist.`
  }
  getFilesWithExt(root, '.csv', callback);
}

function getAllJSONSources(root, callback) {
  if (!fs.existsSync(root)) {
    throw `Supplied directory argument ${root} doesn't exist.`
  }
  getFilesWithExt(root, '.json', callback);
}

function loadCSV(file, callback) {
  if (!fs.existsSync(file)) {
    throw `File doesn't exist: ${file}`;
  }
  var options = {
    cast: true,
    columns: true
  };
  fs.readFile(file, 'utf8', (err, result) => {
    if (err) throw err;
    parse(result, options, callback);
  });
}

function createJSONMapfromCSV(csvFile, callback) {
  fs.readfile(csvFile, 'utf8', (err, result) => {
    if (err) throw err;
  });
}

/*
{
  "controlChangeNumber": 1,
  "name": "Modulation",
  "valueRange": {
    "discreteValues": [],
    "max": 127,
    "min": 0,
    "additionalProperties": {}
  },
  "additionalProperties": {}
},
*/

function midiCSVToJSON(table, callback) {
  let _struct = _.map(table, (param) => {
    // stub value rangeRange
    _vr = {
      "max": 127,
      "min": 0
    }

    return {
      controlChangeNumber: param.cc_msb,
      name: param.parameter_name,
      valueRange: _vr
    }
  });
  callback(null, _struct);
}

function createSynthStubfromCSV(csvFile, callback) {}

function getFilesWithExt(root, ext/* eg .csv */, callback) {
  fs.readdir(root, {withFileTypes: true}, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      throw "Result length is unexpectedly 0?";
    }

    let foundFiles = _.compact(_.map(result, (dirObj) => {
      if (dirObj.isDirectory()) {
        if (/^[\w]/.test(dirObj.name)) {
          let synthDir = fs.realpathSync([root, dirObj.name].join('/'));
          // return synthDir;
          return  _.map(_.filter(fs.readdirSync(synthDir), (file) => {
            if (file.endsWith(ext)) {
              return true;
            }
          }), (filename) => {
            return fs.realpathSync([root, dirObj.name, filename].join('/'));
          });
        }
      }
      else {
        if (dirObj.name.endsWith(ext)) {
          return fs.realpathSync([root, dirObj.name].join('/'));
        }
      }
    }));

    callback(null, _.flattenDeep(foundFiles));
  });
}

module.exports = {
  getAllCSVSources: getAllCSVSources,
  getAllJSONSources: getAllJSONSources,
  createJSONMapfromCSV: createJSONMapfromCSV,
  createSynthStubfromCSV: createSynthStubfromCSV,
  loadCSV: loadCSV,
  midiCSVToJSON: midiCSVToJSON
};
