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
const path = require('path');

function getAllCSVSources(root, callback) {
  if (!fs.existsSync(root)) {
    throw `Supplied directory argument ${root} doesn't exist.`
  }
  _getFilesWithExt(root, '.csv', callback);
}

function getAllJSONSources(root, callback) {
  if (!fs.existsSync(root)) {
    throw `Supplied directory argument ${root} doesn't exist.`
  }
  _getFilesWithExt(root, '.json', callback);
}

function loadCSV(file, callback) {
  if (!fs.existsSync(file)) {
    throw `File doesn't exist: ${file}`;
  }
  var options = {
    cast: true,
    // columns: true
  };
  fs.readFile(file, 'utf8', (err, result) => {
    if (err) throw err;
    parse(result, options, (err, table) => {
      if (err) throw err;
      // remove the headers row
      callback(null, _.tail(table))
    });
  });
}

/* filenames should look like: ./some-manufacturer-synth-name.json */
function formatJSONSpecName(data) {
  let fixedName = data.device.model.replace(/[\s]+/g, '-').toLowerCase();
  let fixedManu = data.device.manufacturer.replace(/[\s]+/g, '-').toLowerCase()
  return `${fixedManu}-${fixedName}.json`;
}

function writeJSONDefinition(data, outputDir, callback) {
  let strJSON = JSON.stringify(data, null, '  ');
  let targetPath = path.resolve(path.join(outputDir, formatJSONSpecName(data)));
  fs.writeFile(targetPath, strJSON, callback);
}

function createJSONMapfromCSV(csvFile, callback) {
  loadCSV(csvFile, (err, table) => {
    if (err) throw err;
    midiCSVToJSON(table, callback);
  });
}

function midiCSVToJSON(table, callback) {
  let top;
  let _struct = _.map(table, (param, i) => {
    // stub value range
    if (i === 0) { // fil in the top level object with meta-data

      //   0 manufacturer: 'Elektron',
      //   1 device: 'Analog Four MKII',
      //   2 section: 'CV track LFO2',
      //   3 parameter_name: 'CV track LFO2 depth 1',
      //   4 parameter_description: '',
      //   5 cc_msb: '',
      //   6 cc_lsb: '',
      //   7 cc_min_value: '',
      //   8 cc_max_value: '',
      //   9 nrpn_msb: '3',
      //   10 nrpn_lsb: '97',
      //   11 nrpn_min_value: '0',
      //   12 nrpn_max_value: '127',
      //   13 orientation: '0-based',
      //   14 notes: ''

      let fullName = `${param[0]} ${param[1]}`;
      top = {
        description: `open-midi-rtc-schema specification for ${fullName}`,
        displayName: fullName,
        schemaVersion: "0.0.1",
        implementationVersion: "1.0.0",
        title: `${fullName} Midi Implementation`,
        receives: [
          "NOTE_NUMBER",
          "VELOCITY_NOTE_ON",
          "PITCH_BEND",
          "PROGRAM_CHANGE",
          "CLOCK",
          "CHANNEL_PRESSURE"
        ],
        transmits: [
          "NOTE_NUMBER",
          "VELOCITY_NOTE_ON",
          "VELOCITY_NOTE_OFF",
          "PITCH_BEND",
          "CLOCK",
          "CHANNEL_PRESSURE",
          "PROGRAM_CHANGE"
        ],
        device: {
          description: "Synthesizer",
          deviceType: "SYNTHESIZER",
          displayName: param[1],
          manufacturer: param[0],
          model: param[1],
          name: param[1]
        }
      }
    }
    let _vr = {
      "max": 127,
      "min": 0
    }

    if (param[5] && parseInt(param[5]) > 0) { // is there a CC? filtering out nnrpn for now
      return {
        controlChangeNumber: param[5],
        name: param[3],
        valueRange: _vr
      }
    }
  });
  top.controlChangeCommands = _.compact(_struct);
  callback(null, top);
}

function createSynthStubfromCSV(csvFile, callback) {}

function _getFilesWithExt(root, ext/* eg .csv */, callback) {
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
  midiCSVToJSON: midiCSVToJSON,
  writeJSONDefinition: writeJSONDefinition,
  formatJSONSpecName: formatJSONSpecName
};
