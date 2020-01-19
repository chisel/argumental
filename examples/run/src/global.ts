import app from '../../..';
import fs from 'fs';
import path from 'path';
import os from 'os';

const configPath = path.resolve(os.homedir(), '.run-config.json');

app
.global
// Before any validators run on any command
.on('validators:before', async () => {

  // Provide config file globally
  if ( fs.existsSync(configPath) ) {

    app.data<AppData>().config = JSON.parse(await fs.promises.readFile(configPath, { encoding: 'utf-8' }));
    return;

  }

  // Create empty config
  await fs.promises.writeFile(configPath, '{}', { encoding: 'utf-8' });
  app.data<AppData>().config = {};

})
// After all action handlers of any command
.on('actions:after', async () => {

  // Save the config file if it has changes
  if ( app.data<AppData>().hasChanges ) {

    await fs.promises.writeFile(configPath, JSON.stringify(app.data<AppData>().config, null, 2), { encoding: 'utf-8' });

  }

});
