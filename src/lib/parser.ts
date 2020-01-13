import _ from 'lodash';
import minimist from 'minimist';

export class Parser {

  /**
  * Determines if value is an array.
  * @param value The value to check.
  */
  private _isArray(value: any): boolean {

    return value && typeof value === 'object' && value.constructor === Array;

  }

  /**
  * Determines whether a value can overwrite the other version (short name and long name for options).
  * @param value The provided value.
  */
  private _canOverwriteOpt(value: any): boolean {

    return typeof value === 'string' || value === null || this._isArray(value);

  }

  /**
  * Sorts an array of values based on their order of occurrence in the process arguments.
  * @param args The process arguments.
  * @param values The named values array (e.g. ['-a 0', '--abort 1', '-a']).
  */
  private _sortBasedOnPriority(args: string[], values: string[]): string[] {

    return values.sort((a, b) => args.join(' ').indexOf(' ' + a) - args.join(' ').indexOf(' ' + b));

  }

  /**
  * Returns Argumental parsed option equivalent of Minimist parsed.
  * @param minimistParsed The Minimist parsed object.
  * @param minimistName The Minimist parsed object key.
  */
  private _getArgumentalValue(minimistParsed: minimist.ParsedArgs, minimistName: string): any {

    // If not provided at all
    if ( ! minimistParsed.hasOwnProperty(minimistName) ) return undefined;
    // If provided without argument
    else if ( minimistParsed[minimistName] === '' ) return null;
    // If provided with argument
    else {

      // If array, transform each value
      if ( this._isArray(minimistParsed[minimistName]) ) {

        const transformed: string[] = [];

        for ( const value of minimistParsed[minimistName] ) {

          // If provided without argument
          if ( value === '' ) transformed.push(null);
          else transformed.push(value);

        }

        return transformed;

      }
      else {

        return minimistParsed[minimistName];

      }

    }

  }

  /**
  * Adds a Minimist parsed string option to Argumental parsed object with proper translation.
  * @param minimistParsed The Minimist parsed object.
  * @param argumentalParsed The Argumental parsed object.
  * @param minimistName The Minimist parsed object key.
  * @param argumentalName The Argumental parsed object key.
  */
  private _addStringOption(
    minimistParsed: minimist.ParsedArgs,
    argumentalParsed: Argumental.ParsedArguments,
    minimistName: string,
    argumentalName: string
  ): void {

    // If argumental parsed exists and is not an array
    if ( argumentalParsed.opts.hasOwnProperty(argumentalName) && ! this._isArray(argumentalParsed.opts[argumentalName]) ) {

      // Turn into array
      argumentalParsed.opts[argumentalName] = [<string>argumentalParsed.opts[argumentalName]];

      (<string[]>argumentalParsed.opts[argumentalName]) = (<string[]>argumentalParsed.opts[argumentalName]).concat(this._getArgumentalValue(minimistParsed, minimistName));

    }
    else {

      argumentalParsed.opts[argumentalName] = this._getArgumentalValue(minimistParsed, minimistName);

    }

  }

  /**
  * Parses an argument based on the given syntax.
  * @param syntax The argument syntax.
  * @param validators A single or an array of validators.
  * @param defaultValue Argument's default value.
  */
  public parseArgument(syntax: string, validators?: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>, defaultValue?: string|boolean|number): Argumental.ArgumentDeclaration {

    // Check if argument has wrong syntax or contains invalid characters
    if ( ! syntax.trim().match(/^(<[a-z0-9-_]+>)|(\[[a-z0-9-_]+\])$/i) )
      throw new Error(`ARGUMENTAL_ERROR: Argument ${syntax.trim()} has invalid syntax or contains invalid characters!`);

    // Check if argument name has consecutive - or _s, or it starts or ends with - or _
    const name = syntax.trim().match(/^[<\[]([a-z0-9-_]+)[>\]]$/i)[1].toLowerCase();

    if ( name.includes('__') || name.includes('--') || (name.includes('-') && name.includes('_')) || ['-', '_'].includes(name[0]) || ['-', '_'].includes(name[name.length - 1]) )
      throw new Error(`ARGUMENTAL_ERROR: Argument ${name} has invalid name!`);

    const argument: Argumental.ArgumentDeclaration = {
      name: name,
      apiName: _.camelCase(name),
      required: syntax.trim()[0] === '<',
      validators: [],
      default: defaultValue
    };

    // Sanitize validators array
    if ( validators && (typeof validators !== 'object' || validators.constructor !== Array) ) (<any>validators) = [validators];
    else if ( ! validators ) validators = [];

    // Validate validators type
    for ( const validator of <Array<RegExp|Argumental.Validator>>validators ) {

      // Check if validator is invalid
      if ( typeof validator !== 'function' && (! validator || typeof validator !== 'object' || validator.constructor !== RegExp) )
        throw new Error(`ARGUMENTAL_ERROR: Invalid validator for argument ${argument.name}! Validator must be either a validator function or a regular expression.`);

      // Append validator
      argument.validators.push(validator);

    }

    return argument;

  }

  /**
  * Parses an option based on the given syntax.
  * @param syntax The option syntax.
  * @param description The option description to display in help.
  * @param required A boolean indicating if option is required.
  * @param validators A single or an array of validators.
  * @param multi A boolean indicating if option can be repeated more than once.
  * @param defaultValue The option's argument's default value.
  * @param immediate Whether to stop parsing other components and run the action handlers when this option is provided.
  */
  public parseOption(syntax: string, description?: string, required?: boolean, validators?: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>, multi?: boolean, defaultValue?: string|boolean|number, immediate?: boolean): Argumental.OptionDeclaration {

    const option: Argumental.OptionDeclaration = {
      shortName: null,
      longName: null,
      apiName: null,
      description: description || null,
      argument: null,
      required: !! required,
      multi: !! multi,
      immediate: !! immediate
    };

    // Parse short name
    const shortNameMatch = syntax.trim().match(/^-([a-z])( |$)|^--[a-z0-9-]{2,} -([a-z])( |$)/i);

    if ( shortNameMatch ) option.shortName = shortNameMatch[1] || shortNameMatch[3];

    // Parse long name
    const longNameMatch = syntax.trim().match(/^--([a-z0-9-]{2,})|^-[a-z] --([a-z0-9-]{2,})/i);

    if ( longNameMatch ) {

      option.longName = longNameMatch[1] || longNameMatch[2];
      option.apiName = _.camelCase(option.longName);

    }

    // Parse argument
    const argumentMatch = syntax.trim().match(/(<[a-z0-9-_]+>)|(\[[a-z0-9-_]+\])$/i);

    if ( argumentMatch ) option.argument = this.parseArgument(argumentMatch[1] || argumentMatch[2], validators, defaultValue);

    // Check if option has wrong syntax or contains invalid characters
    const invalidLongName = option.longName && (option.longName.includes('--') || option.longName[0] === '-' || option.longName[option.longName.length - 1] === '-');
    const syntaxWithoutArgument = syntax.trim().replace(/<[a-z0-9-_]+>|\[[a-z0-9-_]+\]$/i, '').trim();

    if ( (! syntaxWithoutArgument.match(/^-[a-z]( --[a-z-]{2,})?$/i) && ! syntaxWithoutArgument.match(/^--[a-z-]{2,}( -[a-z])?$/i)) || invalidLongName || (! option.shortName && ! option.longName) )
      throw new Error(`ARGUMENTAL_ERROR: Option ${syntax} has invalid syntax or contains invalid characters!`);

    return option;

  }

  /**
  * Parses command-line arguments with options tailored for the given commands.
  * @param args The passed in arguments array (should be <code>process.argv.slice(2)</code>).
  * @param commands The final commands object.
  */
  public parseCliArguments(args: string[], commands: { [command: string]: Argumental.CommandDeclaration }): Argumental.ParsedArguments|Error {

    // Detect command
    let detectedCommand: string = '';
    let remainingArgs: string[] = null;
    const commandMappings: Argumental.List<string> = {};

    // Create command mappings including aliases
    for ( const command in commands ) {

      // Add the command itself
      commandMappings[command] = command;

      // Add all aliases
      for ( const alias of commands[command].aliases ) {

        commandMappings[alias] = command;

      }

    }

    // Detect all commands and aliases in the passed-in arguments (using the mappings)
    for ( const command in commandMappings ) {

      const segments = command.split(' ');

      if ( _.isEqual(segments, args.slice(0, segments.length)) ) {

        detectedCommand = commandMappings[command];
        remainingArgs = args.slice(segments.length);

        break;

      }

    }

    // Configure Minimist
    const minimistConfig = { boolean: [], string: [] };

    for ( const option of commands[detectedCommand].options ) {

      const pointer = option.argument ? minimistConfig.string : minimistConfig.boolean;

      if ( option.shortName ) pointer.push(option.shortName);
      if ( option.longName ) pointer.push(option.longName);

    }

    // Parse arguments using Minimist
    const parsed = minimist(remainingArgs || args, minimistConfig);
    const parsedArgs: Argumental.ParsedArguments = { cmd: detectedCommand, args: {}, opts: {} };

    // Add arguments
    for ( const argument of commands[detectedCommand].arguments ) {

      parsedArgs.args[argument.apiName] = parsed._.shift() || null;

    }

    // If top-level has no arguments and detected is top-level while arguments are provided, count as unknown command
    if ( detectedCommand === '' && ! commands[detectedCommand].arguments.length && parsed._.length ) return new Error(`Unknown command!`);

    // Add options
    for ( const option of commands[detectedCommand].options ) {

      // If boolean option
      if ( ! option.argument ) {

        if ( option.longName ) parsedArgs.opts[option.apiName] = !! parsed[option.longName];
        if ( option.shortName ) parsedArgs.opts[option.shortName] = !! parsed[option.shortName];

      }
      // If string option (with argument)
      else {

        // Set long name
        if ( option.longName ) this._addStringOption(parsed, parsedArgs, option.longName, option.apiName);

        // Set short name
        if ( option.shortName ) this._addStringOption(parsed, parsedArgs, option.shortName, option.shortName);

      }

    }

    // Sanitize options
    for ( const option of commands[detectedCommand].options ) {

      // Option with argument
      if ( option.argument ) {

        if ( option.longName && option.shortName ) {

          // If option has both names and both their values are either a string or an array of strings, merge them
          if ( this._canOverwriteOpt(parsedArgs.opts[option.apiName]) && this._canOverwriteOpt(parsedArgs.opts[option.shortName]) ) {

            let merged: string[] = [];

            // Merge and transform longNames
            if ( this._isArray(parsedArgs.opts[option.apiName]) ) {

              merged = merged.concat((<string[]>parsedArgs.opts[option.apiName]).map(value => {

                // If value is null, transform it to empty name (e.g. --abort)
                if ( value === null ) return `--${option.longName}`;
                // Otherwise, transform it fully (e.g. --abort 0)
                else return `--${option.longName} ${value}`;

              }));

            }
            else {

              // If value is null, transform it to empty name (e.g. --abort)
              if ( parsedArgs.opts[option.apiName] === null )
                merged.push(`--${option.longName}`);
              // Otherwise, transform it fully (e.g. --abort 0)
              else
                merged.push(`--${option.longName} ${parsedArgs.opts[option.apiName]}`);

            }

            // Merge and transform shortNames
            if ( this._isArray(parsedArgs.opts[option.shortName]) ) {

              merged = merged.concat((<string[]>parsedArgs.opts[option.shortName]).map(value => {

                // If value is null, transform it to empty name (e.g. -a)
                if ( value === null ) return `-${option.shortName}`;
                // Otherwise, transform it fully (e.g. -a 0)
                else return `-${option.shortName} ${value}`;

              }));

            }
            else {

              // If value is null, transform it to empty name (e.g. -a)
              if ( parsedArgs.opts[option.shortName] === null )
                merged.push(`-${option.shortName}`);
              // Otherwise, transform it fully (e.g. -a 0)
              else
                merged.push(`-${option.shortName} ${parsedArgs.opts[option.shortName]}`);

            }

            // Sort the merged named values based on their order of occurrence in args
            merged = this._sortBasedOnPriority(args, merged);

            // Transform named values to original form
            merged = merged.map(value => {

              // If name only
              if ( value.match(/^-(-)?[^ ]+$/i) ) return null;
              // If name and value
              return value.match(/^-(-)?[^ ]+ (.+)$/i)[2];

            });

            parsedArgs.opts[option.shortName] = merged;
            parsedArgs.opts[option.apiName] = merged;

          }

          // If has short name and it is string or array of string and long name is either null or undefined, align
          if ( ! this._canOverwriteOpt(parsedArgs.opts[option.apiName]) && this._canOverwriteOpt(parsedArgs.opts[option.shortName]) )
            parsedArgs.opts[option.apiName] = parsedArgs.opts[option.shortName];

          // If has long name and it is string or array of string and short name is either null or undefined, align
          if ( ! this._canOverwriteOpt(parsedArgs.opts[option.shortName]) && this._canOverwriteOpt(parsedArgs.opts[option.apiName]) )
            parsedArgs.opts[option.shortName] = parsedArgs.opts[option.apiName];

        }

      }
      // Binary option
      else {

        // If boolean option has both names and their value differs, align them
        if ( option.shortName && option.longName ) {

          if ( parsedArgs.opts[option.shortName] === true && parsedArgs.opts[option.apiName] === false ) parsedArgs.opts[option.apiName] = true;
          if ( parsedArgs.opts[option.shortName] === false && parsedArgs.opts[option.apiName] === true ) parsedArgs.opts[option.shortName] = true

        }

      }

    }

    // Remove wrapping "" for string values
    for ( const name in parsedArgs.opts ) {

      // If value is array
      if ( this._isArray(parsedArgs.opts[name]) ) {

        (<string[]>parsedArgs.opts[name]) = (<string[]>parsedArgs.opts[name]).map(value => {

          // If value is not string or was not wrapped
          if ( typeof value !== 'string' || ! value.match(/^".*"$/i) ) return value;

          return value.replace(/^"/, '').replace(/"$/, '');

        });

      }
      else {

        // If value is not string or was not wrapped
        if ( typeof parsedArgs.opts[name] !== 'string' || ! (<string>parsedArgs.opts[name]).match(/^".*"$/i) ) continue;

        parsedArgs.opts[name] = (<string>parsedArgs.opts[name]).replace(/^"/, '').replace(/"$/, '');

      }

    }

    let immediateOption: Argumental.OptionDeclaration = null;

    // Check for immediate options
    for ( const option of commands[detectedCommand].options ) {

      // If immediate option provided
      if ( option.immediate && ((option.argument && parsedArgs.opts[option.apiName || option.shortName] !== undefined) || (! option.argument && parsedArgs.opts[option.apiName || option.shortName] === true )) ) {

        immediateOption = option;
        break;

      }

    }

    // If more arguments were provided (any arguments left over) and no immediate option provided
    if ( parsed._.length && ! immediateOption )
      return new Error(`Expected ${commands[detectedCommand].arguments.length} arguments but got ${commands[detectedCommand].arguments.length + parsed._.length}!`);

    // If unknown options were provided and no immediate option was
    if ( ! immediateOption ) {

      for ( const key in parsed ) {

        if ( key === '_' ) continue;

        // If key was not defined in current command's options
        if ( ! commands[detectedCommand].options.filter(opt => opt.shortName === key || opt.longName === key).length )
          return new Error(`Unknown option ${key}!`);

      }

    }

    return parsedArgs;

  }

}
