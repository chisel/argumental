declare namespace Argumental {

  /**
  * Action handler.
  * @param args Parsed arguments for the command.
  * @param opts Parsed options for the command.
  * @param cmd The name of the invoked command.
  */
  type ActionHandler = (args: { [arg: string]: any }, opts: { [opt: string]: any }, cmd: string) => void|Promise<void>;

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
  type Validator = (value: any, name: string, arg: boolean, cmd: string) => any;

  interface GlobalDeclaration {

    arguments: CommandArgumentDeclaration[];
    options: OptionDeclaration[];
    actions: Argumental.ActionHandler[];

  }

  interface CommandDeclaration {

    name: string;
    description: string;
    aliases: string[];
    arguments: CommandArgumentDeclaration[];
    options: OptionDeclaration[];
    actions: Argumental.ActionHandler[];

  }

  interface OptionDeclaration {

    shortName: string;
    longName: string;
    apiName: string;
    description: string;
    required: boolean;
    argument: ArgumentDeclaration;
    multi: boolean;

  }

  interface ArgumentDeclaration {

    name: string;
    apiName: string;
    required: boolean;
    validators: Array<Argumental.Validator|RegExp>;
    default: string|number|boolean;

  }

  interface CommandArgumentDeclaration extends ArgumentDeclaration {

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

}
