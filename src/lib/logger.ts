import chalk from 'chalk';
import _ from 'lodash';
import { Argumental } from '../types';

export class Logger {

  private readonly PADDING: number = 3;
  /** Detected application name. */
  private _appName: string = null;
  /** Controls colored logging. */
  private _colors: boolean = true;
  /** Holds custom help renderer function. */
  private _customHelp: Function = null;

  /**
  * Returns the options signature of a command.
  * @param command A command definition.
  */
  private _getOptionsSignature(command: Argumental.CommandDeclaration): string {

    for ( const option of command.options ) {

      if ( option.required ) return `<options>`;

    }

    return chalk.italic('[options]');

  }

  /**
  * Returns a list of named argument signatures.
  * @param command A command definition.
  */
  private _getArgumentsSignatureList(command: Argumental.CommandDeclaration): string[] {

    const list: string[] = [];

    for ( const argument of command.arguments ) {

      if ( argument.required ) list.push(`<${argument.rest ? '...' : ''}${argument.name}>`);
      else list.push(chalk.italic(`[${argument.rest ? '...' : ''}${argument.name}]`));

    }

    return list;

  }

  /**
  * Determines if any arguments are defined for any command.
  * @param definitions List of command declarations.
  */
  private _doArgumentsExist(definitions: Argumental.List<Argumental.CommandDeclaration>): boolean {

    for ( const commandName in definitions ) {

      if ( definitions[commandName].arguments.length ) return true;

    }

    return false;

  }

  /**
  * Returns the longest string length.
  * @param strings Array of strings.
  */
  private _getLongest(strings: string[]): number {

    return Math.max(...strings.map(str => str.length));

  }

  /**
  * Returns padding based on logger configuration and level.
  * @param level The padding level.
  */
  private _pad(level: number = 1): string {

    return ' '.repeat(this.PADDING * level);

  }

  /**
  * Returns option syntax from definition.
  * @param option The option definition.
  */
  private _getOptionSyntax(option: Argumental.OptionDeclaration): any {

    const syntax: any = {};
    const segments: string[] = [];

    if ( option.shortName ) {

      syntax.short = `-${option.shortName}`;
      segments.push(syntax.short);

    }
    if ( option.longName ) {

      syntax.long = `--${option.longName}`;
      segments.push(syntax.long);

    }
    if ( option.argument ) {

      syntax.arg = `${option.required ? '<name>' : '[name]'}`.replace('name', option.argument.name);
      segments.push(syntax.arg);

    }

    syntax.full = segments.join(' ');

    return syntax;

  }

  /**
  * Determines if command has any multi options.
  * @param command The command definition.
  */
  private _hasMultiOption(command: Argumental.CommandDeclaration): boolean {

    for ( const option of command.options ) {

      if ( option.multi ) return true;

    }

    return false;

  }

  /**
  * Determines whether requirements differ between components (option declarations, argument declarations, etc.).
  * @param components An array of components.
  */
  private _doesRequirementsDiffer(components: Array<Argumental.OptionDeclaration|Argumental.ArgumentDeclaration>): boolean {

    let lastRequirement: boolean = undefined;

    for ( const component of components ) {

      if ( lastRequirement === undefined ) {

        lastRequirement = component.required;
        continue;

      }

      if ( component.required !== lastRequirement ) return true;

    }

    return false;

  }

  /**
  * Determines if there are any required declarations in a set of components (option declarations, argument declarations, etc.).
  * @param components An array of components.
  */
  private _anyRequired(components: Array<Argumental.OptionDeclaration|Argumental.ArgumentDeclaration>): boolean {

    for ( const component of components ) {

      if ( component.required ) return true;

    }

    return false;

  }

  /** Application name setter. */
  public set appName(name: string) {

    this._appName = name;

  }

  /** Log colors setter. */
  public set colors(value: boolean) {

    this._colors = value;

  }

  /** Custom help renderer function setter. */
  public set customHelpRenderer(renderer: Function) {

    this._customHelp = renderer;

  }

  /**
  * Logs an error.
  * @param messages An array of string and/or error messages.
  */
  public error(...messages: Array<string|Error>): void {

    // Set colors
    let chalkOptions: any;

    if ( ! this._colors ) chalkOptions = { level: 0 };

    let color = new chalk.Instance(chalkOptions);

    console.log('');

    console.error(
      ...messages
      .map(message => color.redBright.bold(message instanceof Error ? this._pad() + message.message : this._pad() + message))
      .concat(`\n${this._pad()}Run ${color.bold(`${this._appName + ' ' || ''}--help`)} to display usage info`)
    );

    console.log('');

  }

  /**
  * Displays application help in the console.
  * @param definitions Command definitions list.
  * @param cmd The invoked command name.
  */
  public help(definitions: Argumental.List<Argumental.CommandDeclaration>, cmd: string): void {

    // If custom help renderer provided
    if ( this._customHelp ) return this._customHelp(_.cloneDeep(definitions), cmd);

    // Set colors
    let chalkOptions: any;

    if ( ! this._colors ) chalkOptions = { level: 0 };

    let color = new chalk.Instance(chalkOptions);
    // Determine top-level usage signature
    let topLevelOnly = _.keys(definitions).length === 1;
    let usageSection: string, usageDescription: string, commandsSection: string, argumentsSection: string, optionsSection: string;

    // Render usage section
    usageSection = color.white.bold('USAGE: ');

    // If top-level
    if ( cmd === '' ) {

      let segments: string[] = [];

      if ( this._appName ) segments.push(this._appName);

      // Generic signature
      if ( definitions[''].original ) {

        if ( ! topLevelOnly ) segments.push(color.blueBright('<command>'));
        if ( this._doArgumentsExist(definitions) ) segments.push(color.magenta(`<arguments>`));

        segments.push(color.yellow.italic('[options]'));

      }
      // Top-level specific signature
      else {

        segments = segments.concat(this._getArgumentsSignatureList(definitions['']).map(sig => color.magenta(sig)));
        segments.push(color.yellow(this._getOptionsSignature(definitions[''])));

      }

      usageSection += segments.join(' ');

    }
    // Command level
    else {

      let segments: string[] = [];

      if ( this._appName ) segments.push(this._appName);

      segments.push(color.blueBright(cmd));
      segments = segments.concat(this._getArgumentsSignatureList(definitions[cmd]).map(sig => color.magenta(sig)));
      segments.push(color.yellow(this._getOptionsSignature(definitions[cmd])));

      usageSection += segments.join(' ');

    }

    // Render top-level description
    if ( cmd === '' && ! definitions[''].original && definitions[''].description ) {

      usageDescription = definitions[''].description;

    }
    else if ( cmd !== '' && definitions[cmd].description ) {

      usageDescription = definitions[cmd].description;

    }

    // Render commands section
    if ( cmd === '' && ! topLevelOnly ) {

      commandsSection = color.white.bold('COMMANDS:\n\n');

      // Display command-specific usage (if usage was not generic)
      if ( ! definitions[''].original ) {

        const segments: string[] = [color.white.bold('USAGE:')];

        if ( this._appName ) segments.push(this._appName);
        segments.push(color.blueBright('<command>'));
        if ( this._doArgumentsExist(definitions) ) segments.push(color.magenta(`<arguments>`));

        segments.push(color.yellow.italic('[options]'));

        commandsSection += `${this._pad(2)}${segments.join(' ')}\n\n`;

      }

      const longest = this._getLongest(_.keys(definitions).map(name => [name, ...definitions[name].aliases].join('|')));

      for ( const command of _.values(definitions).sort((a, b) => a.order - b.order) ) {

        if ( command.name === '' ) continue;

        const commandRightPad = ' '.repeat(longest - [command.name, ...command.aliases].join('|').length);
        const coloredSyntax = [color.blueBright(command.name), ...command.aliases.map(alias => color.blueBright(alias))].join(color.dim('|'));

        // Command name
        commandsSection += `${this._pad(2)}${coloredSyntax}${commandRightPad}`;
        // Command description
        if ( command.description ) commandsSection += `${this._pad()}${command.description}`;

        commandsSection += '\n';

      }

    }

    // Render arguments section
    // If not generic top-level
    if ( (cmd !== '' || ! definitions[''].original) && definitions[cmd].arguments.length ) {

      argumentsSection = color.white.bold('ARGUMENTS:\n\n');

      const longest = this._getLongest(definitions[cmd].arguments.map(arg => arg.name));
      const requirementsDiffer = this._doesRequirementsDiffer(definitions[cmd].arguments);

      for ( const argument of definitions[cmd].arguments ) {

        // Argument name
        argumentsSection += `${this._pad(2)}${color.magenta((argument.rest ? '...' : '') + argument.name.padEnd(longest - (argument.rest ? 3 : 0)))}`;
        // Argument requirement
        if ( requirementsDiffer ) argumentsSection += `${this._pad()}${argument.required ? color.bold('required') : color.italic.dim('optional')}`;
        // Argument description
        if ( argument.description ) argumentsSection += `${this._pad()}${argument.description}`;

        argumentsSection += '\n';

      }

    }

    // Render options section
    optionsSection = color.white.bold('OPTIONS:\n\n');

    const longest = this._getLongest(definitions[cmd].options.map(opt => this._getOptionSyntax(opt).full));
    const anyMulti = this._hasMultiOption(definitions[cmd]);
    const anyRequired = this._anyRequired(definitions[cmd].options);

    for ( const option of definitions[cmd].options ) {

      // Option syntax
      const syntax = this._getOptionSyntax(option);
      const syntaxRightPad = ' '.repeat(longest - syntax.full.length);

      optionsSection += `${this._pad(2)}${syntax.short ? color.yellow(syntax.short) + ' ' : ''}${syntax.long ? color.yellow(syntax.long) + ' ' : ''}${syntax.arg ? color.magenta(syntax.arg) + ' ' : ''}${syntaxRightPad}`;
      optionsSection = optionsSection.substr(0, optionsSection.length - 1);

      // Option requirement
      if ( anyRequired ) optionsSection += `${this._pad()}${option.required ? color.bold('required') : color.italic.dim('optional')}`;
      // Option repeatable (multi)
      if ( anyMulti ) optionsSection += `${this._pad()}${option.multi ? color.greenBright('repeatable') : '          '}`;
      // Option description
      if ( option.description ) optionsSection += `${this._pad()}${option.description}`;

      optionsSection += '\n';

    }

    console.log('\n');

    console.log(`${this._pad()}${usageSection}\n`);
    if ( usageDescription ) console.log(`${this._pad()}${usageDescription}\n`);
    if ( commandsSection ) console.log(`${this._pad()}${commandsSection}`);
    if ( argumentsSection ) console.log(`${this._pad()}${argumentsSection}`);
    console.log(`${this._pad()}${optionsSection}`);

    if ( ! topLevelOnly && cmd === '' ) console.log(`${this._pad()}Run ${this._appName ? this._appName + ' ' : ''}${color.blueBright('<command>')} ${color.yellow('--help')} to view command-specific help.\n`);

    console.log('');

  }

}
