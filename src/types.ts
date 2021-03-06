export namespace Argumental {

  /**
  * Action handler with destructuring params.
  * @param params Action handler parameters object.
  */
  export type ActionHandlerWithDestructuringParams = (params: ActionHandlerParams) => any|Promise<any>;

  /**
  * Action handler.
  * @param args Parsed arguments for the command.
  * @param opts Parsed options for the command.
  * @param cmd The name of the invoked command.
  * @param suspend Suspends next actions handlers (if any).
  */
  export type ActionHandler= (args: List<any>, opts: List<any>, cmd: string, suspend: () => void) => any|Promise<any>;

  export interface ActionHandlerParams {

    /** Parsed arguments for the command. */
    args: List<any>;
    /** Parsed options for the command. */
    opts: List<any>;
    /** The name of the invoked command. */
    cmd: string;
    /** Suspends next actions handlers (if any). */
    suspend: () => void;

  }

  /**
  * Argument or option validator.
  * If validation fails, this method should throw an error with a message.
  * This method may return a promise for async execution.
  * This method may change the value by returning a new one (directly or with promise).
  * @param params Validator parameters object.
  */
  export type ValidatorWithDestructuringParams = (params: ValidatorParams) => any;

  /**
  * Argument or option validator.
  * If validation fails, this method should throw an error with a message.
  * This method may return a promise for async execution.
  * This method may change the value by returning a new one (directly or with promise).
  * @param value The validation target.
  * @param name The argument or option name.
  * @param arg Boolean indicating if the value is an argument or an option.
  * @param cmd Command name.
  * @param suspend Suspends next validators (if any).
  */
  export type Validator = (value: any, name: string, arg: boolean, cmd: string, suspend: () => void) => any;

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

  export interface CallbackFunction<T> {

    /** Indicates callback parameters type. */
    destructuringParams: boolean;
    /** The callback function. */
    callback: T;

  }

  export interface SharedDeclaration {

    /** Shared/global argument declarations. */
    arguments: CommandArgumentDeclaration[];
    /** Shared/global option declarations. */
    options: OptionDeclaration[];
    /** Shared/global action handlers. */
    actions: CallbackFunction<ActionHandler|ActionHandlerWithDestructuringParams>[];
    /** Shared/global event declarations. */
    events: EventDeclarations;

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
    actions: CallbackFunction<ActionHandler|ActionHandlerWithDestructuringParams>[];
    /** Determines whether this command definition is in its original state (used for top command). */
    original?: boolean;
    /** Order number to sort commands with. */
    order: number;
    /** Event declarations for this command. */
    events: EventDeclarations;

  }

  /**
  * Event handler.
  * @param data Event data.
  */
  export type EventHandler<T=any> = (data: T) => any|Promise<any>;

  export interface EventDeclarations {

    /** Runs before validators, defaults, and action handlers. */
    'validators:before': EventHandler[];
    /** Runs after validators and before defaults and action handlers. */
    'validators:after': EventHandler[];
    /** Runs before defaults and action handlers. */
    'defaults:before': EventHandler[];
    /** Runs after defaults and before action handlers. */
    'defaults:after': EventHandler[];
    /** Runs before action handlers. */
    'actions:before': EventHandler[];
    /** Runs after action handlers. */
    'actions:after': EventHandler[];

  }

  export interface EventData<T> {

    /** Parsed arguments for the command at the current stage. */
    args: List<T>;
    /** Parsed options for the command at the current stage. */
    opts: List<T|boolean>;
    /** The name of the invoked command. */
    cmd: string;

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
    validators: Array<CallbackFunction<Validator|ValidatorWithDestructuringParams>|RegExp>;
    /** Argument's default value (if optional). */
    default: string|number|boolean;

  }

  export interface CommandArgumentDeclaration extends ArgumentDeclaration {

    /** Argument description. */
    description: string;
    /** Whether this argument captures all values provided on and after. */
    rest: boolean;

  }

  export interface List<T> {

    [key: string]: T;

  }

  export interface ParsedArguments {

    cmd: string;
    /** NOTE: Missing arguments would be null. */
    args: List<string|string[]>;
    /** NOTE: For options with argument, missing options would be undefined,
    options with missing argument value would be null, and string otherwise.
    * For options without argument, missing options would be false, and true otherwise.
    */
    opts: List<boolean|string|string[]>;

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
