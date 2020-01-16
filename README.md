![Argumental](./images/display.png)

Argumental is a framework for building CLI applications using Node.js, which enables fast development by providing an easy-to-use API with a middleware stack system.

With Argumental, you can:

  - Develop CLI apps faster by reusing code through a middleware stack system
  - Create middleware stacks for input validation and sanitization
  - Improve code readability by using an easy-to-understand API
  - Design modular code
  - ...and beyond!

# Index

  1. [Installation](#installation)
  2. [Quick Start](#quick-start)
  3. [API](#api)
  4. [Chaining And Context](#chaining-and-context)
  5. [Validation](#validation)
  6. [Rest Arguments](#rest-arguments)
  7. [Destructuring Parameters](#destructuring-parameters)
  8. [Modular Design](#modular-design)
  9. [Extras](#extras)
  10. [Examples](#examples)
  11. [Tests](#tests)
  12. [Developer Documentation](#developer-documentation)
  13. [Building The Source](#building-the-source)

# Installation

```bash
npm install argumental
```

> **NOTE:** Supports Node.js 6 or higher (ES2016).

# Quick Start

TypeScript/ES6 module:
```ts
#!/usr/bin/env node
import app from 'argumental';
```

CommonJS module:
```js
#!/usr/bin/env node
const app = require('argumental');
```

Defining command **copy file &lt;target&gt; &lt;destination_dir&gt; --delete --save-as &lt;filename&gt;**:

```ts
app
.version('1.0.0')
.command('copy file', 'copies a file')
.argument('<target>', 'target file path')
.argument('<destination_dir>', 'destination directory path')
.option('-d --delete', 'deletes the source file after copying (moving the file)')
.option('--save-as <filename>', 'a filename to use for the new file')
.action((args, opts, cmd) => {

  // Example: copy file ./document.md ~/Documents -d --save-as new-document.md
  console.log(args);  // { target: './document.md', destinationDir: '~/Documents' }
  console.log(opts);  // { d: true, delete: true, saveAs: 'new-document.md' }
  console.log(cmd);   // 'copy file'

})
.parse(process.argv);
```

# API

The [API reference](./docs/API.md) documents all available methods on the app object. The rest of this documentation assumes you are familiar with Argumental's API.

# Chaining And Context

Each call to the `command()` method determines that until this method is called again, all calls to other methods are within this command's context. Example:

```js
app
.command('command1')
.argument('[arg1]')               // Defined for command1
.option('--option1')              // Defined for command1
.action(() => { })                // Defined for command1
// Changing context
.command('command2')
.argument('[arg2]')               // Defined for command2
.alias('c2')                      // Defined for command2
.action(() => { })                // Defined for command2
.parse(process.argv);
```

If command is not called at the start of the chain, all declarations will be applied on "top-level". Example:

The following defines **app &lt;arg1&gt; --force** (considering application name is `app`, e.g. `npm install app -g`):
```js
app
.argument('<arg1>')
.option('--force')
.action(() => { })
.parse(process.argv);
```

> **NOTE:** Top-level declaration can also be enabled anywhere in the chain by using the `top` property.

Arguments, options, and actions can also be defined on a global context and applied to all commands (excluding top-level) using the `global` property. Example:

```js
app
.global
// Define for all commands
.option('--silent', 'Disables logs produced by this command')
.command('command1')
.actionDestruct(({ opts }) => {
  if ( ! opts.silent ) console.log('command1 used');
})
.command('command2')
.actionDestruct(({ opts }) => {
  if ( ! opts.silent ) console.log('command2 used');
})
.global
// Perform after all commands
.actionDestruct(({ opts, cmd }) => {
  if ( ! opts.silent ) console.log(`command ${cmd} has finished`);
})
.parse(process.argv);
```

When defining on global context, all definitions will be appended to previous and prepended to future commands.

> **NOTE:** You cannot define aliases on global context.

# Validation

Validators are functions that take a user-provided argument value and check it based on specific rules. If validation fails, validators must throw or return an error with a custom message to display to the user.

If a validator returns a value, that value will overwrite user's original value (as long as the returning value is not an error object). This behavior allows type casting and input sanitization.

Validator functions take the following parameters:
  - **value**: The argument or option's value at its current state.
  - **name**: The argument or option name.
  - **arg**: Boolean indicating whether value belongs to an argument or an option.
  - **cmd**: The name of the invoked command.
  - **suspend**: A function to call when suspending next validators from running.

> **NOTE:** If validator function is provided through `validateDestruct()` or `sanitizeDestruct()`, all parameters will be provided inside one object to enable [destructuring](#destructuring-parameters).

```js
app
.command('command1')
.argument('<arg1>', 'description', value => value.toLowerCase())
.parse(process.argv);
```

> **NOTE:** If a validator function only changes the user input and does not throw or return any errors, the `sanitize()` method can be used instead to improve readability.

If multiple validators are provided as an array, they will execute one-by-one in order and may change the argument value multiple times. They can also return a promise for async execution.

```js
function validator1(value, arg, name) {

  // Validate
  if ( ! ['value1', 'value2'].includes(value.trim().toLowerCase()) )
    throw new Error(`Invalid value for ${arg ? 'argument' : 'option'} ${name}!`);

  // Sanitize
  return value.trim().toLowerCase();

}

async function validator2(value) {

  await someAsyncOperation(value);

}

app
.command('command1')
.argument('<arg1>', 'description', [validator1, validator2])
.parse(process.argv);
```

> **NOTE:** Built-in validators cannot be used on `validateDestruct()` and `sanitizeDestruct()` methods.

For convenience, you can provide regular expressions instead of validator functions to validate string values. Keep in mind that if the value has changed because of a previous validator to anything other than a string, the regular expression will fail the validation.

```js
app
.command('command1')
// Only accept files with .js extension
.option('-f --file [path]', 'description', false, /.+\.js$/i)
.parse(process.argv);
```

> **NOTE:** Validators will be skipped when no value is provided for optional arguments or if defined on boolean options.

# Rest Arguments

Rest arguments capture all values into one array and are useful for use cases where multiple values is expected and the number of provided values is unknown.

```ts
app
.argument('<...args>')
.action(args => {

  // Example: app arg1 arg2 arg3
  console.log(args); // { args: ['arg1', 'arg2', 'arg3'] }

})
.parse(process.argv);
```

Things to keep in mind about rest arguments:
  - No arguments can be defined after a rest argument.
  - If rest argument is required, app will enforce users to provide at least one value for the argument.
  - Regular expression [validators](#validation) will run for each value provided for the rest argument, while function [validators](#validation) will run on the whole array of values.
  - Default value will be set instead of the whole array and not each value in the array.
  - Options do not support rest arguments. If multiple values is expected for an option, use the [`multi` API](#multivalue) instead.
  - When using the built-in validators, use the plural version for rest arguments (e.g. `app.STRINGS` instead of `app.STRING`).

# Destructuring Parameters

Considering the following app:

```ts
app
.argument('<name>')
.action((args, opts, cmd, suspend) => {

  // Do stuff

  if ( args.name === 'value' ) suspend(); // Exit early

})
.action(args => {

  // Do more stuff

})
.parse(process.argv);
```

In the first action handler, we're exiting early when a condition is met using the `suspend()` method. However, the first action handler does not use the `opts` and `cmd` parameters but because access to `suspend` is needed, we're forced to take the first four parameters in.

We can improve our code's readability by using the `actionDestruct()` substitute and the [destructuring assignment syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

Unlike `action()`, `actionDestruct()` provides all the parameters in one object and therefore allows accessing specific parameters as needed:

```ts
app
.argument('<name>')
.actionDestruct(({ args, suspend }) => {

  // Do stuff

  if ( args.name === 'value' ) suspend(); // Exit early

})
.action(args => {

  // Do more stuff

})
.parse(process.argv);
```

This principle is also applied to `validateDestruct()` and `sanitizeDestruct()` methods as well.

# Modular Design

The following demonstrates how various modules can be defined to perform specific tasks in Argumental:

**Global Module** (runs before all others)
```ts
import app from 'argumental';
// Type definitions for the global data object
import { GlobalData } from './types';

app
// Configure app
.config({  })
// Define global action handler
.global
.actionDestruct<GlobalData>(({ data }) => {

  // Provide to all action handlers
  data.prop = 'value';

});
```

**Command Module**
```ts
import app from 'argumental';
import { GlobalData } from './types';

app
.command('cmd1')
.actionDestruct<GlobalData>(({ data }) => {

  // Perform command-specific task
  // data.prop is provided

});
```

**App Module**
```ts
import app from 'argumental';

import './global.module';
import './cmd1.module';

app
// Define top-level command
.top
.option('-o --option') // Without `.top` this line would have referred to cmd1 command (last context)
// Set version
.version('1.0.0')
// Start the app
.parse(process.argv);
```

# Extras

Options `-v --version` and `--help` are defined on top-level by default.

To overwrite `-v --version`, don't call `version()` in the chain and define the option manually:

```js
app
.option('-V --version', 'displays application version')
.immediate()
.action(() => console.log('1.0.0'))
.parse(process.argv);
```

To overwrite `--help`, provide the help renderer function using the [`config()` method](./docs/API.md#configoptions):

```js
app
.config({
  help: (definitions, cmd) => console.log('custom help')
})
.parse(process.argv);
```

---

Rest arguments can be used to eliminate the need to wrap values with `""` when they contain spaces.

The following app defines full name as one argument, which means users must wrap the name with `""`:
```js
app
.command('person')
.argument('<full_name>')
.action(args => {

  // Example: person "John Smith"
  console.log(args.fullName); // John Smith

})
.parse(process.argv);
```

This can be improved by using a rest argument:
```js
app
.command('person')
.argument('<...full_name>')
.sanitize(value => value.join(' '))
.action(args => {

  // Example: person John Smith
  console.log(args.fullName); // John Smith

})
.parse(process.argv);
```

---

Argumental's type definitions can be imported in TypeScript when casting to internal types is needed:

```ts
import { Argumental } from 'argumental/dist/types';
```

---

If a new instance of the app is needed, the `ArgumentalApp` class can be imported directly:

TypeScript/ES6 module:
```ts
import { ArgumentalApp } from 'argumental/dist/lib/argumental';
const app = new ArgumentalApp();
```

CommonJS module:
```js
const ArgumentalApp = require('argumental/dist/lib/argumental').ArgumentalApp;
const app = new ArgumentalApp();
```

# Examples

Several examples with different project setup and API usage are included in the [examples directory](https://github.com/chisel/argumental/tree/master/examples). These examples demonstrate Argumental's full potential in creating flexible and modular CLI apps while writing less code.

# Tests

Run the unit tests built with Mocha and Chai:

```bash
npm test
```

# Developer Documentation

Generate the developer documentation at `/docs/dev` by running:

```bash
npm run docs
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
