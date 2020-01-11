import _ from 'lodash';
import path from 'path';
import { Parser } from './parser';
import { Logger } from './logger';

export class ArgumentalApp {

  /** Global declaration flag. */
  private _global: boolean = false;
  /** Global declarations to prepend to all future command declarations. */
  private _globalDeclaration: Argumental.GlobalDeclaration = {
    arguments: [],
    options: [],
    actions: []
  };
  /** Command declarations. */
  private _commands: Argumental.List<Argumental.CommandDeclaration> = {};
  /** Current command declaration. */
  private _currentCommand: string = null;
  /** List of all command names and aliases for quick conflict checks. */
  private _conflicts: string[] = [];
  /** Application version. */
  private _version: string = null;
  /** Application name. */
  private _name: string = null;
  /** Parser. */
  private _parser = new Parser();
  /** Logger. */
  private _log = new Logger();

  /**
  * Sets the application version.
  * @param version The application version.
  */
  public version(version: string): ArgumentalApp {

    this._version = version.trim();

    return this;

  }

  /**
  * Makes any following argument, option, and action declaration globally applied to all commands (appended to previously declared commands and prepended to future command declarations) unless the command() function is called.
  */
  public get global(): ArgumentalApp {

    this._global = true;

    return this;

  }

  /**
  * Defines a command. Any following argument, option, alias, or action declaration will be used for this command unless this function is called again.
  * @param name Command name (can contain spaces).
  * @param description The command description to display in help.
  */
  public command(name: string): ArgumentalApp;
  public command(name: string, description: string): ArgumentalApp;
  public command(name: string, description?: string): ArgumentalApp {

    // Check if command already exists
    if ( this._commands.hasOwnProperty(name.trim()) )
      throw new Error(`ARGUMENTAL_ERROR: Command ${name.trim()} is already defined!`);

    // Check if command name conflicts
    if ( this._conflicts.includes(name.trim()) )
      throw new Error(`ARGUMENTAL_ERROR: Cannot define command ${name.trim()} because it conflicts with a command or alias of the same name!`);

    // Check if command contains invalid characters
    if ( ! name.trim().match(/^[a-z0-9 ]+$/i) || name.trim().match(/ {2,}/) )
      throw new Error(`ARGUMENTAL_ERROR: Invalid command name ${name.trim()}! Commands can only contain alphanumeric characters and nonconsecutive spaces.`);

    // Reset the global flag
    this._global = false;
    // Set the current command pointer
    this._currentCommand = name.trim();

    // Create an empty command object and prepend all global declarations
    this._commands[name.trim()] = {
      name: name.trim(),
      description: description || null,
      aliases: [],
      arguments: _.cloneDeep(this._globalDeclaration.arguments),
      options: _.cloneDeep(this._globalDeclaration.options),
      actions: _.cloneDeep(this._globalDeclaration.actions)
    };

    // Register in conflicting names
    this._conflicts.push(name.trim());

    return this;

  }

  /**
  * Defines an alias for the current command.
  * @param name The alias name.
  */
  public alias(name: string): ArgumentalApp {

    // Check if global flag is set
    if ( this._global )
      throw new Error('ARGUMENTAL_ERROR: Cannot define alias globally!');

    // Check if alias name conflicts
    if ( this._conflicts.includes(name.trim()) )
      throw new Error(`ARGUMENTAL_ERROR: Cannot define alias ${name.trim()} because it conflicts with a command or alias of the same name!`);

    // Check if alias contains invalid characters
    if ( ! name.trim().match(/^[a-z0-9 ]+$/i) )
      throw new Error(`ARGUMENTAL_ERROR: Invalid alias name ${name.trim()}! Aliases can only contain alphanumeric characters and spaces.`);

    // Check if no command is being declared
    if ( this._currentCommand === null )
      throw new Error(`ARGUMENTAL_ERROR: Cannot define alias ${name.trim()} because no command is being defined!`);

    // Add alias if it isn't already defined for command
    const command = this._commands[this._currentCommand];

    if ( ! command.aliases.includes(name.trim()) ) command.aliases.push(name.trim());

    // Register in conflicting names
    this._conflicts.push(name.trim());

    return this;

  }

  /**
  * Mounts an action middleware to the current command (or globally).
  * @param middleware The action middleware to mount.
  */
  public action(handler: Argumental.ActionHandler): ArgumentalApp {

    // Check if no command is being declared and global flag is not set
    if ( this._currentCommand === null && ! this._global )
      throw new Error(`ARGUMENTAL_ERROR: Cannot add action handler because no command is being defined and global definition is disabled!`);

    // Add the action handler globally and append to all commands
    if ( this._global ) {

      this._globalDeclaration.actions.push(handler);

      for ( const commandName in this._commands ) {

        this._commands[commandName].actions.push(handler);

      }

    }
    // Add the action handler to current command
    else {

      this._commands[this._currentCommand].actions.push(handler);

    }

    return this;

  }

  /**
  * Defines an argument for the current command (or globally).
  * @param syntax The argument syntax (e.g. "&lt;argument&gt;", "[argument]").
  * @param description The argument description to display in help.
  * @param validators A single or an array of validators.
  * @param defaultValue A default value to use for the argument (when argument is optional).
  */
  public argument(syntax: string): ArgumentalApp;
  public argument(syntax: string, description: string): ArgumentalApp;
  public argument(syntax: string, description: string, validators: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>): ArgumentalApp;
  public argument(syntax: string, description: string, validators: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>, defaultValue: string|number|boolean): ArgumentalApp;
  public argument(syntax: string, description?: string, validators?: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>, defaultValue?: string|number|boolean): ArgumentalApp {

    // Check if no command is being declared and global flag is not set
    if ( this._currentCommand === null && ! this._global )
      throw new Error(`ARGUMENTAL_ERROR: Cannot define argument ${syntax} because no command is being defined and global definition is disabled!`);

    // Parse argument
    const argument: Argumental.CommandArgumentDeclaration = _.assign(this._parser.parseArgument(syntax, validators, defaultValue), {
      description: description || null
    });

    // Check if argument is already defined for current command or globally
    if (
      (this._global && this._globalDeclaration.arguments.filter(arg => arg.apiName === argument.apiName).length) ||
      (this._currentCommand && this._commands[this._currentCommand].arguments.filter(arg => arg.apiName === argument.apiName).length)
    )
      throw new Error(`ARGUMENTAL_ERROR: Argument ${argument.apiName} is already defined!`);

    // If global flag is enabled, add argument to global declaration and append to all commands
    if ( this._global ) {

      this._globalDeclaration.arguments.push(argument);

      for ( const commandName in this._commands ) {

        this._commands[commandName].arguments.push(argument);

      }

    }
    // Add argument to current command
    else {

      this._commands[this._currentCommand].arguments.push(argument);

    }

    return this;

  }

  /**
  * Defines an option for the current command (or globally).
  * @param syntax The option syntax (e.g. "--no-color", "-p --port <port_number>", "-l --logs [level]").
  * @param description The option description to display in help.
  * @param required A boolean indicating if option is required.
  * @param validators A single or an array of validators.
  * @param multi A boolean indicating whether this option can be repeated more than once (only practical for options with argument).
  * @param defaultValue A default value to use for the option's argument (when argument is optional).
  */
  public option(syntax: string): ArgumentalApp;
  public option(syntax: string, description: string): ArgumentalApp;
  public option(syntax: string, description: string, required: boolean): ArgumentalApp;
  public option(syntax: string, description: string, required: boolean, validators: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>): ArgumentalApp;
  public option(syntax: string, description: string, required: boolean, validators: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>, multi: boolean): ArgumentalApp;
  public option(syntax: string, description: string, required: boolean, validators: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>, multi: boolean, defaultValue: string|number|boolean): ArgumentalApp;
  public option(syntax: string, description?: string, required?: boolean, validators?: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>, multi?: boolean, defaultValue?: string|number|boolean): ArgumentalApp {

    // Check if no command is being declared and global flag is not set
    if ( this._currentCommand === null && ! this._global )
      throw new Error(`ARGUMENTAL_ERROR: Cannot define option ${syntax} because no command is being defined and global definition is disabled!`);

    // Parse option
    const option = this._parser.parseOption(syntax, description, required, validators, multi, defaultValue);

    // Check if option is already defined for current command or globally
    if (
      (this._global && this._globalDeclaration.options.filter(opt => opt.longName === option.longName || option.shortName === opt.shortName || (opt.apiName && opt.apiName === option.apiName)).length) ||
      (this._currentCommand && this._commands[this._currentCommand].options.filter(opt => opt.longName === option.longName || option.shortName === opt.shortName || (opt.apiName && opt.apiName === option.apiName)).length)
    )
      throw new Error(`ARGUMENTAL_ERROR: Option ${option.longName || option.shortName} is already defined!`);

    // If global flag is enabled, add option to global declaration and append to all commands
    if ( this._global ) {

      this._globalDeclaration.options.push(option);

      for ( const commandName in this._commands ) {

        this._commands[commandName].options.push(option);

      }

    }
    // Add option to current command
    else {

      this._commands[this._currentCommand].options.push(option);

    }

    return this;

  }

  /**
  * Parses the process arguments (argv) and runs the app.
  * @param argv Process arguments to parse.
  */
  public parse(argv: string[]): void {

    // Extract app name
    const appPath = argv.slice(1, 2)[0];

    if ( appPath ) this._name = path.basename(appPath);
    this._log.appName = this._name;

    // Parse arguments
    const parsed = this._parser.parseCliArguments(argv.slice(2), this._commands);

    // If parsing error
    if ( parsed instanceof Error ) return this._log.error(parsed);

    const command = this._commands[parsed.cmd];

    // Validate arguments
    for ( const argument of command.arguments ) {

      if ( argument.required && parsed.args[argument.apiName] === null )
        return this._log.error(`Missing value for required argument <${argument.name}>!`);

    }

    // Validate options
    for ( const option of command.options ) {

      const value = parsed.opts[option.apiName || option.shortName];
      const logName = option.longName ? `--${option.longName}` : `-${option.shortName}` ;

      // Missing required option
      if ( option.required && ((! option.argument && value === false) || (option.argument && value === undefined)) )
        return this._log.error(`Missing required option ${logName}!`);

      // Option is not multi but occurs multiple times
      if ( ! option.multi && value && typeof value === 'object' && value.constructor === Array )
        return this._log.error(`Option ${logName} cannot be provided more than once!`);

      // Missing required argument of option
      if ( option.argument && option.argument.required ) {

        // If array
        if ( value && typeof value === 'object' && value.constructor === Array ) {

          for ( const v of value ) {

            if ( v === null ) return this._log.error(`Missing required value for option ${logName}!`);

          }

        }
        else if ( value === null ) {

          return this._log.error(`Missing required value for option ${logName}!`);

        }

      }

    }

  }

}
