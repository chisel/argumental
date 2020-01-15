#!/usr/bin/env node
import path from 'path';
import app from '../../..';

import './common';
import './commands/list';
import './commands/search';
import './commands/image';

app
// Set version from package.json
.version(require(path.resolve(__dirname, '..', 'package.json')).version)
.parse(process.argv);
