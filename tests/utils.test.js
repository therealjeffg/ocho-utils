const utils = require('../lib/utils');
const fs = require('fs');
const _ = require('lodash');

test('we get some csv files', (done) => {
  utils.getAllCSVSources('./tests/test-data/csv', (err, result) => {
    if (err) throw err;
    expect(result.length).toEqual(3);
    expect(result[0].endsWith('.csv')).toBeTruthy();
    done();
  });
});

test('we get some json files', (done) => {
  utils.getAllJSONSources('./tests/test-data/json', (err, result) => {
    if (err) throw err;
    expect(result.length).toEqual(4);
    expect(result[0].endsWith('.json')).toBeTruthy();
    done();
  });
});

test('we can load a csv file.', (done) => {
  utils.loadCSV('./tests/test-data/csv/one/Neutron.csv', (err, result) => {
    if (err) throw err;
    expect(result).toBeTruthy();
    expect(result[0]).toBeTruthy();
    expect(result[0][0]).toEqual('Behringer');
    done();
  });
});

test('cc conversion', (done) => {
  utils.loadCSV('./tests/test-data/csv/one/Neutron.csv', (err, result) => {
    if (err) throw err;
    utils.midiCSVToJSON(result, (err, device) => {
      expect(device).toBeTruthy();
      expect(device.controlChangeCommands[0].controlChangeNumber).toEqual(1);
      expect(device.controlChangeCommands[0].name).toEqual('Modulation wheel');
      done();
    });
  });
});

// synchronous test!!
test('json output file name formatting', () => {
  let mock = {
    device: {
      model: 'some Major Synth',
      manufacturer: 'Dave Smith Instruments'
    }
  };
  let name = utils.formatJSONSpecName(mock);
  expect(name).toEqual('dave-smith-instruments-some-major-synth.json');
});

test('json spec file creation', (done) => {
  utils.loadCSV('./tests/test-data/csv/one/Neutron.csv', (err, result) => {
    if (err) throw err;
    utils.midiCSVToJSON(result, (err, device) => {
      utils.writeJSONDefinition(device, './tests/output', (err, result) => {
        // done();
        let likelyFile = './tests/output/behringer-neutron.json';
        expect(fs.existsSync('./tests/output/behringer-neutron.json')).toBeTruthy();
        var data = JSON.parse(fs.readFileSync(likelyFile));
        expect(data.description).toEqual('open-midi-rtc-schema specification for Behringer Neutron');
        expect(data.displayName).toEqual('Behringer Neutron');
        expect(data.device.displayName).toEqual('Neutron');
        expect(data.controlChangeCommands.length).toBeGreaterThan(1);
        done();
      });
    });
  });
});
