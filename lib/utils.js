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

function createJSONMapfromCSV(csvFile, callback) {}

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


module.exports.getAllCSVSources = getAllCSVSources;
module.exports.getAllJSONSources = getAllJSONSources;
module.exports.createJSONMapfromCSV = createJSONMapfromCSV;
module.exports.createSynthStubfromCSV = createSynthStubfromCSV;
