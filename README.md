# Argumental

Argumental is a framework for building CLI applications using Node.js, which enables fast development through defining an easy-to-use API.

# Installation

```bash
npm install argumental -g
```

# Quick Start

TypeScript/ES6:
```ts
#!/usr/bin/env node
import app from 'argumental';
```

CommonJS:
```js
#!/usr/bin/env node
const app = require('argumental');
```

```js
app
// Defines app version
.version('1.0.0')
// Defines a command with description
.command('add file', 'Adds a new file to the editor')
// Defines an alias for command "add file"
.alias('a')
// Defines a required argument for "add file" command with description and file validation
.argument('<file_path>', 'Relative path to the file', app.FILE_PATH)
// Defines an optional argument for "add file" command with description
.argument('[new_filename]', 'A new filename to use')
// Defines an option for "add file" command with description
.option('-d --delete', 'Deletes the source file after copying')
// Defines an action for "add file" command
.action((args, opts) => {

  // example: editor add file ./document.md newDocument.md --delete
  console.log(args); // { filePath: './document.md', newFilename: 'newDocument.md' }
  console.log(opts); // { d: true, delete: true }

})
// Parses the process arguments and builds the app
.parse(process.argv);
```

# API

## Commands

## Arguments

## Options

## Actions

## Aliases

## Version

## Globals

## Validation

# Tests

Run the unit tests built with Mocha and Chai:

```bash
npm test
```

# Building The Source

Run the following commands to build and install from source code:

```bash
git clone git@github.com:chisel/argumental.git
cd argumental
npm install
npm start
npm link
```
