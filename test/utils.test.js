const utils = require('../lib/utils');

test('we get some csv files', (done) => {
  utils.getAllCSVSources('./test/test-data', (err, result) => {
    expect(result.length).toEqual(3);
    expect(result[0].endsWith('.csv')).toBeTruthy();
    done();
  });
});
