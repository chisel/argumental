import app from '../../../..';
import { batchExists } from '../validators';

app

.command('delete batch')
.alias('d')
.description('deletes a command batch')

.argument('<batch_name>')
.description('name of an existing command batch')
.validate(batchExists)

.action(args => {

  // Add the new command batch
  delete app.data<AppData>().config[args.batchName];

  // Mark config as changed so the global actions:after event handler saves it
  app.data<AppData>().hasChanges = true;

})
