import app from '../../../..';
import fs from 'fs';
import path from 'path';

app

.command('load')
.alias('l')
.description('loads a config file and registers all command batches')

.argument('<config>')
.description('path to a config file')
.validate(app.FILE_PATH)
// Validate config file's content and return config object
.validate(async filePath => {

  let content: any;

  try {

    content = JSON.parse(await fs.promises.readFile(path.resolve(process.cwd(), filePath), { encoding: 'utf-8' }));

  }
  catch (error) {

    throw new Error('Config is not a valid JSON!');

  }

  return content;

})
// Validate config structure
.validate(config => {

  if (
    // If config is not an object
    ! config || typeof config !== 'object' || config.constructor !== Object ||
    // If all values are not arrays
    Object.values(config).filter(cmds => ! cmds || typeof cmds !== 'object' || cmds.constructor !== Array).length
  )
    throw new Error('Incorrect config structure!');

})

.option('-o --overwrite')
.description('overwrites any command batches already existing')

.action((args, opts) => {

  // Add command batches
  for ( const key in args.config ) {

    // Skip existing batches if overwrite is false
    if ( app.data<AppData>().config.hasOwnProperty(key) && ! opts.overwrite ) continue;

    app.data<AppData>().config[key] = args.config[key];

  }

  // Mark config as changed so the global actions:after event handler saves it
  app.data<AppData>().hasChanges = true;

});
