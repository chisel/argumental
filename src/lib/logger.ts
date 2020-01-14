import chalk from 'chalk';
import _ from 'lodash';
import { Argumental } from '../types';

export class Logger {

  private readonly MESSAGES_TEMPLATE = `\n\n{{MESSAGES}}\n`;
  private readonly SINGLE_MESSAGE_TEMPLATE = `   {{MESSAGE}}\n`;
  private readonly HELP_SECTION_TEMPLATE = `\n\n   {{TITLE}}\n\n      `;
  /** Detected application name. */
  private _appName: string = null;
  /** Controls colored logging. */
  private _colors: boolean = true;
  /** Holds custom help renderer function. */
  private _customHelp: Function = null;

  /**
  * Builds the final message using the templates.
  * @param messages An array of string messages.
  */
  private _applyMessageTemplate(messages: string[]): string {

    let final: string = '';

    for ( const message of messages ) {

      final += this.SINGLE_MESSAGE_TEMPLATE.replace('{{MESSAGE}}', message);

    }

    final = this.MESSAGES_TEMPLATE.replace('{{MESSAGES}}', final);

    return final;

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

    console.error(
      this._applyMessageTemplate(
        messages
        .map(message => color.redBright.bold(message instanceof Error ? message.message : message))
        .concat(`Run ${color.bold(`${this._appName + ' ' || ''}--help`)} to display usage info`)
      )
    );

  }

  /**
  * Displays application help in the console.
  * @param definitions Command definitions list.
  * @param cmd The invoked command name.
  */
  public help(definitions: Argumental.List<Argumental.CommandDeclaration>, cmd: string): void {

    // If custom helpe renderer provided
    if ( this._customHelp ) return this._customHelp(_.cloneDeep(definitions), cmd);

    // Set colors
    let chalkOptions: any;

    if ( ! this._colors ) chalkOptions = { level: 0 };

    let color = new chalk.Instance(chalkOptions);
    let topLevelOnly = false, topLevelArguments = false;
    let text: string = '';

    // Determine top-level usage signature
    topLevelOnly = _.keys(definitions).length === 1;
    topLevelArguments = !! definitions[''].arguments.length;

    // If top-level
    if ( cmd === '' ) {

      // Add signature
      text =
      color`\n\n   {white.bold USAGE:}\n\n      ` +
      color`${this._appName ? this._appName + ' ' : ''}${! topLevelOnly ? color`{blueBright <command>} ` : (topLevelArguments ? color`{magenta <arguments>} ` : '')}{yellow.italic [options]}`;

    }
    // Command level
    else {

      // Add signature
      text =
      color`\n\n   {white.bold USAGE:}\n\n      ` +
      color`${this._appName ? this._appName + ' ' : ''}{blueBright ${cmd}}${
        definitions[cmd].arguments.map(arg => arg.required ? color`{magenta <${arg.name}>}` : color`{magenta [${arg.name}]}`).join(' ') + ' '
      }{yellow.italic [options]}`;

    }

    console.log(text + '\n\n');

  }

}
