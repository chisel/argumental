#!/usr/bin/env node
import path from 'path';
import app from '../../..';

import './global';
import './commands/top';
import './commands/new-batch';
import './commands/delete-batch';
import './commands/list';
import './commands/load';
import './commands/export';

app
.version(require(path.resolve(__dirname, '..', 'package.json')).version)
.parse(process.argv);
