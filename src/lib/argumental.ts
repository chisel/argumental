import _ from 'lodash';
import path from 'path';
import { Parser } from './parser';
import { Logger } from './logger';
import { BuiltInValidators } from './validators';
import { Argumental } from '../types';

export class ArgumentalApp extends BuiltInValidators {

  constructor() {

    super();

    // Define --help top-level
    this._commands[''].options.push(this._parser.parseOption('--help', 'displays application help', false, null, false, undefined, true));
    this._commands[''].actions.push(({ opts, suspend }) => {

      if ( opts.help ) {

        this._log.help(this._commands, '');
        suspend();

      }

    });

    // Define --help on all levels
    this._globalDeclaration.options.push(this._parser.parseOption('--help', 'displays command help', false, null, false, undefined, true));
    this._globalDeclaration.actions.push(({ opts, cmd, suspend }) => {

      if ( ! opts.help ) return;

      this._log.help(this._commands, cmd);
      suspend();

    });

  }

  /** Global declaration flag. */
  private _global: boolean = false;
  /** Global declarations to prepend to all future command declarations. */
  private _globalDeclaration: Argumental.GlobalDeclaration = {
    arguments: [],
    options: [],
    actions: []
  };
  /** Command declarations. */
  private _commands: Argumental.List<Argumental.CommandDeclaration> = {
    // Top-level
    '': {
      name: '',
      description: null,
      aliases: [],
      arguments: [],
      options: [],
      actions: []
    }
  };
  /** Current command declaration. */
  private _currentCommand: string = '';
  /** Current component type of the current command. */
  private _currentComponent: 'arguments'|'options' = null;
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
  /** Flags for displaying help without the --help option for plain top-level command. */
  private _topLevelPlainHelp: boolean = true;

  /**
  * Configures Argumental with the provided options.
  * @param options The configuration options.
  */
  public config(options: Argumental.Options): ArgumentalApp {

    // Set defaults
    if ( ! options.hasOwnProperty('colors') ) options.colors = true;
    if ( ! options.hasOwnProperty('topLevelPlainHelp') ) options.topLevelPlainHelp = true;
    if ( ! options.hasOwnProperty('help') ) options.help = null;

    // Apply config
    this._log.colors = options.colors;
    this._topLevelPlainHelp = options.topLevelPlainHelp;
    this._log.customHelpRenderer = options.help;

    return this;

  }

  /**
  * Sets the application version and defines the top-level option `-v --version`.
  * @param version The application version.
  */
  public version(version: string): ArgumentalApp {

    this._version = version.trim();

    this._commands[''].options.push(this._parser.parseOption('-v --version', 'displays application version', false, null, false, undefined, true));
    this._commands[''].actions.push(({ opts, suspend }) => {

      if ( opts.version ) {

        console.log(this._version);

        suspend();

      }

    });

    return this;

  }

  /**
  * Makes any following argument, option, and action declaration globally applied to all commands (appended to previously declared commands and prepended to future command declarations) unless the command() function is called.
  */
  public get global(): ArgumentalApp {

    // Set the global flag
    this._global = true;
    // Reset the current component
    this._currentComponent = null;

    return this;

  }

  /**
  * Makes any following argument, option, and action declaration applied to top-level.
  */
  public get top(): ArgumentalApp {

    // Reset the global flag
    this._global = false;
    // Reset the current component
    this._currentComponent = null;
    // Set the current command to top-level
    this._currentCommand = '';

    return this;

  }

  /**
  * Sets the description for a command, option, or argument.
  * @param text The description text to display in help.
  */
  public description(text: string): ArgumentalApp {

    // Check if current component is not set, set for current command
    if ( ! this._currentComponent && ! this._global ) {

      this._commands[this._currentCommand].description = text;

    }
    // If global but no component selected
    else if ( this._global && ! this._currentComponent ) {

      throw new Error('ARGUMENTAL_ERROR: Cannot set description on the global context because no command, option, or argument is selected!');

    }
    else {

      // If global
      if ( this._global ) {

        // Set for all commands' components (last component)
        for ( const commandName in this._commands ) {

          if ( commandName === '' ) continue;

          const component = this._commands[commandName][this._currentComponent];

          component[component.length - 1].description = text;

        }

        // Update global declaration
        const component = this._globalDeclaration[this._currentComponent];

        component[component.length - 1].description = text;

      }
      // Specific component
      else {

        const component = this._commands[this._currentCommand][this._currentComponent];

        component[component.length - 1].description = text;

      }

    }

    return this;

  }

  /**
  * Sets the required flag on an option.
  * @param value The required flag value.
  */
  public required(value: boolean): ArgumentalApp {

    // If no component selected
    if ( this._currentComponent !== 'options' )
      throw new Error(`ARGUMENTAL_ERROR: Cannot set the required flag because no option is selected!`);

    // If global
    if ( this._global ) {

      // Set for all options
      for ( const commandName in this._commands ) {

        if ( commandName === '' ) continue;

        const component = this._commands[commandName].options;

        component[component.length - 1].required = value;

      }

      // Update global declaration
      const component = this._globalDeclaration.options;

      component[component.length - 1].required = value;

    }
    // Specific component
    else {

      const component = this._commands[this._currentCommand].options;

      component[component.length - 1].required = value;

    }

    return this;

  }

  /**
  * Sets the multi flag on an option.
  * @param value The multi flag value.
  */
  public multi(value: boolean): ArgumentalApp {

    // If no component selected
    if ( this._currentComponent !== 'options' )
      throw new Error(`ARGUMENTAL_ERROR: Cannot set the multi flag because no option is selected!`);

    // If global
    if ( this._global ) {

      // Set for all options
      for ( const commandName in this._commands ) {

        if ( commandName === '' ) continue;

        const component = this._commands[commandName].options;

        component[component.length - 1].multi = value;

      }

      // Update global declaration
      const component = this._globalDeclaration.options;

      component[component.length - 1].multi = value;

    }
    // Specific component
    else {

      const component = this._commands[this._currentCommand].options;

      component[component.length - 1].multi = value;

    }

    return this;

  }

  /**
  * Sets the default value for an option or an argument.
  * @param value The default value.
  */
  public default(value: any): ArgumentalApp {

    // If no component selected
    if ( ! this._currentComponent )
      throw new Error(`ARGUMENTAL_ERROR: Cannot set the default value because no option or argument is selected!`);

    // If global
    if ( this._global ) {

      // Set for all options or arguments
      for ( const commandName in this._commands ) {

        if ( commandName === '' ) continue;

        const component = this._commands[commandName][this._currentComponent];

        if ( this._currentComponent === 'arguments' )
          (<Argumental.CommandArgumentDeclaration>component[component.length - 1]).default = value;
        else
          (<Argumental.OptionDeclaration>component[component.length - 1]).argument.default = value;

      }

      // Update global declaration
      const component = this._globalDeclaration[this._currentComponent];

      if ( this._currentComponent === 'arguments' )
        (<Argumental.CommandArgumentDeclaration>component[component.length - 1]).default = value;
      else
        (<Argumental.OptionDeclaration>component[component.length - 1]).argument.default = value;

    }
    // Specific component
    else {

      const component = this._commands[this._currentCommand][this._currentComponent];

      if ( this._currentComponent === 'arguments' )
        (<Argumental.CommandArgumentDeclaration>component[component.length - 1]).default = value;
      else
        (<Argumental.OptionDeclaration>component[component.length - 1]).argument.default = value;

    }

    return this;

  }

  /**
  * Sets the immediate flag on an option.
  * @param value The immediate flag value.
  */
  public immediate(value: boolean): ArgumentalApp {

    // If no component selected
    if ( this._currentComponent !== 'options' )
      throw new Error(`ARGUMENTAL_ERROR: Cannot set the immediate flag because no option is selected!`);

    // If global
    if ( this._global ) {

      // Set for all options
      for ( const commandName in this._commands ) {

        if ( commandName === '' ) continue;

        const component = this._commands[commandName].options;

        component[component.length - 1].immediate = value;

      }

      // Update global declaration
      const component = this._globalDeclaration.options;

      component[component.length - 1].immediate = value;

    }
    // Specific component
    else {

      const component = this._commands[this._currentCommand].options;

      component[component.length - 1].immediate = value;

    }

    return this;

  }

  /**
  * Sets validators for an option or an argument.
  * @param validators A single or an array of validators.
  */
  public validate(validators: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>): ArgumentalApp {

    // If no component selected
    if ( ! this._currentComponent )
      throw new Error(`ARGUMENTAL_ERROR: Cannot set validators because no option or argument is selected!`);

    // If global
    if ( this._global ) {

      // Set for all options and arguments
      for ( const commandName in this._commands ) {

        if ( commandName === '' ) continue;

        const component = this._commands[commandName][this._currentComponent];

        if ( this._currentComponent === 'arguments' )
          (<Argumental.CommandArgumentDeclaration>component[component.length - 1]).validators = (<Argumental.CommandArgumentDeclaration>component[component.length - 1]).validators.concat(validators);
        else
          (<Argumental.OptionDeclaration>component[component.length - 1]).argument.validators = (<Argumental.OptionDeclaration>component[component.length - 1]).argument.validators.concat(validators);

      }

      // Update global declaration
      const component = this._globalDeclaration[this._currentComponent];

      if ( this._currentComponent === 'arguments' )
        (<Argumental.CommandArgumentDeclaration>component[component.length - 1]).validators = (<Argumental.CommandArgumentDeclaration>component[component.length - 1]).validators.concat(validators);
      else
        (<Argumental.OptionDeclaration>component[component.length - 1]).argument.validators = (<Argumental.OptionDeclaration>component[component.length - 1]).argument.validators.concat(validators);



    }
    // Specific component
    else {

      const component = this._commands[this._currentCommand][this._currentComponent];

      if ( this._currentComponent === 'arguments' )
        (<Argumental.CommandArgumentDeclaration>component[component.length - 1]).validators = (<Argumental.CommandArgumentDeclaration>component[component.length - 1]).validators.concat(validators);
      else
        (<Argumental.OptionDeclaration>component[component.length - 1]).argument.validators = (<Argumental.OptionDeclaration>component[component.length - 1]).argument.validators.concat(validators);

    }

    return this;

  }

  /**
  * Alias for <code>validate()</code>
  */
  public sanitize(sanitizers: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>): ArgumentalApp {

    this.validate(sanitizers);

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
    // Reset the current component
    this._currentComponent = null;
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
  public action<T=any>(handler: Argumental.ActionHandler<T>): ArgumentalApp {

    // Check if no command is being declared and global flag is not set
    if ( this._currentCommand === null && ! this._global )
      throw new Error(`ARGUMENTAL_ERROR: Cannot add action handler because no command is being defined and global definition is disabled!`);

    // Add the action handler globally and append to all commands
    if ( this._global ) {

      this._globalDeclaration.actions.push(handler);

      for ( const commandName in this._commands ) {

        // Exclude top-level
        if ( commandName !== '' ) this._commands[commandName].actions.push(handler);

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
  public argument(syntax: string, description: string, validators: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>, defaultValue: any): ArgumentalApp;
  public argument(syntax: string, description?: string, validators?: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>, defaultValue?: any): ArgumentalApp {

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
      (this._currentCommand !== null && this._commands[this._currentCommand].arguments.filter(arg => arg.apiName === argument.apiName).length)
    )
      throw new Error(`ARGUMENTAL_ERROR: Argument ${argument.apiName} is already defined!`);

    // If global flag is enabled, add argument to global declaration and append to all commands
    if ( this._global ) {

      this._globalDeclaration.arguments.push(argument);

      for ( const commandName in this._commands ) {

        // Exclude top-level
        if ( commandName !== '' ) this._commands[commandName].arguments.push(argument);

      }

    }
    // Add argument to current command
    else {

      this._commands[this._currentCommand].arguments.push(argument);

    }

    // Update current component
    this._currentComponent = 'arguments';

    return this;

  }

  /**
  * Defines an option for the current command (or globally).
  * @param syntax The option syntax (e.g. "--no-color", "-p --port <port_number>", "-l --logs [level]").
  * @param description The option description to display in help.
  * @param required A boolean indicating if option is required.
  * @param validators A single or an array of validators.
  * @param multi A boolean indicating whether this option can be repeated more than once (only practical for options with argument).
  * @param defaultValue A default value to use for the option's argument (if defined).
  * @param immediate Whether to stop parsing other components and run the action handlers when this option is provided (e.g. --help).
  */
  public option(syntax: string): ArgumentalApp;
  public option(syntax: string, description: string): ArgumentalApp;
  public option(syntax: string, description: string, required: boolean): ArgumentalApp;
  public option(syntax: string, description: string, required: boolean, validators: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>): ArgumentalApp;
  public option(syntax: string, description: string, required: boolean, validators: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>, multi: boolean): ArgumentalApp;
  public option(syntax: string, description: string, required: boolean, validators: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>, multi: boolean, defaultValue: any): ArgumentalApp;
  public option(syntax: string, description: string, required: boolean, validators: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>, multi: boolean, defaultValue: any, immediate: boolean): ArgumentalApp;
  public option(syntax: string, description?: string, required?: boolean, validators?: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>, multi?: boolean, defaultValue?: any, immediate?: boolean): ArgumentalApp {

    // Check if no command is being declared and global flag is not set
    if ( this._currentCommand === null && ! this._global )
      throw new Error(`ARGUMENTAL_ERROR: Cannot define option ${syntax} because no command is being defined and global definition is disabled!`);

    // Parse option
    const option = this._parser.parseOption(syntax, description, required, validators, multi, defaultValue, immediate);

    // Check if option is already defined for current command or globally
    if (
      (this._global && this._globalDeclaration.options.filter(opt => (opt.longName && opt.longName === option.longName) || (opt.shortName && option.shortName === opt.shortName) || (opt.apiName && opt.apiName === option.apiName)).length) ||
      (this._currentCommand !== null && this._commands[this._currentCommand].options.filter(opt => (opt.longName && opt.longName === option.longName) || (opt.shortName && option.shortName === opt.shortName) || (opt.apiName && opt.apiName === option.apiName)).length)
    )
      throw new Error(`ARGUMENTAL_ERROR: Option ${option.longName || option.shortName} is already defined!`);

    // If global flag is enabled, add option to global declaration and append to all commands
    if ( this._global ) {

      this._globalDeclaration.options.push(option);

      for ( const commandName in this._commands ) {

        // Exclude top-level
        if ( commandName !== '' ) this._commands[commandName].options.push(option);

      }

    }
    // Add option to current command
    else {

      this._commands[this._currentCommand].options.push(option);

    }

    // Update current component
    this._currentComponent = 'options';

    return this;

  }

  /**
  * Parses the process arguments (argv) and runs the app.
  * @param argv Process arguments to parse.
  */
  public async parse(argv: string[]): Promise<void> {

    // Extract app name
    const appPath = argv.slice(1, 2)[0];

    if ( appPath ) this._name = path.basename(appPath);
    this._log.appName = this._name;

    // Display help for plain top-level argv
    if ( argv.length === 2 && this._topLevelPlainHelp ) {

      return this._log.help(this._commands, '');

    }

    // Parse arguments
    const parsed = this._parser.parseCliArguments(argv.slice(2), this._commands);

    // If parsing error
    if ( parsed instanceof Error ) return this._log.error(parsed);

    const command = this._commands[parsed.cmd];
    let immediateOption: Argumental.OptionDeclaration = null;

    // Check for immediate options
    for ( const option of command.options ) {

      // If immediate option provided
      if ( option.immediate && ((option.argument && parsed.opts[option.apiName || option.shortName] !== undefined) || (! option.argument && parsed.opts[option.apiName || option.shortName] === true )) ) {

        // Turn multi off
        option.multi = false;

        // Turn value array to single value if needed
        if ( parsed.opts[option.apiName || option.shortName] && typeof parsed.opts[option.apiName || option.shortName] === 'object' && parsed.opts[option.apiName || option.shortName].constructor === Array ) {

          if ( option.apiName ) parsed.opts[option.apiName] = parsed.opts[option.apiName][0];
          if ( option.shortName ) parsed.opts[option.shortName] = parsed.opts[option.shortName][0];

        }

        // Delete all other parsed values
        for ( const name in parsed.opts ) {

          if ( (option.apiName && name === option.apiName) || (option.shortName && name === option.shortName) )
            continue;

          delete parsed.opts[name];

        }

        // Clear parsed arguments
        parsed.args = {};

        immediateOption = option;
        break;

      }

    }

    // Skip arguments validation if immediate option was provided
    if ( ! immediateOption ) {

      // Validate arguments
      for ( const argument of command.arguments ) {

        if ( argument.required && parsed.args[argument.apiName] === null )
          return this._log.error(`Missing required argument <${argument.name}>!`);

      }

    }

    // Validate options
    for ( const option of command.options ) {

      // If immediate option provided, skip other options
      if ( immediateOption && option !== immediateOption ) continue;

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

    if ( ! immediateOption ) {

      // Run argument validators
      for ( const argument of command.arguments ) {

        // Skip validators if argument is optional and not provided
        if ( ! argument.required && parsed.args[argument.apiName] === null ) continue;

        for ( const validator of argument.validators ) {

          // Regex validator
          if ( validator && typeof validator === 'object' && validator.constructor === RegExp ) {

            if ( typeof parsed.args[argument.apiName] !== 'string' || ! parsed.args[argument.apiName].match(validator) )
              return this._log.error(`Invalid value for argument ${argument.name}!`);

            continue;

          }

          // Validator function
          let suspended = false;

          try {

            const newValue = await (<Argumental.Validator>validator)(parsed.args[argument.apiName], argument.name, true, parsed.cmd, () => { suspended = true; });

            // Update the value
            if ( newValue !== undefined ) parsed.args[argument.apiName] = newValue;

          }
          catch (error) {

            return this._log.error(error.message);

          }

          if ( suspended ) break;

        }

      }

    }

    // Run option validators
    for ( const option of command.options ) {

      // If immediate option provided, skip other validators
      if ( immediateOption && immediateOption !== option ) continue;

      const apiName = option.apiName || option.shortName;
      let wrapped = false;

      // If option is binary, skip validation
      if ( ! option.argument ) continue;
      // If option not required and not provided, skip validation
      if ( ! option.required && parsed.opts[apiName] === undefined ) continue;
      // If string option's argument not required and not provided (single occurrence only), skip validation
      if ( ! option.argument.required && parsed.opts[apiName] === null ) continue;

      // If value is not an array, wrap it temporarily
      if ( ! parsed.opts[apiName] || typeof parsed.opts[apiName] !== 'object' || parsed.opts[apiName].constructor !== Array ) {

        if ( option.shortName ) parsed.opts[option.shortName] = [<string>parsed.opts[option.shortName]];
        if ( option.apiName ) parsed.opts[option.apiName] = [<string>parsed.opts[option.apiName]];
        wrapped = true;

      }

      // For each option's value
      for ( let i = 0; i < (<Array<string>>parsed.opts[apiName]).length; i++ ) {

        let value = (<Array<string>>parsed.opts[apiName])[i];

        // If string option's argument not required and not provided, skip validation
        if ( ! option.argument.required && value === null ) continue;

        // Run the validators
        for ( const validator of option.argument.validators ) {

          // Regex validator
          if ( validator && typeof validator === 'object' && validator.constructor === RegExp ) {

            if ( typeof value !== 'string' || ! value.match(validator) )
              return this._log.error(`Invalid value for option ${option.longName || option.shortName}!`);

            continue;

          }

          // Validator function
          let suspended = false;

          try {

            const newValue = await (<Argumental.Validator>validator)(value, option.longName || option.shortName, false, parsed.cmd, () => { suspended = true; });

            // Update the value
            if ( newValue !== undefined ) {

              if ( option.shortName ) (<Array<string>>parsed.opts[option.shortName])[i] = (value = newValue);
              if ( option.apiName ) (<Array<string>>parsed.opts[option.apiName])[i] = (value = newValue);

            }

          }
          catch (error) {

            return this._log.error(error.message);

          }

          if ( suspended ) break;

        }

      }

      // Unwrap the value if it was wrapped
      if ( wrapped ) {

        if ( option.shortName ) parsed.opts[option.shortName] = parsed.opts[option.shortName][0];
        if ( option.apiName ) parsed.opts[option.apiName] = parsed.opts[option.apiName][0];

      }

    }

    // Skip arguments validation if immediate option was provided
    if ( ! immediateOption ) {

      // Apply argument defaults
      for ( const argument of command.arguments ) {

        if ( ! argument.required && parsed.args[argument.apiName] === null )
          parsed.args[argument.apiName] = <any>argument.default;

      }

    }

    // Apply option defaults
    for ( const option of command.options ) {

      const apiName = option.apiName || option.shortName;

      // If binary
      if ( ! option.argument ) continue;

      // If array
      if ( parsed.opts[apiName] && typeof parsed.opts[apiName] === 'object' && parsed.opts[apiName].constructor === Array ) {

        for ( let i = 0; i < (<Array<string>>parsed.opts[apiName]).length; i++ ) {

          if ( parsed.opts[apiName][i] === null || parsed.opts[apiName][i] === undefined ) {

            if ( option.apiName ) parsed.opts[option.apiName][i] = <any>option.argument.default;
            if ( option.shortName ) parsed.opts[option.shortName][i] = <any>option.argument.default;

          }

        }

      }
      // Single value
      else {

        if ( parsed.opts[apiName] === null || parsed.opts[apiName] === undefined ) {

          if ( option.shortName ) parsed.opts[option.shortName] = <any>option.argument.default;
          if ( option.apiName ) parsed.opts[option.apiName] = <any>option.argument.default;

        }

      }

    }

    const actionHandlerData: any = {};

    // Run action handlers
    for ( const action of command.actions ) {

      let suspended = false;

      try {

        await action({
          args: parsed.args,
          opts: parsed.opts,
          cmd: parsed.cmd,
          suspend: () => { suspended = true },
          data: actionHandlerData
        });

      }
      catch (error) {

        return this._log.error(error.message);

      }

      if ( suspended ) break;

    }

  }

}
