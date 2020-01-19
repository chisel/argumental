import app from '../../../..';
import { batchDoesNotExist, batchDoesNotExistStr } from '../validators';
import inquirer from 'inquirer';

app

.command('new batch')
.alias('n')
.description('creates a new command batch')

.argument('<batch_name>')
.description('name of the new command batch')
.validate(batchDoesNotExist)

.option('-c --command <command>')
.description('a command to include in the batch')
.required()
.multi()

.option('-a --ask')
.description('asks for batch name and commands interactively instead')
.immediate()

// If ask was provided
.actionDestruct(async ({ opts, suspend }) => {

  if ( ! opts.ask ) return;

  // Prompt questions
  const answer = await inquirer.prompt([
    { name: 'batchName', message: 'Batch name:',
      validate: input => ! input.trim() ? false : batchDoesNotExistStr(input)
    },
    { name: 'commands', message: 'Commands:', type: 'editor' },
    { name: 'confirmed', message: 'Proceed with adding the batch?', type: 'confirm' }
  ]);

  // Cancel
  if ( ! answer.confirmed ) return suspend();

  // Add the new command batch
  app.data<AppData>().config[answer.batchName] = answer.commands.replace(/\r\n/g, '\n').split('\n').filter((cmd: string) => !! cmd.trim());

  // Mark config as changed so the global actions:after event handler saves it
  app.data<AppData>().hasChanges = true;

  // Exit early in the actions middleware
  suspend();

})
// If ask was not provided
.action((args, opts) => {

  // Add the new command batch
  app.data<AppData>().config[args.batchName] = opts.command;

  // Mark config as changed so the global actions:after event handler saves it
  app.data<AppData>().hasChanges = true;

})
