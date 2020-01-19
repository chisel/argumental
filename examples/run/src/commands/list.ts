import app from '../../../..';
import { batchExists } from '../validators';

app

.command('list')
.alias('ls')
.description('lists batches and commands')

.argument('[batch_name]')
.description('batch name to list commands of')
.validate(batchExists)

.action(args => {

  if ( args.batchName === null ) {

    console.log(Object.keys(app.data<AppData>().config).join('\n'));

  }
  else {

    console.log(app.data<AppData>().config[args.batchName].join('\n'));

  }

})
