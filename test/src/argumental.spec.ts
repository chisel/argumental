import { expect } from 'chai';
import { ArgumentalApp } from '../../dist/lib/argumental';
import { BuiltInValidators } from '../../dist/lib/validators';

describe('App', function() {

  const validators = new BuiltInValidators();

  it('should define app correctly', function() {

    const app = new ArgumentalApp();
    let lastActionFlag: string[] = [];

    app
    .version('1.0.0')
    .global
    .argument('[global_argument]', 'A global argument')
    .option('-l --log [level]', 'Enables logging', false, /^verbose$|^info$|^warn$|^error$/i, true, 'info')
    .action(() => {

      lastActionFlag.push('global_first');

    })
    .command('script new', 'Uploads a new script')
    .alias('newScript')
    .alias('sn')
    .argument('<script_type>', 'Script type', /^scraper$|^processor$|^validator$|^reporter$|^deployer$/i)
    .argument('<file_path>', 'Relative path to the script file', validators.FILE_PATH)
    .option('--override-name -o <script_name>', 'Overrides the script name')
    .option('--overwrite -O', 'Overwrites any scripts with the same type and name', true)
    .option('-c --clean [force]', 'Cleans the scripts directory (if force is true, kills any script processes before cleaning)', false, validators.BOOLEAN)
    .action(() => {

      lastActionFlag.push('direct_first');

    })
    .action(() => {

      lastActionFlag.push('direct_second');

    })
    .global
    .action(() => {

      lastActionFlag.push('global_second');

    });

    const commands: Argumental.List<Argumental.CommandDeclaration> = (<any>app)._commands;
    const newScriptCommand = commands['script new'];

    expect(commands.hasOwnProperty('script new')).to.be.true;
    expect(newScriptCommand.name).to.equal('script new');
    expect(newScriptCommand.description).to.equal('Uploads a new script');
    expect(newScriptCommand.aliases).to.deep.equal(['newScript', 'sn']);
    expect(newScriptCommand.actions.length).to.equal(4);

    expect(newScriptCommand.arguments).to.deep.equal([
      {
        name: 'global_argument',
        apiName: 'globalArgument',
        description: 'A global argument',
        required: false,
        validators: [],
        default: undefined
      },
      {
        name: 'script_type',
        apiName: 'scriptType',
        description: 'Script type',
        required: true,
        validators: [/^scraper$|^processor$|^validator$|^reporter$|^deployer$/i],
        default: undefined
      },
      {
        name: 'file_path',
        apiName: 'filePath',
        description: 'Relative path to the script file',
        required: true,
        validators: [validators.FILE_PATH],
        default: undefined
      }
    ]);

    expect(newScriptCommand.options).to.deep.equal([
      {
        shortName: 'l',
        longName: 'log',
        apiName: 'log',
        description: 'Enables logging',
        required: false,
        multi: true,
        argument: {
          name: 'level',
          apiName: 'level',
          required: false,
          default: 'info',
          validators: [/^verbose$|^info$|^warn$|^error$/i]
        }
      },
      {
        shortName: 'o',
        longName: 'override-name',
        apiName: 'overrideName',
        description: 'Overrides the script name',
        required: false,
        multi: false,
        argument: {
          name: 'script_name',
          apiName: 'scriptName',
          required: true,
          default: undefined,
          validators: []
        }
      },
      {
        shortName: 'O',
        longName: 'overwrite',
        apiName: 'overwrite',
        description: 'Overwrites any scripts with the same type and name',
        required: true,
        multi: false,
        argument: null
      },
      {
        shortName: 'c',
        longName: 'clean',
        apiName: 'clean',
        description: 'Cleans the scripts directory (if force is true, kills any script processes before cleaning)',
        required: false,
        multi: false,
        argument: {
          name: 'force',
          apiName: 'force',
          required: false,
          default: undefined,
          validators: [validators.BOOLEAN]
        }
      }
    ]);

  });

  it('should report parsing errors correctly', function() {

    const app = new ArgumentalApp();

    app
    .command('test')
    .argument('<arg1>')
    .argument('[arg2]')
    .option('-o --option', '', true)
    .option('-a --arg-option <arg>')
    .option('-s --save [name]', '', false, null, true);

    // Capture error messages
    let errors: string[] = [];

    (<any>app)._log.error = (...messages: Array<string|Error>) => {

      errors = errors.concat(messages.map(message => message instanceof Error ? message.message : message));

    };

    // Parse and test errors
    app.parse(['node', './test', 'a']);

    expect(errors.shift()).to.equal(`Unknown command!`);
    expect(errors).to.be.empty;

    app.parse(['node', './test', 'test']);

    expect(errors.shift()).to.equal('Missing value for required argument <arg1>!');
    expect(errors).to.be.empty;

    app.parse(['node', './test', 'test', '1', '2', '3']);

    expect(errors.shift()).to.equal('Expected 2 arguments but got 3!');
    expect(errors).to.be.empty;

    app.parse(['node', './test', 'test', '1', '2']);

    expect(errors.shift()).to.equal('Missing required option --option!');
    expect(errors).to.be.empty;

    app.parse(['node', './test', 'test', '1', '2', '-o', '-a', '2', '--arg-option']);

    expect(errors.shift()).to.equal('Option --arg-option cannot be provided more than once!');
    expect(errors).to.be.empty;

    app.parse(['node', './test', 'test', '1', '2', '--arg-option', '-o']);

    expect(errors.shift()).to.equal('Missing required value for option --arg-option!');
    expect(errors).to.be.empty;

  });

});
