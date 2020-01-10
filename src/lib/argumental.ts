import _ from 'lodash';
import { Parser } from './parser';

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
  /** Application version. */
  private _version: string = null;
  /** Utilities. */
  private _parser = new Parser();

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

    // Check if command contains invalid characters
    if ( ! name.trim().match(/^[a-z0-9 ]+$/i) )
      throw new Error(`ARGUMENTAL_ERROR: Invalid command name ${name.trim()}! Commands can only contain alphanumeric characters and spaces.`);

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

    // Check if a command exists with the given alias name
    if ( this._commands.hasOwnProperty(name.trim()) )
      throw new Error(`ARGUMENTAL_ERROR: Cannot define alias ${name.trim()} because it conflicts with a command of the same name!`);

    // Check if alias contains invalid characters
    if ( ! name.trim().match(/^[a-z0-9 ]+$/i) )
      throw new Error(`ARGUMENTAL_ERROR: Invalid alias name ${name.trim()}! Aliases can only contain alphanumeric characters and spaces.`);

    // Check if no command is being declared
    if ( this._currentCommand === null )
      throw new Error(`ARGUMENTAL_ERROR: Cannot define alias ${name.trim()} because no command is being defined!`);

    // Add alias if it isn't already defined for command
    const command = this._commands[this._currentCommand];

    if ( ! command.aliases.includes(name.trim()) ) command.aliases.push(name.trim());

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
  * @param defaultValue A default value to use for the option's argument (when argument is optional).
  */
  public option(syntax: string): ArgumentalApp;
  public option(syntax: string, description: string): ArgumentalApp;
  public option(syntax: string, description: string, required: boolean): ArgumentalApp;
  public option(syntax: string, description: string, required: boolean, validators: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>): ArgumentalApp;
  public option(syntax: string, description: string, required: boolean, validators: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>, defaultValue: string|number|boolean): ArgumentalApp;
  public option(syntax: string, description?: string, required?: boolean, validators?: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>, defaultValue?: string|number|boolean): ArgumentalApp {

    // Check if no command is being declared and global flag is not set
    if ( this._currentCommand === null && ! this._global )
      throw new Error(`ARGUMENTAL_ERROR: Cannot define option ${syntax} because no command is being defined and global definition is disabled!`);

    // Parse option
    const option = this._parser.parseOption(syntax, description, required, validators, defaultValue);

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

}
