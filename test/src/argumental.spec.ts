import { expect } from 'chai';
import { ArgumentalApp } from '../../dist/lib/argumental';
import { BuiltInValidators } from '../../dist/lib/validators';

describe('App', function() {

  const validators = new BuiltInValidators();

  it('should define app correctly', function() {

    const app = new ArgumentalApp();

    app
    .version('1.0.0')
    .global
    .argument('[global_argument]', 'A global argument')
    .option('-l --log [level]', 'Enables logging', false, /^verbose$|^info$|^warn$|^error$/i, true, 'info')
    .action(() => { })
    .command('script new', 'Uploads a new script')
    .alias('newScript')
    .alias('sn')
    .argument('<script_type>', 'Script type', /^scraper$|^processor$|^validator$|^reporter$|^deployer$/i)
    .argument('<file_path>', 'Relative path to the script file', validators.FILE_PATH)
    .option('--override-name -o <script_name>', 'Overrides the script name')
    .option('--overwrite -O', 'Overwrites any scripts with the same type and name', true)
    .option('-c --clean [force]', 'Cleans the scripts directory (if force is true, kills any script processes before cleaning)', false, validators.BOOLEAN)
    .action(() => { })
    .action(() => { })
    .global
    .action(() => { });

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

  it('should report parsing errors correctly', async function() {

    let app = new ArgumentalApp();

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
    await app.parse(['node', './test', 'a']);

    expect(errors.shift()).to.equal(`Unknown command!`);
    expect(errors).to.be.empty;

    await app.parse(['node', './test', 'test']);

    expect(errors.shift()).to.equal('Missing required argument <arg1>!');
    expect(errors).to.be.empty;

    await app.parse(['node', './test', 'test', '1', '2', '3']);

    expect(errors.shift()).to.equal('Expected 2 arguments but got 3!');
    expect(errors).to.be.empty;

    await app.parse(['node', './test', 'test', '1', '2']);

    expect(errors.shift()).to.equal('Missing required option --option!');
    expect(errors).to.be.empty;

    await app.parse(['node', './test', 'test', '1', '2', '-o', '-a', '2', '--arg-option']);

    expect(errors.shift()).to.equal('Option --arg-option cannot be provided more than once!');
    expect(errors).to.be.empty;

    await app.parse(['node', './test', 'test', '1', '2', '--arg-option', '-o']);

    expect(errors.shift()).to.equal('Missing required value for option --arg-option!');
    expect(errors).to.be.empty;

    app = new ArgumentalApp();

    app
    .command('test')
    .option('-p --port [number]', null, true)
    .option('-h --host <url>')
    .option('--protocol <arg>', null, false, null, true)
    .option('-l --logs [level]')
    .argument('<arg1>')
    .argument('[arg2]');

    errors = [];

    (<any>app)._log.error = (...messages: Array<string|Error>) => {

      errors = errors.concat(messages.map(message => message instanceof Error ? message.message : message));

    };

    await app.parse(['node', 'test', 'test']);

    expect(errors.shift()).to.equal(`Missing required argument <arg1>!`);
    expect(errors).to.be.empty;

    await app.parse(['node', 'test', 'test', 'val1']);

    expect(errors.shift()).to.equal(`Missing required option --port!`);
    expect(errors).to.be.empty;

    await app.parse(['node', 'test', 'test', 'val1', '--port']);

    expect(errors).to.be.empty;

    await app.parse(['node', 'test', 'test', 'val1', '--port', '-h']);

    expect(errors.shift()).to.equal(`Missing required value for option --host!`);
    expect(errors).to.be.empty;

    await app.parse(['node', 'test', 'test', 'val1', '--port', '-h', 'host']);

    expect(errors).to.be.empty;

    await app.parse(['node', 'test', 'test', 'val1', '--port', '-h', 'host', '--protocol', '--protocol', 'https']);

    expect(errors.shift()).to.equal(`Missing required value for option --protocol!`);
    expect(errors).to.be.empty;

    await app.parse(['node', 'test', 'test', 'val1', '--port', '-h', 'host', '--protocol', 'http', '--protocol', 'https']);

    expect(errors).to.be.empty;

    await app.parse(['node', 'test', 'test', 'val1', '-l', '-l', '--port', '-h', 'host', '--protocol', 'http', '--protocol', 'https']);

    expect(errors.shift()).to.equal(`Option --logs cannot be provided more than once!`);
    expect(errors).to.be.empty;

    await app.parse(['node', 'test', 'test', 'val1', '-l', '--port', '-h', 'host', '--protocol', 'http', '--protocol', 'https']);

    expect(errors).to.be.empty;

  });

  it('should run actions correctly', async function() {

    const app = new ArgumentalApp();
    const flags: string[] = [];

    await app
    .global
    .action(() => {
      flags.push('GLOB1');
    })
    .command('test')
    .action(() => {
      flags.push('DIR1');
    })
    .action(() => {
      flags.push('DIR2');
    })
    .global
    .action(() => {
      flags.push('GLOB2');
    })
    .parse(['node', 'test', 'test']);

    expect(flags).to.deep.equal(['GLOB1', 'DIR1', 'DIR2', 'GLOB2']);

  });

  it('should run argument validators correctly', async function() {

    const app = new ArgumentalApp();
    const converted: any[] = [];

    // Capture error messages
    let errors: string[] = [];

    (<any>app)._log.error = (...messages: Array<string|Error>) => {

      errors = errors.concat(messages.map(message => message instanceof Error ? message.message : message));

    };

    app
    .command('convert')
    .argument('<amount>', 'The money amount in dollars (e.g. $100)', [
      /^\$\d+$/,
      (value: string) => {

        const num = +value.match(/^\$(\d+)$/)[1];

        if ( num === 0 ) throw new Error('Cannot convert $0!');

        converted.push(num);

        return num;

      }
    ]);

    await app.parse(['node', 'test', 'convert', '$135']);

    expect(converted.shift()).to.equal(135);
    expect(converted).to.be.empty;

    await app.parse(['node', 'test', 'convert', '$0']);

    expect(errors.shift()).to.equal('Cannot convert $0!');
    expect(errors).to.be.empty;
    expect(converted).to.be.empty;

    await app.parse(['node', 'test', 'convert', '304']);

    expect(errors.shift()).to.equal('Invalid value for argument amount!');
    expect(errors).to.be.empty;
    expect(converted).to.be.empty;

  });

  it('should run option validators correctly', async function() {

    const app = new ArgumentalApp();
    const values: any[] = [];

    // Capture error messages
    let errors: string[] = [];

    (<any>app)._log.error = (...messages: Array<string|Error>) => {

      errors = errors.concat(messages.map(message => message instanceof Error ? message.message : message));

    };

    app
    .command('test')
    .option('-p --port <port_number>', null, false, [
      validators.NUMBER,
      value => {values.push(value)}
    ])
    .option('--logs [level]', null, false, [
      /verbose|silent/i,
      value => value.toUpperCase(),
      value => {values.push(value)}
    ])
    .option('-n <num>', null, true, [
      validators.NUMBER,
      (value, name, arg, cmd) => {
        if ( value > 100 ) throw new Error(`Invalid number ${value} for ${arg ? 'argument' : 'option'} ${name} of command ${cmd}!`);
      },
      value => {values.push(value)}
    ]);

    await app.parse(['node', 'test', 'test', '-n', '50', '-p', 'port']);

    expect(errors.shift()).to.equal('Invalid value for option port!\n   Value must be a number.');
    expect(errors).to.be.empty;
    expect(values).to.be.empty;

    await app.parse(['node', 'test', 'test', '-n', '200']);

    expect(errors.shift()).to.equal('Invalid number 200 for option n of command test!');
    expect(errors).to.be.empty;
    expect(values).to.be.empty;

    await app.parse(['node', 'test', 'test', '-n', '50', '-p', '5001', '--logs']);

    expect(errors).to.be.empty;
    expect(values.shift()).to.equal(5001);
    expect(values.shift()).to.equal(50);
    expect(values).to.be.empty;

    let actionArgs: any[] = [];
    app.action((...args) => {actionArgs = [...args]});

    await app.parse(['node', 'test', 'test', '-n', '50', '--logs', 'silent']);

    expect(actionArgs[0]).to.deep.equal({});
    expect(actionArgs[1]).to.deep.equal({
      n: 50,
      logs: 'SILENT',
      p: undefined,
      port: undefined
    });
    expect(actionArgs[2]).to.equal('test');

  });

  it('should apply defaults correctly', async function() {

    const app = new ArgumentalApp();
    let args: any, opts: any;

    await app
    .version('1.0.2')
    .option('--kir')
    .argument('<ehem>')
    .command('test')
    .argument('<arg1>', null, validators.BOOLEAN, true)
    .argument('[arg2]', null, null, 'def2')
    .argument('[arg3]', null, null, 'def3')
    .option('-l', null, false, null, false, true)
    .option('--log [level]', null, false, null, false, 'silent')
    .option('--error [code]', null, true, validators.NUMBER, true, 0)
    .action((a, o) => {
      args = a;
      opts = o;
    })
    .parse(['node', 'test', 'test', 'false', 'provided', '--log', 'verbose', '--error', '--error', '1']);

    expect(args).to.deep.equal({
      arg1: false,
      arg2: 'provided',
      arg3: 'def3'
    });

    expect(opts).to.deep.equal({
      l: false,
      log: 'verbose',
      error: [0, 1]
    });

  });

  it('should define top-level properties correctly', async function() {

    const app = new ArgumentalApp();
    const flags: string[] = [];

    // Capture error messages
    let errors: string[] = [];

    (<any>app)._log.error = (...messages: Array<string|Error>) => {

      errors = errors.concat(messages.map(message => message instanceof Error ? message.message : message));

    };

    app
    .option('-v --version')
    .action((args, opts, cmd, suspend) => {

      if ( opts.version ) {

        flags.push('VERSION');
        suspend();

      }

    })
    .action((args, opts, cmd, suspend) => {

      if ( opts.test ) {

        flags.push('TEST');
        suspend();

      }

    })
    .action(() => {

      flags.push('LAST');

    })
    .global
    .argument('<arg1>')
    .top
    .option('-t --test <arg>');

    await app.parse(['node', 'test', '--version']);

    expect(errors).to.be.empty;
    expect(flags.shift()).to.equal('VERSION');
    expect(flags).to.be.empty;

    await app.parse(['node', 'test', '--test', 'blah']);

    expect(errors).to.be.empty;
    expect(flags.shift()).to.equal('TEST');
    expect(flags).to.be.empty;

    await app.parse(['node', 'test']);

    expect(errors).to.be.empty;
    expect(flags.shift()).to.equal('LAST');
    expect(flags).to.be.empty;

    await app.parse(['node', 'test', 'anything']);

    expect(errors.shift()).to.equal('Unknown command!');
    expect(errors).to.be.empty;

  });

});
