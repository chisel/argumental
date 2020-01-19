import app from '../../../..';
import { fileDoesNotExist } from '../validators';
import path from 'path';
import fs from 'fs';

app

.command('export')
.alias('e')
.description('exports the config file')

.argument('<filename>')
.description('path where config should be exported')
.validate(fileDoesNotExist)

.action(async args => {

  // Write config at path
  await fs.promises.writeFile(
    path.resolve(process.cwd(), args.filename),
    JSON.stringify(app.data<AppData>().config, null, 2)
  );

});
