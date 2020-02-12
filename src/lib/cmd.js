const { Buffer } = require('buffer');
const { exec } = require('child_process');


module.exports = {
  exec: async (command, options = {}) => {
    return new Promise((resolve, reject) => {

      console.log({ command })

      // ansible main.yml -f 30
      /*
        this.options = {
          cwd: this.ansiblePath,
          verbose: true
        };
      */
      // const items = command.split(' ');
      // const items = command.match(/\w+|"[^"]+"/g)
      // console.log({items})
      console.log(`[Gantree] exec: ${command}, ${JSON.stringify(options)}`);
      // const child = exec(items[0], items.slice(1), options);
      const child = exec(command, options);
      if (options.detached) {
        child.unref();
        resolve(child.pid);
        return;
      }
      let match = false;
      let output = new Buffer.from('');

      child.stdout.on('data', (data) => {
        if (options.matcher && options.matcher.test(data)) {
          match = true;
          child.kill('SIGTERM');
          resolve();
          return;
        }
        output = Buffer.concat([output, Buffer.from(data)]);
        if (options.verbose) {
          console.log(data.toString());
        }
      });

      child.stderr.on('data', (data) => {
        output = Buffer.concat([output, Buffer.from(data)]);
        console.log(`[Gantree] Verb: ${options.verbose}`);
        if (options.verbose) {
          console.log(data.toString());
        }
      });

      child.on('close', (code) => {
        if (code !== 0 && !match) {
          console.log(`[Gantree] command: ${command} failed with code: ${code}`);
          reject(new Error(code));
        }
        else {
          resolve(output);
        }
      });
    });
  }
}
