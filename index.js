const utils = require('./lib/utils');

const argv = require('yargs')
  .argv;

if (require.main === module) {
  console.log(argv);
  utils.getAllCSVSources(argv.root, (err, result) => {
    if (err) throw err;

    console.log(result);
  });
}
