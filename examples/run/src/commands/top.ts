import app from '../../../..';
import child from 'child_process';
import { batchExists } from '../validators';

app
.top

.argument('<batch_name>')
.description('name of a command batch to run')
.validate(batchExists)

.argument('[...vars]')
.description('variables to insert into the command batch')
// Wrap all variables with "" if they contain spaces
.sanitize(vars => vars.map((v: string) => v.includes(' ') ? `"${v}"` : v))
.default([])

.action(async args => {

  // Read commands from config
  const commands = app.data<AppData>().config[args.batchName]
  // Insert variables into commands
  .map(cmd => {

    // Insert numbered variables (e.g. $0, $1, $2, $3, etc.)
    for ( let i = 0; i < args.vars.length; i++ ) {

      cmd = cmd.replace(`$${i}`, args.vars[i]);

    }

    // Remove any numbered variables left
    cmd = cmd.replace(/\$\d+/g, '');

    // Insert wildcard variables (e.g. $*)
    cmd = cmd.replace(/\$\*/g, args.vars.join(' '));

    return cmd;

  });

  // Run the commands in order
  for ( const cmd of commands ) {

    const result = await new Promise(resolve => {

      child.exec(cmd, { cwd: process.cwd(), windowsHide: true }, (error, stdout, stderr) => {

        if ( error || stderr ) return resolve(error || new Error(stderr));

        resolve(stdout);

      });

    });

    // Stop the batch if error occurred
    if ( result instanceof Error ) {

      console.error(result.message);
      break;

    }

    console.log(result);

  }

});
