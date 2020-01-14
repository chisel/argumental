export namespace Argumental {

  /**
  * Action handler.
  * @param params Action handler parameters object.
  */
  export type ActionHandler<T=any> = (params: ActionHandlerParams<T>) => void|Promise<void>;

  export interface ActionHandlerParams<T=any> {

    /** Parsed arguments for the command. */
    args: List<any>;
    /** Parsed options for the command. */
    opts: List<any>;
    /** The name of the invoked command. */
    cmd: string;
    /** Suspends next actions handlers (if any). */
    suspend: () => void;
    /** An object shared between action handlers to attach any data to. */
    data: T;

  }

  /**
  * Argument or option validator.
  * If validation fails, this method should throw an error with a message.
  * This method may return a promise for async execution.
  * This method may change the value by returning a new one (directly or with promise).
  * @param params Validator parameters object.
  */
  export type Validator = (params: ValidatorParams) => any;

  export interface ValidatorParams {

    /** The validation target. */
    value: any;
    /** The argument or option name. */
    name: string;
    /** Boolean indicating if the value is an argument or an option. */
    arg: boolean;
    /** Command name. */
    cmd: string;
    /** Suspends next validators (if any). */
    suspend: () => void;

  }

  export interface GlobalDeclaration {

    /** Global argument declarations. */
    arguments: CommandArgumentDeclaration[];
    /** Global option declarations. */
    options: OptionDeclaration[];
    /** Global action handlers. */
    actions: Argumental.ActionHandler[];

  }

  export interface CommandDeclaration {

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

  export interface OptionDeclaration {

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

  export interface ArgumentDeclaration {

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

  export interface CommandArgumentDeclaration extends ArgumentDeclaration {

    /** Argument description. */
    description: string;

  }

  export interface List<T> {

    [key: string]: T;

  }

  export interface ParsedArguments {

    cmd: string;
    /** NOTE: Missing arguments would be null. */
    args: List<string>;
    /** NOTE: For options with argument, missing options would be undefined,
    options with missing argument value would be null, and string otherwise.
    * For options without argument, missing options would be false, and true otherwise.
    */
    opts: List<boolean|string|Array<string>>;

  }

  export interface Options {

    /** Controls logs colors (default: true). */
    colors?: boolean;
    /** Display help when top-level command was invoked without any arguments or options. */
    topLevelPlainHelp?: boolean;
    /** Custom help renderer function to run instead of the built-in help renderer (default: null). */
    help?: (definitions: List<CommandDeclaration>, cmd: string) => void;

  }

}
