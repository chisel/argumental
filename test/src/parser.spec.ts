import { expect } from 'chai';
import { Parser } from '../../dist/lib/parser';
import { BuiltInValidators } from '../../dist/lib/validators';
import { Argumental } from '../../dist/types';

describe('Parser', function() {

  const parser = new Parser();
  const validators = new BuiltInValidators();

  it('should parse arguments correctly', function() {

    expect(parser.parseArgument('[file_path]', true, validators.STRING)).to.deep.equal({
      name: 'file_path',
      apiName: 'filePath',
      required: false,
      validators: [{ callback: validators.STRING, destructuringParams: false }],
      default: undefined,
      rest: false
    });

    expect(parser.parseArgument('<file-path>', true, validators.STRING, 'package.json')).to.deep.equal({
      name: 'file-path',
      apiName: 'filePath',
      required: true,
      validators: [{ callback: validators.STRING, destructuringParams: false }],
      default: 'package.json',
      rest: false
    });

    expect(parser.parseArgument('<relative_file_path>', true, null, 100)).to.deep.equal({
      name: 'relative_file_path',
      apiName: 'relativeFilePath',
      required: true,
      validators: [],
      default: 100,
      rest: false
    });

    expect(parser.parseArgument('<...relative_file_path>', true, null, 100)).to.deep.equal({
      name: 'relative_file_path',
      apiName: 'relativeFilePath',
      required: true,
      validators: [],
      default: 100,
      rest: true
    });

    expect(parser.parseArgument('[...relative_file_path]', true, null, 100)).to.deep.equal({
      name: 'relative_file_path',
      apiName: 'relativeFilePath',
      required: false,
      validators: [],
      default: 100,
      rest: true
    });

  });

  it('should fail to parse invalid arguments', function() {

    let parsingError: Error = null;

    try {

      parsingError = null;
      parser.parseArgument('<invalid]', true);

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Argument <invalid] has invalid syntax or contains invalid characters!`);

    try {

      parsingError = null;
      parser.parseArgument('invalid', true);

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Argument invalid has invalid syntax or contains invalid characters!`);

    try {

      parsingError = null;
      parser.parseArgument('<invalid__argument>', true);

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Argument invalid__argument has invalid name!`);

    try {

      parsingError = null;
      parser.parseArgument('<--invalid-argument>', true);

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Argument --invalid-argument has invalid name!`);

    try {

      parsingError = null;
      parser.parseArgument('[invalid__]', true);

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Argument invalid__ has invalid name!`);

  });

  it('should parse options correctly', function() {

    expect(parser.parseOption('-p --port <port_number>', 'desc', false, null, false, undefined, true)).to.deep.equal({
      shortName: 'p',
      longName: 'port',
      apiName: 'port',
      description: 'desc',
      required: false,
      multi: false,
      immediate: true,
      argument: {
        name: 'port_number',
        apiName: 'portNumber',
        required: true,
        validators: [],
        default: undefined
      }
    });

    expect(parser.parseOption('--port -p <port_number>', 'desc', false)).to.deep.equal({
      shortName: 'p',
      longName: 'port',
      apiName: 'port',
      description: 'desc',
      required: false,
      multi: false,
      immediate: false,
      argument: {
        name: 'port_number',
        apiName: 'portNumber',
        required: true,
        validators: [],
        default: undefined
      }
    });

    expect(parser.parseOption('--port -p', 'desc', false)).to.deep.equal({
      shortName: 'p',
      longName: 'port',
      apiName: 'port',
      description: 'desc',
      required: false,
      multi: false,
      immediate: false,
      argument: null
    });

    expect(parser.parseOption('-p --port', 'desc', false)).to.deep.equal({
      shortName: 'p',
      longName: 'port',
      apiName: 'port',
      description: 'desc',
      required: false,
      multi: false,
      immediate: false,
      argument: null
    });

    expect(parser.parseOption('-P --portNumber', 'desc', false)).to.deep.equal({
      shortName: 'P',
      longName: 'portNumber',
      apiName: 'portNumber',
      description: 'desc',
      required: false,
      multi: false,
      immediate: false,
      argument: null
    });

    expect(parser.parseOption('-p [port_number]', 'desc', false)).to.deep.equal({
      shortName: 'p',
      longName: null,
      apiName: null,
      description: 'desc',
      required: false,
      multi: false,
      immediate: false,
      argument: {
        name: 'port_number',
        apiName: 'portNumber',
        required: false,
        validators: [],
        default: undefined
      }
    });

    expect(parser.parseOption('--port [port_number]', 'desc', false)).to.deep.equal({
      shortName: null,
      longName: 'port',
      apiName: 'port',
      description: 'desc',
      required: false,
      multi: false,
      immediate: false,
      argument: {
        name: 'port_number',
        apiName: 'portNumber',
        required: false,
        validators: [],
        default: undefined
      }
    });

    expect(parser.parseOption('--port', 'desc', false)).to.deep.equal({
      shortName: null,
      longName: 'port',
      apiName: 'port',
      description: 'desc',
      required: false,
      multi: false,
      immediate: false,
      argument: null
    });

    expect(parser.parseOption('--port-p', 'desc', false)).to.deep.equal({
      shortName: null,
      longName: 'port-p',
      apiName: 'portP',
      description: 'desc',
      required: false,
      multi: false,
      immediate: false,
      argument: null
    });

    expect(parser.parseOption('-p', 'desc', false)).to.deep.equal({
      shortName: 'p',
      longName: null,
      apiName: null,
      description: 'desc',
      required: false,
      multi: false,
      immediate: false,
      argument: null
    });

  });

  it('should fail to parse invalid options', function() {

    let parsingError: Error = null;

    try {

      parsingError = null;
      parser.parseOption('port');

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option port has invalid syntax or contains invalid characters!`);

    try {

      parsingError = null;
      parser.parseOption('p');

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option p has invalid syntax or contains invalid characters!`);

    try {

      parsingError = null;
      parser.parseOption('port <argument>');

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option port <argument> has invalid syntax or contains invalid characters!`);

    try {

      parsingError = null;
      parser.parseOption('--port_number');

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option --port_number has invalid syntax or contains invalid characters!`);

    try {

      parsingError = null;
      parser.parseOption('--port_ -p [argument]');

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option --port_ -p [argument] has invalid syntax or contains invalid characters!`);

    try {

      parsingError = null;
      parser.parseOption('-p --p');

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option -p --p has invalid syntax or contains invalid characters!`);

    try {

      parsingError = null;
      parser.parseOption('[argument] -p --port');

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option [argument] -p --port has invalid syntax or contains invalid characters!`);

    try {

      parsingError = null;
      parser.parseOption('-p [argument] --port');

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option -p [argument] --port has invalid syntax or contains invalid characters!`);

    try {

      parsingError = null;
      parser.parseOption('-p--port [p]');

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option -p--port [p] has invalid syntax or contains invalid characters!`);

    try {

      parsingError = null;
      parser.parseOption('-port [p]');

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option -port [p] has invalid syntax or contains invalid characters!`);

    try {

      parsingError = null;
      parser.parseOption('-p--port');

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option -p--port has invalid syntax or contains invalid characters!`);

    try {

      parsingError = null;
      parser.parseOption('---port');

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option ---port has invalid syntax or contains invalid characters!`);

    try {

      parsingError = null;
      parser.parseOption('--port [...nums]');

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option --port [...nums] has invalid syntax or contains invalid characters!`);

    try {

      parsingError = null;
      parser.parseOption('--port <...nums>');

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option --port <...nums> has invalid syntax or contains invalid characters!`);

  });

  it('should parse cli arguments correctly', function() {

    const commands: Argumental.List<Argumental.CommandDeclaration> = {
      'new script': {
        name: 'new script',
        description: null,
        aliases: ['ns'],
        arguments: [
          {
            name: 'script_type',
            apiName: 'scriptType',
            required: true,
            description: null,
            validators: [],
            default: undefined,
            rest: false
          },
          {
            name: 'script_name',
            apiName: 'scriptName',
            required: true,
            description: null,
            validators: [],
            default: undefined,
            rest: false
          }
        ],
        options: [
          {
            shortName: null,
            longName: 'skip-compilation',
            apiName: 'skipCompilation',
            required: false,
            argument: null,
            description: null,
            multi: false,
            immediate: false
          },
          {
            shortName: 'd',
            longName: null,
            apiName: null,
            required: false,
            argument: null,
            description: null,
            multi: false,
            immediate: false
          },
          {
            shortName: 's',
            longName: null,
            apiName: null,
            required: false,
            argument: null,
            description: null,
            multi: false,
            immediate: false
          },
          {
            shortName: 'c',
            longName: 'copy-to',
            apiName: 'copyTo',
            required: true,
            multi: false,
            argument: {
              name: 'destination',
              apiName: 'destination',
              required: true,
              validators: [],
              default: undefined
            },
            description: null,
            immediate: false
          },
          {
            shortName: 'p',
            longName: null,
            apiName: null,
            required: true,
            multi: false,
            argument: {
              name: 'port_number',
              apiName: 'portNumber',
              required: true,
              validators: [],
              default: undefined
            },
            description: null,
            immediate: false
          },
          {
            shortName: 'x',
            longName: null,
            apiName: null,
            required: true,
            multi: false,
            argument: {
              name: 'port_number',
              apiName: 'portNumber',
              required: true,
              validators: [],
              default: undefined
            },
            description: null,
            immediate: false
          },
          {
            shortName: 'f',
            longName: 'force',
            apiName: 'force',
            required: true,
            multi: false,
            argument: null,
            description: null,
            immediate: false
          },
          {
            shortName: 'a',
            longName: 'abort',
            apiName: 'abort',
            required: true,
            multi: false,
            argument: {
              name: 'code',
              apiName: 'code',
              required: true,
              validators: [],
              default: undefined
            },
            description: null,
            immediate: false
          },
          {
            shortName: 'b',
            longName: 'bail',
            apiName: 'bail',
            required: true,
            multi: false,
            argument: {
              name: 'code',
              apiName: 'code',
              required: true,
              validators: [],
              default: undefined
            },
            description: null,
            immediate: false
          }
        ],
        actions: [],
        order: 1,
        events: { 'validators:before': [], 'validators:after': [], 'defaults:before': [], 'defaults:after': [], 'actions:before': [], 'actions:after': [] }
      }
    };

    let args = parser.parseCliArguments(['new', 'script', 'some-script.proc.ts', '-ds', '-sc', 'somewhere', '-c', 'here', '--copy-to', 'there', '-x', '-a', '2', '--bail', '0', '-b', '0'], commands);

    expect(args).to.deep.equal({
      cmd: 'new script',
      args: {
        scriptType: 'some-script.proc.ts',
        scriptName: null
      },
      opts: {
        skipCompilation: false,
        d: true,
        s: true,
        c: ['somewhere', 'here', 'there'],
        copyTo: ['somewhere', 'here', 'there'],
        p: undefined,
        x: null,
        f: false,
        force: false,
        a: '2',
        abort: '2',
        b: ['0', '0'],
        bail: ['0', '0']
      }
    });

    args = parser.parseCliArguments(['ns', 'ts', '-a', '0', 'some-script.proc.ts', '-df', '-x', '""', '--abort', '1', '--abort', '-a', '"error code"'], commands);

    expect(args).to.deep.equal({
      cmd: 'new script',
      args: {
        scriptType: 'ts',
        scriptName: 'some-script.proc.ts'
      },
      opts: {
        skipCompilation: false,
        d: true,
        s: false,
        c: undefined,
        copyTo: undefined,
        p: undefined,
        x: '',
        f: true,
        force: true,
        a: ['0', '1', null, 'error code'],
        abort: ['0', '1', null, 'error code'],
        b: undefined,
        bail: undefined
      }
    });

  });

  it('should fail to parse invalid cli arguments', function() {

    const commands: Argumental.List<Argumental.CommandDeclaration> = {
      '': {
        name: '',
        description: null,
        aliases: [],
        options: [],
        arguments: [],
        actions: [],
        original: true,
        order: 0,
        events: { 'validators:before': [], 'validators:after': [], 'defaults:before': [], 'defaults:after': [], 'actions:before': [], 'actions:after': [] }
      },
      'new script': {
        name: 'new script',
        description: null,
        aliases: ['ns'],
        arguments: [
          {
            name: 'script_type',
            apiName: 'scriptType',
            required: true,
            description: null,
            validators: [],
            default: undefined,
            rest: false
          },
          {
            name: 'script_name',
            apiName: 'scriptName',
            required: true,
            description: null,
            validators: [],
            default: undefined,
            rest: false
          }
        ],
        options: [
          {
            shortName: null,
            longName: 'skip-compilation',
            apiName: 'skipCompilation',
            required: false,
            argument: null,
            description: null,
            multi: false,
            immediate: false
          }
        ],
        actions: [],
        order: 1,
        events: { 'validators:before': [], 'validators:after': [], 'defaults:before': [], 'defaults:after': [], 'actions:before': [], 'actions:after': [] }
      }
    };

    let args = parser.parseCliArguments(['s', 'ts'], commands);

    expect(args instanceof Error).to.be.true;
    expect((<Error>args).message).to.equal('Unknown command!');

    args = parser.parseCliArguments(['ns', 'ts', 'sd', 'dd', '--skip-compilation'], commands);

    expect(args instanceof Error).to.be.true;
    expect((<Error>args).message).to.equal('Expected 2 arguments but got 3!');

    args = parser.parseCliArguments(['ns', 'ts', 'sd', '--blah'], commands);

    expect(args instanceof Error).to.be.true;
    expect((<Error>args).message).to.equal('Unknown option blah!');

  });

});
