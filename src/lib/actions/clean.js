const chalk = require('chalk');
const process = require('process');

const config = require('../config.js');
const { Platform } = require('../platform.js');


module.exports = {
  do: async (cmd) => {
    const cfg = config.read(cmd.config);

    console.log(chalk.yellow('[Gropius] Cleaning platform...'));
    const platform = new Platform(cfg);
    try {
      await platform.clean();
    } catch (e) {
      console.log(chalk.red(`[Gropius] Could not clean platform: ${e.message}`));
      process.exit(-1);
    }
    console.log(chalk.green('[Gropius] Done'));
  }
}
