const _ = require('lodash');
const utils = require('./lib/utils');
const fs = require('fs');

const argv = require('yargs')
  .argv;

if (require.main === module) {
  console.log(argv);

  if (argv.csvroot && fs.existsSync(argv.csvroot)) {
    utils.getAllCSVSources(argv.csvroot, (err, result) => {
      if (err) throw err;
      _.map(result, (csvPath) => {
        utils.createJSONMapfromCSV(csvPath, (err, result) => {
          utils.writeJSONDefinition(result, './output/', (err, result) => {
            if (err) throw err;
            console.log(result);
          });
        });
      });
    });
  }

  if (argv.jsonroot && fs.existsSync(argv.jsonroot)) {
    utils.getAllJSONSources(argv.jsonroot, (err, result) => {
      if (err) throw err;
      console.log(result);
    });
  }
}


module.exports = utils;
