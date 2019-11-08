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
  fs.readdir(root, {withFileTypes: true}, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      throw "Result length is unexpectedly 0?";
    }

    let csvFiles = _.compact(_.map(result, (dirObj) => {
      if (dirObj.isDirectory()) {
        // look inside for csv files!
        if (/^[\w]/.test(dirObj.name)) {
          let synthDir = fs.realpathSync([root, dirObj.name].join('/'));
          // return synthDir;
          return  _.map(_.filter(fs.readdirSync(synthDir), (file) => {
            if (file.endsWith('.csv')) {
              return true;
            }
          }), (filename) => {
            return fs.realpathSync([root, dirObj.name, filename].join('/'));
          });
        }
      }
    }));

    callback(null, _.flattenDeep(csvFiles));
  });
}

function createJSONMapfromCSV(csvFile, callback) {}

function createSynthStubfromCSV(csvFile, callback) {}


module.exports.getAllCSVSources = getAllCSVSources;
module.exports.createJSONMapfromCSV = createJSONMapfromCSV;
module.exports.createSynthStubfromCSV = createSynthStubfromCSV;
