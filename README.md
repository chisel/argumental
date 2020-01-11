# Argumental

Argumental is a framework for building CLI applications using Node.js, which enables fast development through defining an easy-to-use API.

# Installation

```bash
npm install argumental
```

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

Defining command **copy file|cp &lt;target&gt; &lt;destination_dir&gt; --delete --save-as &lt;filename&gt;**:

```js
app
.version('1.0.0')
.command('copy file', 'Copies a file')
.alias('cp')
.argument('<target>', 'Target file path')
.argument('<destination_dir>', 'Destination directory path')
.option('-d --delete', 'Deletes the source file after copying (moving the file)')
.option('--save-as <filename>', 'A filename to use for the new file')
.action((args, opts, cmd) => {

  // Example: copy file ./document.md ~/Documents -d --save-as new-document.md
  console.log(args);  // { target: './document.md', destination_dir: '~/Documents' }
  console.log(opts);  // { d: true, delete: true, saveAs: 'new-document.md' }
  console.log(cmd);   // 'copy file'

})
.parse(process.argv);
```

# API

Argumental provides a [chainable API](#chaining-and-context) to define the whole application in one go. Once imported, the following methods are available on the app object and all methods (except `parse()`) return a reference to the parent object for chaining:

  - **command(___name___, ___description___)**: Defines a command.
    - ___name___: The command name. Can only contain alphanumeric characters and nonconsecutive spaces.
    - ___description___: `Optional` A description to display in application help.
  - **alias(___name___)**: Defines an alias for the current command.
    - ___name___: The command alias name. Can only contain alphanumeric characters and spaces.
  - **argument(___syntax___, ___description___, ___validators___, ___defaultValue___)**: Defines an argument for the current command.
    - ___syntax___: The argument syntax. Use `<>` for required arguments and `[]` for optional arguments (e.g. `<file_path>`). Argument name can only contain alphanumeric characters, `-`s, and `_`s.
    - ___description___: `Optional` A description to display in application help.
    - ___validators___: `Optional` A single or an array of [validators](#validation) to validate the argument value.
    - ___defaultValue___: `Optional` The default value of the argument if value was not provided (only works with optional arguments).
  - **option(___syntax___, ___description___, ___required___, ___validators___, ___multi___, ___defaultValue___)**: Defines an option for the current command.
    - ___syntax___: The option syntax. You can define a one letter shorthand (e.g. `-p`), an option name (e.g. `--port-number`), and one argument (e.g. `<port_number>`) in the syntax (e.g. `-p --port-number <port_number>`). Option name can only contain alphanumeric characters and `-`s.
    - ___description___: `Optional` A description to display in application help.
    - ___required___: `Optional` Indicates whether this option is required for the command.
    - ___validators___: `Optional` A single or an array of [validators](#validation) to validate the option's argument value (only applies to options with an argument).
    - ___multi___: `Optional` Indicates whether this option can be repeated more than once (only practical for options with argument).
    - ___defaultValue___: `Optional` The default value of the argument if value was not provided (only applies to options with an optional argument, e.g. `--option [argument]`).  
  - **action(___handler___)**: Defines an action for the current command.
    - ___handler___: An action handler function which takes the following parameters:
      - **args**: A key-value pair object containing the passed-in arguments (uses camel-cased argument names as keys).
      - **opts**: A key-value pair object containing the passed-in options (uses the shorthand and camel-cased option names as keys). If option definition didn't contain an argument, values would be booleans instead. If option defined argument and can occur multiple times, the value would be an array containing each occurrence's value.
      - **cmd**: The invoked command's name.
  - **version(___version___)**: Sets the application version.
    - ___version___: The version of the application.
  - **global**: Turns [global declaration](#globals) on within the chain. Any calls to `argument()`, `option()`, and `action()` methods would define globals instead until `command()` is called again.
  - **STRING**: Built-in validator which validates the argument value as string.
  - **NUMBER**: Built-in validator which validates the argument value as a number (also converts the input to number).
  - **BOOLEAN**: Built-in validator which validates the argument value as boolean (also converts the input to boolean).
  - **FILE_PATH**: Built-in validator which validates the argument value as a file path (checks for file existence and read access synchronously).

## Chaining and Context

Each call to the `command()` method determines that until this method is called again, all calls to other methods are within this command's context. Example:

```js
app
.command('command1')
.argument('[arg1]')   // Defined for command1
.option('--option1')  // Defined for command1
// Changing context
.command('command2')
.argument('[arg2]')   // Defined for command2
.alias('c2')          // Defined for command2
.parse(process.argv);
```

Following this convention, arguments, options, and actions can be defined on a global context and applied to all commands. Example:

```js
app
.global
// Define for all commands
.option('--silent', 'Disables logs produced by this command')
.command('command1')
.action((args, opts) => {
  if ( ! opts.silent ) console.log('command1 used');
})
.command('command2')
.action((args, opts) => {
  if ( ! opts.silent ) console.log('command2 used');
})
.global
// Perform after all commands
.action((args, opts, cmd) => {
  if ( ! opts.silent ) console.log(`command ${cmd} has finished`);
})
.parse(process.argv);
```

When switching to global context, all definitions will be appended to previous and prepended to future commands.

> **NOTE:** You cannot define aliases on a global context.

> **NOTE:** Chain should always start with either `global` or `command()` and end with `parse()`.

## Validation

Validators are functions that take a user-provided argument value and check it based on specific rules. If validation fails, validators must throw an error with a custom message to display to the user. If a validator returns a value, that value will be used instead; this allows type casting and input sanitization.

Validator functions take the following parameters:
  - ___value___: The argument value in its current state.
  - ___arg___: A boolean indicating if value belongs to a plain argument or to an option argument.
  - ___name___: The argument name.
  - ___cmd___: The name of the invoked command.

```js
app
.command('command1')
.argument('<arg1>', 'description', value => value.toLowerCase())
.parse(process.argv);
```

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

For convenience, you can provide regular expressions instead of validator functions to validate string values. Keep in mind that if the value has changed because of a previous validator to anything other than a string, the regular expression will fail the validation.

```js
app
.command('command1')
// Only accept files with .js extension
.option('-f --file [path]', 'description', false, /.+\.js$/i)
.parse(process.argv);
```

> **NOTE:** Validators won't run when no value is provided for optional arguments.

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
