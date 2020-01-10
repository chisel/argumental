declare namespace Argumental {

  /**
  * Action handler.
  * @param args Parsed arguments for the command.
  * @param opts Parsed options for the command.
  */
  type ActionHandler = (args: { [arg: string]: string|number|boolean }, opts: { [opt: string]: string|number|boolean }) => void|Promise<void>;
  
  /**
  * Argument or option validator.
  * If validation fails, this method should throw an error with a message.
  * This method may return a promise for async execution.
  * This method may change the value by returning a new one (directly or with promise).
  * @param value The validation target.
  * @param arg Boolean indicating if the value is an argument or an option.
  * @param name The argument or option name.
  * @param cmd Command name.
  */
  type Validator = (value: any, arg: boolean, name: string, cmd: string) => any;

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

}
