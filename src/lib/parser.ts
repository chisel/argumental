import _ from 'lodash';
import minimist from 'minimist';

export class Parser {

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
  * @param defaultValue The option's argument's default value.
  */
  public parseOption(syntax: string, description?: string, required?: boolean, validators?: Argumental.Validator|RegExp|Array<RegExp|Argumental.Validator>, defaultValue?: string|boolean|number): Argumental.OptionDeclaration {

    const option: Argumental.OptionDeclaration = {
      shortName: null,
      longName: null,
      apiName: null,
      description: description || null,
      argument: null,
      required: !! required
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
  * @param args The passed in arguments array.
  * @param commands The final commands object.
  */
  public parseCliArguments(args: string[], commands: { [command: string]: Argumental.CommandDeclaration }): minimist.ParsedArgs {

    return minimist(args);

  }

}
