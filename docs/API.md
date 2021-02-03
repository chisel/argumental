# API Reference

Argumental provides a chainable API to define the whole application in one go (unless a [modular approach](../../../#modular-design) is desired where multiple chains are used).

Once imported, the following methods are available on the app object and all methods return a reference to the parent object for chaining (except for [`parse()`](#parseargv), [`emit()`](#emitevent-data), [`data()`](#data), and the [built-in validators](#built-in-validators)).

## Index

  - [command()](#commandname-description)
  - [alias()](#aliasname)
  - [argument()](#argumentsyntax-description-validators-defaultvalue)
  - [option()](#optionsyntax-description-required-validators-multi-defaultvalue-immediate)
  - [action()](#actionhandler)
  - [actionDestruct()](#actiondestructhandler)
  - [description()](#descriptiontext)
  - [required()](#requiredvalue)
  - [multi()](#multivalue)
  - [immediate()](#immediatevalue)
  - [default()](#defaultvalue)
  - [validate()](#validatevalidators)
  - [validateDestruct()](#validatedestructvalidators)
  - [sanitize()](#sanitizesanitizers)
  - [sanitizeDestruct()](#sanitizeDestructsanitizers)
  - [data()](#data)
  - [version()](#versionversion)
  - [parse()](#parseargv)
  - [shared](#shared)
  - [global](#global)
  - [top](#top)
  - [config()](#configoptions)
  - [on()](#onevent-handler)
  - [emit()](#emitevent-data)
  - [error()](#errormessage)
  - [STRING](#string)
  - [NUMBER](#number)
  - [BOOLEAN](#boolean)
  - [FILE_PATH](#file_path)
  - [STRINGS](#strings)
  - [NUMBERS](#numbers)
  - [BOOLEANS](#booleans)

### command(___name___, ___description___)

Defines a command.
  - **name**: The command name. Can only contain alphanumeric characters and nonconsecutive spaces.
  - **description**: `Optional` A description to display in application help.

### alias(___name___)

Defines an alias for the current command.
  - **name**: The command alias name. Can only contain alphanumeric characters and spaces.

### argument(___syntax___, ___description___, ___validators___, ___defaultValue___)

Defines an argument for the current command.
  - **syntax**: The argument syntax. Use `<>` for required arguments and `[]` for optional arguments (e.g. `<file_path>`). Argument name can only contain alphanumeric characters, `-`s, and `_`s. [Rest arguments](../../../#rest-arguments) can be defined using `...` before the name (e.g. `[...args]` or `<...args>`).
  - **description**: `Optional` A description to display in application help.
  - **validators**: `Optional` A single or an array of [validators](../../../#validation) to validate the argument value ([destructuring parameters](../../../#destructuring-parameters) not supported).
  - **defaultValue**: `Optional` The default value of the argument if value was not provided (only works with optional arguments).

### option(___syntax___, ___description___, ___required___, ___validators___, ___multi___, ___defaultValue___, ___immediate___)

Defines an option for the current command.
  - **syntax**: The option syntax. You can define a one letter shorthand (e.g. `-p`), an option name (e.g. `--port-number`), and one argument (e.g. `<port_number>`) in the syntax (e.g. `-p --port-number <port_number>`). Option name can only contain alphanumeric characters and `-`s.
  - **description**: `Optional` A description to display in application help.
  - **required**: `Optional` Indicates whether this option is required for the command.
  - **validators**: `Optional` A single or an array of [validators](../../../#validation) to validate the option's argument value (only applies to options with an argument and [destructuring parameters](../../../#destructuring-parameters) not supported).
  - **multi**: `Optional` Indicates whether this option can be repeated more than once (only practical for options with argument).
  - **defaultValue**: `Optional` The default value of the argument if value was not provided (only applies to options with an argument).
  - **immediate**: `Optional` Indicates if all other components (arguments, options, etc.) should be ignored in the parsing process and action handlers should be called as soon as possible when this option is provided. This behavior is desired with options such as `--help` and `--version`. Keep in mind that validators will run before the action handlers for the first encountered immediate option only.

### action(___handler___)

Defines an action for the current command.
  - **handler**: An action handler function which takes the following parameters:
    - **args**: A key-value pair object containing the passed-in arguments (uses camel-cased argument names as keys).  
    Missing arguments' values are `null` while rest arguments' values are an array of values.
    - **opts**: A key-value pair object containing the passed-in options (uses the shorthand and camel-cased option names as keys).  
    If option definition didn't contain an argument, values would be booleans instead.   
    If option defined argument, value would be `undefined` if option is not provided, `null` if option provided without the argument's value, and the actual argument value otherwise.  
    If option defined argument and can occur multiple times, the value would be an array containing each occurrence's value.
    - **suspend**: A function which suspends next action handlers from being executed when called.
    - **cmd**: The invoked command's name.

Action handlers can return a promise for async execution.

### actionDestruct(___handler___)

Same as `action()` but all parameters are provided as a single object to support [destructuring parameters](../../../#destructuring-parameters).

### description(___text___)

Defines description for the current command, argument, or option.
  - **text**: Description text to display in application help.

### required(___value___)

Sets the required flag for the current option.
  - **value**: Required flag's boolean value (defaults to `true`).

### multi(___value___)

Sets the multi flag for the current option.
  - **value**: Multi flag's boolean value (defaults to `true`).

### immediate(___value___)

Sets the immediate flag for the current option.
  - **value**: Immediate flag's boolean value (defaults to `true`).

### default(___value___)

Sets default value for the current argument or option.
  - **value**: The default value to set.

### validate(___validators___)

Adds a single or multiple [validators](../../../#validation) to the current option or argument.
  - **validators**: A single or an array of [validators](../../../#validation) to add.

### validateDestruct(___validators___)

Same as `validate()` but all parameters are provided as a single object to support [destructuring parameters](../../../#destructuring-parameters).

### sanitize(___sanitizers___)

Alias for `validate()`.

### sanitizeDestruct(___sanitizers___)

Alias for `validateDestruct()`.

### data()

Returns an object for sharing data throughout the application (useful for apps with [modular design](../../../#modular-design)).

> **NOTE:** If using TypeScript, type definition for the returned data object can be provided by using the generic signature of this method `data<T>()`.

### version(___version___)

Sets the application version.
  - **version**: The version of the application.

This method defines `-v --version` option on the top-level command only regardless of the current context.

### parse(___argv___)

Parses the passed in array of command-line arguments (e.g. `process.argv`) and ends the chain by returning a void promise which always resolves (unless an error is thrown from an action handler).
  - **argv**: Command-line arguments to parse.

### shared

Changes the definition context to [shared](../../../#definition-context). All definitions after this would be applied to all commands (excluding the top-level command).

### global

Changes the definition context to [global](../../../#definition-context). All definitions after this would be applied to all commands (including the top-level command).

### top

Changes the definition context to [top-level](../../../#definition-context). All definitions after this would be applied the top-level command only.

### config(___options___)

Configures Argumental with the given options. Options object can have any of the following properties:
  - **colors**: Boolean indicating if logs should be colorful (defaults to `true`).
  - **topLevelPlainHelp**: When true, application help will be displayed when the top-level command is invoked without any arguments, options, or actions (defaults to `true`).  
  No [default events](../../../#default-events) would be emitted in this case.
  - **help**: A help renderer function to invoke when help must be rendered and logged to console. The function takes the following parameters:
    - **definitions**: A key-value pair object containing all [command declarations](../src/types.ts#L93) where key `''` refers to the top-level command.
    - **cmd**: The invoked command name.

### on(___event___, ___handler___)

Registers an [event handler](../../../#events).
  - **event**: A [default](../../../#default-events) or [custom](../../../#custom-events) event name.
  - **handler**: An event handler to register which takes the following parameter:
    - **data**: The provided event data (if any).

Event handlers can return a promise for async execution.

### emit(___event___, ___data___)

Emits a [custom event](../../../#custom-events).
  - **event**: The custom event name.
  - **data**: The event data to provide to all handlers.

### error(___message___)

Displays an error message in the console.
  - **message**: An error message or object.

## Built-in Validators

The following methods are built-in validators that should be used by `validate()` or `sanitize()` or provided as arguments inside `argument()` and `option()` methods:

### STRING

Built-in [validator](../../../#validation) which validates the argument value as string.

### NUMBER

Built-in [validator](../../../#validation) which validates the argument value as a number (also converts the input to number).

### BOOLEAN

Built-in [validator](../../../#validation) which validates the argument value as boolean (also converts the input to boolean).

### FILE_PATH

Built-in [validator](../../../#validation) which validates the argument value as a file path (checks for file existence and read access synchronously).

### STRINGS

Built-in [validator](../../../#validation) which validates the rest argument value as multiple strings.

### NUMBERS

Built-in [validator](../../../#validation) which validates the rest argument value as multiple numbers (also converts the input to number).

### BOOLEANS

Built-in [validator](../../../#validation) which validates the rest argument value as booleans (also converts the input to boolean).
