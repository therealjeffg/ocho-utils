const utils = require('../lib/utils');
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
    expect(_.keys(result[0])[0]).toEqual('manufacturer');
    expect(result[0].manufacturer).toEqual('Behringer');
    done();
  });
});

test('cc conversion', (done) => {
  utils.loadCSV('./tests/test-data/csv/one/Neutron.csv', (err, result) => {
    if (err) throw err;
    utils.midiCSVToJSON(result, (err, jsonParams) => {
      expect(jsonParams).toBeTruthy();
      expect(jsonParams.length).toEqual(2);
      expect(jsonParams[0].controlChangeNumber).toEqual(1);
      expect(jsonParams[0].name).toEqual('Behringer Neutron');
      done();
    });
  });
});
