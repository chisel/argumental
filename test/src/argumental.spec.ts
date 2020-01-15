import { expect } from 'chai';
import { ArgumentalApp } from '../../dist/lib/argumental';
import { Argumental } from '../../dist/types';

describe('App', function() {

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
    .argument('<file_path>', 'Relative path to the script file', app.FILE_PATH)
    .option('--override-name -o <script_name>', 'Overrides the script name')
    .option('--overwrite -O', 'Overwrites any scripts with the same type and name', true)
    .option('-c --clean [force]', 'Cleans the scripts directory (if force is true, kills any script processes before cleaning)', false, app.BOOLEAN)
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
    expect(newScriptCommand.actions.length).to.equal(5);

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
        validators: [{ callback: app.FILE_PATH, destructuringParams: false }],
        default: undefined
      }
    ]);

    expect(newScriptCommand.options).to.deep.equal([
      {
        shortName: null,
        longName: 'help',
        apiName: 'help',
        description: 'displays command help',
        required: false,
        multi: false,
        immediate: true,
        argument: null
      },
      {
        shortName: 'l',
        longName: 'log',
        apiName: 'log',
        description: 'Enables logging',
        required: false,
        multi: true,
        immediate: false,
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
        immediate: false,
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
        immediate: false,
        argument: null
      },
      {
        shortName: 'c',
        longName: 'clean',
        apiName: 'clean',
        description: 'Cleans the scripts directory (if force is true, kills any script processes before cleaning)',
        required: false,
        multi: false,
        immediate: false,
        argument: {
          name: 'force',
          apiName: 'force',
          required: false,
          default: undefined,
          validators: [{ callback: app.BOOLEAN, destructuringParams: false }]
        }
      }
    ]);

  });

  it('should report definition errors correctly', async function() {

    let defError: Error;

    try {

      new ArgumentalApp()
      .command('test')
      .command('test');

    }
    catch (error) {

      defError = error;

    }

    expect(defError).not.to.be.undefined;
    expect(defError.message).to.equal('ARGUMENTAL_ERROR: Command test is already defined!');

    try {

      new ArgumentalApp()
      .command('test')
      .argument('<arg1>')
      .argument('<arg1>');

    }
    catch (error) {

      defError = error;

    }

    expect(defError).not.to.be.undefined;
    expect(defError.message).to.equal('ARGUMENTAL_ERROR: Argument arg1 is already defined!');

    try {

      new ArgumentalApp()
      .argument('<arg1>')
      .argument('<arg1>');

    }
    catch (error) {

      defError = error;

    }

    expect(defError).not.to.be.undefined;
    expect(defError.message).to.equal('ARGUMENTAL_ERROR: Argument arg1 is already defined!');

    try {

      new ArgumentalApp()
      .global
      .argument('<arg1>')
      .command('test')
      .argument('<arg1>');

    }
    catch (error) {

      defError = error;

    }

    expect(defError).not.to.be.undefined;
    expect(defError.message).to.equal('ARGUMENTAL_ERROR: Argument arg1 is already defined!');

    try {

      new ArgumentalApp()
      .option('-l')
      .option('-l');

    }
    catch (error) {

      defError = error;

    }

    expect(defError).not.to.be.undefined;
    expect(defError.message).to.equal('ARGUMENTAL_ERROR: Option l is already defined!');

    try {

      new ArgumentalApp()
      .global
      .option('-l')
      .command('test')
      .option('-l');

    }
    catch (error) {

      defError = error;

    }

    expect(defError).not.to.be.undefined;
    expect(defError.message).to.equal('ARGUMENTAL_ERROR: Option l is already defined!');

    try {

      new ArgumentalApp()
      .global
      .alias('s')

    }
    catch (error) {

      defError = error;

    }

    expect(defError).not.to.be.undefined;
    expect(defError.message).to.equal('ARGUMENTAL_ERROR: Cannot define alias globally!');

    try {

      new ArgumentalApp()
      .command('blah')
      .alias('b')
      .command('b')

    }
    catch (error) {

      defError = error;

    }

    expect(defError).not.to.be.undefined;
    expect(defError.message).to.equal('ARGUMENTAL_ERROR: Cannot define command b because it conflicts with a command or alias of the same name!');

    try {

      new ArgumentalApp()
      .command('blah')
      .alias('bla')
      .alias('blah')

    }
    catch (error) {

      defError = error;

    }

    expect(defError).not.to.be.undefined;
    expect(defError.message).to.equal('ARGUMENTAL_ERROR: Cannot define alias blah because it conflicts with a command or alias of the same name!');

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
      (value, name, arg, cmd, suspend) => {

        if ( value === '$13' ) {

          converted.push(value);
          suspend();

        }

      },
      value => {

        const num = +value.match(/^\$(\d+)$/)[1];

        if ( num === 0 ) throw new Error('Cannot convert $0!');

        converted.push(num);

        return num;

      }
    ])
    .argument('[test]', null, value => value === 'throw' ? new Error('Thrown!') : value);

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

    await app.parse(['node', 'test', 'convert', '$13']);

    expect(errors).to.be.empty;
    expect(converted.shift()).to.equal('$13');
    expect(converted).to.be.empty;

    await app.parse(['node', 'test', 'convert', '$12', 'hey']);

    converted.shift();
    expect(errors).to.be.empty;

    await app.parse(['node', 'test', 'convert', '$12', 'throw']);

    converted.shift();
    expect(errors.shift()).to.equal('Thrown!');
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
      app.NUMBER,
      value => {values.push(value)}
    ])
    .option('--logs [level]', null, false, [
      /verbose|silent/i,
      value => value.toUpperCase(),
      value => {values.push(value)}
    ])
    .option('-n <num>', null, true, [
      app.NUMBER,
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

    let actionArgs: Argumental.ActionHandlerParams;
    app.actionDestruct(params => {actionArgs = params});

    await app.parse(['node', 'test', 'test', '-n', '50', '--logs', 'silent']);

    expect(actionArgs.args).to.deep.equal({});
    expect(actionArgs.opts).to.deep.equal({
      help: false,
      n: 50,
      logs: 'SILENT',
      p: undefined,
      port: undefined
    });
    expect(actionArgs.cmd).to.equal('test');

  });

  it('should apply defaults correctly', async function() {

    const app = new ArgumentalApp();
    let _args: any, _opts: any;

    await app
    .version('1.0.2')
    .argument('<ehem>')
    .command('test')
    .argument('<arg1>', null, app.BOOLEAN, true)
    .argument('[arg2]', null, null, 'def2')
    .argument('[arg3]', null, null, 'def3')
    .option('-l', null, false, null, false, true)
    .option('--log [level]', null, false, null, false, 'silent')
    .option('--error [code]', null, true, app.NUMBER, true, 0)
    .option('-r <req_arg>', null, false, null, false, 'def4')
    .option('-s <req_arg>', null, false, null, false, 'def5')
    .action((args, opts) => {
      _args = args;
      _opts = opts;
    })
    .parse(['node', 'test', 'test', 'false', 'provided', '--log', 'verbose', '--error', '--error', '1', '-s', 'b']);

    expect(_args).to.deep.equal({
      arg1: false,
      arg2: 'provided',
      arg3: 'def3'
    });

    expect(_opts).to.deep.equal({
      help: false,
      l: false,
      log: 'verbose',
      error: [0, 1],
      r: 'def4',
      s: 'b'
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
    .config({ topLevelPlainHelp: false })
    .option('-v --version')
    .actionDestruct(({ opts, suspend }) => {

      if ( opts.version ) {

        flags.push('VERSION');
        suspend();

      }

    })
    .actionDestruct(({ opts, suspend }) => {

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

  it('should define app correctly using helper functions', async function() {

    const app = new ArgumentalApp();
    const actionHandler = () => { };
    const sanitizer = value => value.toLowerCase();
    const validator = /ts|js/;

    // Top-level
    app.top
    .description('Top-level description')
    .option('-t [val]')
    .immediate(true)
    .description('Top-level option')
    .required(true)
    .multi(true)
    .default(false)
    .validate(app.BOOLEAN)
    .action(actionHandler);

    // Global declarations
    app.global
    .argument('[script_type]')
    .description('Script type')
    .sanitize(sanitizer)
    .validate(validator)
    .default('ts');

    // Command: test
    app
    .command('test', 'blah')
    .description('Test command')
    .argument('<path>')
    .description('Script path')
    .option('-l')
    .required(true)
    .actionDestruct(actionHandler);

    // Command: test2
    app
    .command('test2')
    .alias('t2')
    .description('Test 2 command')
    .option('-p --port <number>')
    .description('Port')
    .sanitize(app.NUMBER)
    .action(actionHandler);

    const commands = (<any>app)._commands;

    expect(commands['']).to.deep.equal({
      name: '',
      description: 'Top-level description',
      aliases: [],
      options: [
        {
          shortName: null,
          longName: 'help',
          apiName: 'help',
          description: 'displays application help',
          required: false,
          multi: false,
          immediate: true,
          argument: null
        },
        {
          shortName: 't',
          longName: null,
          apiName: null,
          description: 'Top-level option',
          required: true,
          multi: true,
          immediate: true,
          argument: {
            name: 'val',
            apiName: 'val',
            required: false,
            default: false,
            validators: [{ callback: app.BOOLEAN, destructuringParams: false }]
          }
        }
      ],
      arguments: [],
      actions: [(<any>app)._commands[''].actions[0], { callback: actionHandler, destructuringParams: false }]
    });

    expect(commands.test).to.deep.equal({
      name: 'test',
      description: 'Test command',
      aliases: [],
      options: [
        {
          shortName: null,
          longName: 'help',
          apiName: 'help',
          description: 'displays command help',
          required: false,
          multi: false,
          immediate: true,
          argument: null
        },
        {
          shortName: 'l',
          longName: null,
          apiName: null,
          description: null,
          required: true,
          multi: false,
          immediate: false,
          argument: null
        }
      ],
      arguments: [
        {
          name: 'script_type',
          apiName: 'scriptType',
          required: false,
          description: 'Script type',
          default: 'ts',
          validators: [{ callback: sanitizer, destructuringParams: false }, validator]
        },
        {
          name: 'path',
          apiName: 'path',
          required: true,
          description: 'Script path',
          default: undefined,
          validators: []
        }
      ],
      actions: [(<any>app)._commands['test'].actions[0], { callback: actionHandler, destructuringParams: true }]
    });

    expect(commands.test2).to.deep.equal({
      name: 'test2',
      aliases: ['t2'],
      description: 'Test 2 command',
      options: [
        {
          shortName: null,
          longName: 'help',
          apiName: 'help',
          description: 'displays command help',
          required: false,
          multi: false,
          immediate: true,
          argument: null
        },
        {
          shortName: 'p',
          longName: 'port',
          apiName: 'port',
          required: false,
          description: 'Port',
          multi: false,
          immediate: false,
          argument: {
            name: 'number',
            apiName: 'number',
            required: true,
            default: undefined,
            validators: [{ callback: app.NUMBER, destructuringParams: false }]
          }
        }
      ],
      arguments: [
        {
          name: 'script_type',
          apiName: 'scriptType',
          required: false,
          description: 'Script type',
          default: 'ts',
          validators: [{ callback: sanitizer, destructuringParams: false }, validator]
        }
      ],
      actions: [(<any>app)._commands['test2'].actions[0], { callback: actionHandler, destructuringParams: false }]
    });

  });

  it('should set config correctly', async function() {

    const app = new ArgumentalApp();
    let defs: Argumental.List<Argumental.CommandDeclaration>;
    let currentCommand: string;

    await app
    .config({ colors: false, help: (definitions, cmd) => {

      defs = definitions;
      currentCommand = cmd;

    }})
    .option('-p --port')
    .parse(['node', 'test', '--help']);

    expect((<any>app)._log._colors).to.be.false;
    expect(currentCommand).to.equal('');
    expect(defs).to.deep.equal({
      '': {
        name: '',
        description: null,
        aliases: [],
        arguments: [],
        options: [
          {
            shortName: null,
            longName: 'help',
            apiName: 'help',
            description: 'displays application help',
            required: false,
            multi: false,
            immediate: true,
            argument: null
          },
          {
            shortName: 'p',
            longName: 'port',
            apiName: 'port',
            description: null,
            required: false,
            multi: false,
            immediate: false,
            argument: null
          }
        ],
        actions: [(<any>app)._commands[''].actions[0]]
      }
    });

  });

  it('should parse immediate options correctly', async function() {

    const app = new ArgumentalApp();
    let parsed: Argumental.ParsedArguments = null;

    // Capture error messages
    let errors: string[] = [];

    (<any>app)._log.error = (...messages: Array<string|Error>) => {

      errors = errors.concat(messages.map(message => message instanceof Error ? message.message : message));

    };

    app
    .option('-i --im <arg>')
    .validate(app.BOOLEAN)
    .immediate(true)
    .option('-s')
    .required(true)
    .argument('<arg>')
    .action((args, opts, cmd) => { parsed = {args, opts, cmd}; });

    await app.parse(['node', 'test', '-i']);

    expect(errors.shift()).to.equal(`Missing required value for option --im!`);
    expect(errors).to.be.empty;

    await app.parse(['node', 'test', '-i', 'str']);

    expect(errors.shift()).to.equal(`Invalid value for option im!\n   Value must be boolean.`);
    expect(errors).to.be.empty;

    await app.parse(['node', 'test', '-i', 'true']);

    expect(errors).to.be.empty;
    expect(parsed).to.deep.equal({
      cmd: '',
      args: {},
      opts: { i: true, im: true }
    });

  });

});
