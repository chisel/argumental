declare namespace Argumental {

  /**
  * Action handler.
  * @param args Parsed arguments for the command.
  * @param opts Parsed options for the command.
  * @param cmd The name of the invoked command.
  * @param suspend Suspends next actions handlers (if any).
  */
  type ActionHandler = (args: { [arg: string]: any }, opts: { [opt: string]: any }, cmd: string, suspend: () => void) => void|Promise<void>;

  /**
  * Argument or option validator.
  * If validation fails, this method should throw an error with a message.
  * This method may return a promise for async execution.
  * This method may change the value by returning a new one (directly or with promise).
  * @param value The validation target.
  * @param name The argument or option name.
  * @param arg Boolean indicating if the value is an argument or an option.
  * @param cmd Command name.
  */
  type Validator = (value: any, name: string, arg: boolean, cmd: string, suspend: () => void) => any;

  interface GlobalDeclaration {

    /** Global argument declarations. */
    arguments: CommandArgumentDeclaration[];
    /** Global option declarations. */
    options: OptionDeclaration[];
    /** Global action handlers. */
    actions: Argumental.ActionHandler[];

  }

  interface CommandDeclaration {

    /** Command name. */
    name: string;
    /** Command description. */
    description: string;
    /** List of registered command aliases. */
    aliases: string[];
    /** Argument declarations for this command. */
    arguments: CommandArgumentDeclaration[];
    /** Option declarations for this command. */
    options: OptionDeclaration[];
    /** Action handlers of this command. */
    actions: Argumental.ActionHandler[];

  }

  interface OptionDeclaration {

    /** Option's short name. */
    shortName: string;
    /** Option's long name. */
    longName: string;
    /** Option's long name in camel case. */
    apiName: string;
    /** Option description. */
    description: string;
    /** Whether this option is required or not. */
    required: boolean;
    /** Option's argument. */
    argument: ArgumentDeclaration;
    /** Whether this option can be provided more than once. */
    multi: boolean;
    /** Whether to stop parsing other components and run the action handlers when this option is provided (e.g. --help). */
    immediate: boolean;

  }

  interface ArgumentDeclaration {

    /** Argument name. */
    name: string;
    /** Argument name in camel case. */
    apiName: string;
    /** Whether this argument is required or not. */
    required: boolean;
    /** Argument validators. */
    validators: Array<Argumental.Validator|RegExp>;
    /** Argument's default value (if optional). */
    default: string|number|boolean;

  }

  interface CommandArgumentDeclaration extends ArgumentDeclaration {

    /** Argument description. */
    description: string;

  }

  interface List<T> {

    [key: string]: T;

  }

  interface ParsedArguments {

    cmd: string;
    /** NOTE: Missing arguments would be null. */
    args: List<string>;
    /** NOTE: For options with argument, missing options would be undefined,
    options with missing argument value would be null, and string otherwise.
    * For options without argument, missing options would be false, and true otherwise.
    */
    opts: List<boolean|string|Array<string>>;

  }

  interface Options {

    /** Controls logs colors (default: true). */
    colors?: boolean;
    /** Display help when top-level command was invoked without any arguments or options. */
    topLevelPlainHelp?: boolean;
    /** Custom help renderer function to run instead of the built-in help renderer (default: null). */
    help?: (definitions: List<CommandDeclaration>, cmd: string) => void;

  }

}
