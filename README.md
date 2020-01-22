![Argumental](./images/display.png)

Argumental is a framework for building CLI applications using Node.js. It which enables fast development by providing an easy-to-use API with a middleware stack system and useful built-in features.

With Argumental you can:

  - Develop CLI apps faster by reusing code through a middleware stack system
  - Apply input validation and sanitization with ease
  - Define event-driven behaviors
  - Implement a modular design
  - Improve code readability by using an easy-to-understand API
  - ...and more!

# Index

  1. [Installation](#installation)
  2. [Quick Start](#quick-start)
  3. [API](#api)
  4. [Definition Context](#definition-context)
  5. [Arguments](#arguments)
      - [Rest Arguments](#rest-arguments)
      - [Defaults](#defaults)
  6. [Options](#options)
      - [Immediate Options](#immediate-options)
      - [Flags](#flags)
      - [Defaults](#defaults-1)
  7. [Validation](#validation)
  8. [Events](#events)
      - [Default Events](#default-events)
      - [Custom Events](#custom-events)
  9. [Destructuring Parameters](#destructuring-parameters)
  10. [Modular Design](#modular-design)
  11. [Extras](#extras)
  12. [Examples](#examples)
  13. [Tests](#tests)
  14. [Developer Documentation](#developer-documentation)
  15. [Building The Source](#building-the-source)

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

# Definition Context

Each call to the [`command()`](./docs/API.md#commandname-description) method determines that until this method is called again, all calls to other methods are within this command's context.

Example:
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

If command is not called at the start of the chain, all declarations will be applied on "top-level".

Example: The following defines **app &lt;arg1&gt; --force** (considering application name is `app`, e.g. `npm install app -g`):
```js
app
.argument('<arg1>')
.option('--force')
.action(() => { })
.parse(process.argv);
```

> **NOTE:** Top-level declaration can also be enabled anywhere in the chain by using the [`top` API](./docs/API.md#top).

Arguments, options, default event listeners, and actions can also be defined on the shared context and applied to all commands (excluding top-level) using the [`shared` API](./docs/API.md#shared).

Example:
```js
app
.shared
// Define for all commands except top-level
.option('--silent', 'Disables logs produced by this command')
.command('command1')
.actionDestruct(({ opts }) => {
  if ( ! opts.silent ) console.log('command1 used');
})
.command('command2')
.actionDestruct(({ opts }) => {
  if ( ! opts.silent ) console.log('command2 used');
})
.shared
// Perform after all commands
.actionDestruct(({ opts, cmd }) => {
  if ( ! opts.silent ) console.log(`command ${cmd} has finished`);
})
.parse(process.argv);
```

If sharing definitions with all commands including top-level is desired, the [`global` API](./docs/API.md#global) should be used instead to provide definitions on the global context.

> **NOTE:** When defining on global or shared context, all definitions will be appended to previous and prepended to future commands in that exact order.

> **NOTE:** You cannot define aliases on global or shared context.

# Arguments

Arguments can be defined within any context using the [`argument()` API](./docs/API.md#argumentsyntax-description-validators-defaultvalue).

An argument syntax must contain the following tokens:
  - Argument name: Alphanumeric name which can also contain `-` and `_` in the middle.
  - Requirement token: Wrap the argument name in `[]` for optional arguments and `<>` for required tokens.

Example:
```js
app
.command('cmd1')
// Required argument
.argument('<arg1>')
// Optional argument
.argument('[arg2]')
.parse(process.argv);
```

## Rest Arguments

Rest arguments capture all values into one array and are useful for use cases where multiple values are expected and the number of provided values is unknown.

```ts
app
// Required rest argument
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
  - Options do not support rest arguments. If multiple values are expected for an option, use the [`multi` API](#multivalue) instead.
  - When using the built-in validators, use the plural version for rest arguments (e.g. `app.STRINGS` instead of `app.STRING`).

## Defaults

A default value can be defined for an optional argument using the [`default()` API](./docs/API.md#defaultvalue) or by passing the value as the last parameter of [`argument()` API](./docs/API.md#argumentsyntax-description-validators-defaultvalue).

Example:
```js
app
.command('cmd1')
.argument('[arg1]')
.default('value')
.action(args => {

  // Example: cmd1 provided
  console.log(args); // { arg1: 'provided' }
  // Example: cmd1
  console.log(args); // { arg1: 'value' }

})
.parse(process.argv);
```

# Options

Options can be defined within any context using the [`option()` API](./docs/API.md#optionsyntax-description-required-validators-multi-defaultvalue-immediate).

The option syntax can contain the following tokens:
  - Shorthand token: `-` followed by one letter.
  - Name token: `--` followed by at least one alphanumeric character (name can contain `-` in the middle).
  - Argument syntax: An argument syntax following any previous tokens.

Options without arguments are considered boolean and their value is either `true` or `false`, while option with arguments may have the following possible values:
  - `undefined`: If the option was not required and provided at all.
  - `null`: If the option was provided with no value for its argument.
  - An array: If the option has the [multi](#flags) flag. The array would contain a value for each option's occurrence.
  - Anything else: If the option was provided with a value for its argument. This value is originally a string but can be mutated through [validators](#validators).

Example:
```js
app
.command('cmd1')
// Define port option with shorthand p which takes a required argument
.option('-p --port <port_number>')
// Define boolean option
.option('--detect-open-port')
.actionDestruct(({ opts }) => {

  // Example: cmd1 -p 4001 --detect-open-port
  console.log(opts); // { p: '4001', port: '4001', detectOpenPort: true }

})
.parse(process.argv);
```

## Immediate Options

Options can be defined with an immediate flag. This flag means when the option is provided and parsed, all syntax validation (except for unknown commands), all option and argument validators, and applying default values will be skipped and actions will be executed as soon as possible. This behavior is desired with options such as `--help` and `--version`.

In this case, the data passed into action handlers will contain nothing but the immediate option's value.

Example:
```js
app
.argument('<arg1>')
.option('-p --port <port_number>')
.option('-i')
.immediate()
.action((args, opts) => {

  // Example: app "arg1 value" -p 3001 -i
  console.log(args); // {}
  console.log(opts); // { i: true }

})
.parse(process.argv);
```

> **NOTE:** If an immediate option has the multi flag, only the first occurrence's value will be considered, meaning the value provided to the action handlers will never be an array.

## Flags

Option flags can be provided either as parameters of [`option()` API](./docs/API.md#optionsyntax-description-required-validators-multi-defaultvalue-immediate) or through dedicated API methods:
  - **required** flag: Makes an option required.
  - **immediate** flag: Makes an option [immediate](#immediate-options).
  - **multi** flag: Makes an option repeatable.

## Defaults

A default value for optional options with an argument can be defined using the [`default()` API](./docs/API.md#defaultvalue) or by passing the value as the second last parameter of [`option()` API](./docs/API.md#optionsyntax-description-required-validators-multi-defaultvalue-immediate).

Example:
```js
app
.command('cmd1')
.option('-o --option [arg]')
.default('value')
.actionDestruct(({ opts }) => {

  // Example: cmd1
  console.log(opts); // { o: 'value', option: 'value' }
  // Example: cmd1 -o
  console.log(opts); // { o: 'value', option: 'value' }
  // Example: cmd1 -o provided
  console.log(opts); // { o: 'provided', option: 'provided' }

})
.parse(process.argv);
```

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

**Additional Notes:**
  - Validators will be skipped when no value is provided for optional arguments or if defined on boolean options.
  - For rest arguments, validators would run on the whole array of values and not for each.
  - For multi/repeatable options, validators would run for each value and not the whole array.
  - Plural built-in validators (e.g. [`STRINGS`](./docs/API.md#STRINGS), [`NUMBERS`](./docs/API.md#NUMBERS), [`BOOLEANS`](./docs/API.md#BOOLEANS)) should be only used for rest arguments.

# Events

Argumental emits several events throughout the execution of the app. Using the [`on()` method](./docs/API.md#onevent-handler), event handlers can be registered to run code at different stages of the execution flow.

## Default Events

Argumental apps run in the following stages:
  1. App is defined (running all calls to the API)
  2. CLI arguments are parsed
  3. Parsed arguments are validated based on the definitions
  4. Event `validators:before` is emitted
  5. Validators/sanitizers are run
  6. Event `validators:after` is emitted
  7. Event `defaults:before` is emitted
  8. Default values are applied
  9. Event `defaults:after` is emitted
  10. Event `actions:before` is emitted
  11. Action handlers are run
  12. Event `actions:after` is emitted

All default events provide a data object containing the parsed arguments at that stage. The data state for each event is as the following:
  - `validators:before`: Data is in its raw form before any validation/sanitization and with no defaults applied. All provided argument and option values are strings (except for boolean options), missing arguments are null, rest arguments are an array of values, missing options are undefined, options provided without an argument value are null, and multi options are an array of values.
  - `validators:after`: Data is validated/sanitized but no defaults applied yet.
  - `defaults:before`: Same as `validators:after`.
  - `defaults:after`: Data is at its final form with validation/sanitization done and defaults applied.
  - `actions:before`: Same as `defaults:after`.
  - `actions:after`: Same as `actions:before` (since actions cannot mutate the parsed data).

The following properties exist on all data objects provided with default events:
  - **args**: A key-value pair object containing the passed-in arguments (uses camel-cased argument names as keys).
  - **opts**: A key-value pair object containing the passed-in options (uses the shorthand and camel-cased option names as keys).
  - **cmd**: The name of the invoked command.

> **NOTE:** The data state is different when an [immediate option](#immediate-options) is parsed.

> **NOTE:** Event handlers cannot mutate the parsed data.

Registering event handlers for default events is [context-based](#definition-context), meaning each call to the `on()` method registers the handler in the current context (command-specific, shared, global, or top-level).

> **NOTE:** When the top-level command has no definitions (no arguments, options, or actions) and the [`topLevelPlainHelp` option](./docs/API.md#configoptions) is true (default state), no default events would be emitted when the top command is executed.

## Custom Events

Custom events can be emitted using the [`emit()` method](./docs/API.md#emitevent-data) with a custom data object and event handlers can be registered through the [`on()` method](./docs/API.md#onevent-handler) regardless of the context.

Example:
```js
const fs = require('fs').promises;

app
.command('remove')
.argument('<dir>')
.actionDestruct(async ({ args, suspend }) => {

  // If directory is empty, exit early
  if ( ! (await fs.readdir(args.dir)).length ) {

    app.emit('empty-dir', { dir: args.dir });
    return suspend();

  }

  // Remove the directory
  await fs.rmdir(args.dir);

})
.on('empty-dir', data => {

  // Report the empty dir

});
```

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

**Shared Module** (runs before all others)
```ts
import app from 'argumental';
// Type definitions for the application data object
import { AppData } from './types';

app
// Configure app
.config({  })
// Define shared action handler
.shared
.action(() => {

  // Provide to all action handlers
  app.data<AppData>().prop = 'value';

});
```

**Command Module**
```ts
import app from 'argumental';
import { SharedData } from './types';

app
.command('cmd1')
.action((args, opts) => {

  // Perform command-specific task
  // app.data().prop is provided

});
```

**App Module**
```ts
import app from 'argumental';

import './shared.module';
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

Several examples with different project setup and API usage are included in the [examples directory](./examples). These examples demonstrate Argumental's full potential in creating flexible and modular CLI apps while writing less code.

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
