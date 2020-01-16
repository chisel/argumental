#!/usr/bin/env node
import path from 'path';
import app from '../../..';

app
// Set version from package.json
.version(require(path.resolve(__dirname, '..', 'package.json')).version);

// Importing command modules
import './common';
import './commands/list';
import './commands/search';
import './commands/image';

/** NOTE:
* Accessing app at this line will use the last defined command as context unless
* `command()`, `global`, or `top` is called on app.
* Read about chaining and context here: https://github.com/chisel/argumental#chaining-and-context
*/

app.parse(process.argv);
