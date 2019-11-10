const utils = require('../lib/utils');

test('we get some csv files', (done) => {
  utils.getAllCSVSources('./test/test-data/csv', (err, result) => {
    expect(result.length).toEqual(3);
    expect(result[0].endsWith('.csv')).toBeTruthy();
    done();
  });
});

test('we get some json files', (done) => {
  utils.getAllJSONSources('./test/test-data/json', (err, result) => {
    expect(result.length).toEqual(4);
    expect(result[0].endsWith('.json')).toBeTruthy();
    done();
  });
});
