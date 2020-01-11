import chalk from 'chalk';

export class Logger {

  private readonly TEMPLATE: string = `\n\n{{MESSAGES}}\n`;
  private readonly SINGLE_MESSAGE_TEMPLATE = `   {{MESSAGE}}\n`;
  /** Detected application name. */
  private _appName: string = null;

  /**
  * Builds the final message using the templates.
  * @param messages An array of string messages.
  */
  private _applyTemplate(messages: string[]): string {

    let final: string = '';

    for ( const message of messages ) {

      final += this.SINGLE_MESSAGE_TEMPLATE.replace('{{MESSAGE}}', message);

    }

    final = this.TEMPLATE.replace('{{MESSAGES}}', final);

    return final;

  }

  public set appName(name: string) {

    this._appName = name;

  }

  /**
  * Logs an error.
  * @param messages An array of string and/or error messages.
  */
  public error(...messages: Array<string|Error>): void {

    console.error(
      this._applyTemplate(
        messages
        .map(message => chalk.redBright.bold(message instanceof Error ? message.message : message))
        .concat(`Run ${chalk.bold(`${this._appName + ' ' || ''}--help`)} to display usage info`)
      )
    );

  }

}
