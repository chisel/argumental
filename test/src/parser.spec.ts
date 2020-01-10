import { expect } from 'chai';
import { Parser } from '../../bin/lib/parser';
import { BuiltInValidators } from '../../bin/lib/validators';

describe('Parser', function() {

  const parser = new Parser();
  const validators = new BuiltInValidators();

  it('should parse arguments correctly', function() {

    expect(parser.parseArgument('[file_path]', validators.STRING)).to.deep.equal({
      name: 'file_path',
      apiName: 'filePath',
      required: false,
      validators: [validators.STRING],
      default: undefined
    });

    expect(parser.parseArgument('<file-path>', validators.STRING, 'package.json')).to.deep.equal({
      name: 'file-path',
      apiName: 'filePath',
      required: true,
      validators: [validators.STRING],
      default: 'package.json'
    });

    expect(parser.parseArgument('<relative_file_path>', null, 100)).to.deep.equal({
      name: 'relative_file_path',
      apiName: 'relativeFilePath',
      required: true,
      validators: [],
      default: 100
    });

  });

  it('should fail to parse invalid arguments', function() {

    let parsingError: Error = null;

    try {

      parsingError = null;
      parser.parseArgument('<invalid]');

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Argument <invalid] has invalid syntax or contains invalid characters!`);

    try {

      parsingError = null;
      parser.parseArgument('invalid');

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Argument invalid has invalid syntax or contains invalid characters!`);

    try {

      parsingError = null;
      parser.parseArgument('<invalid__argument>');

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Argument invalid__argument has invalid name!`);

    try {

      parsingError = null;
      parser.parseArgument('<--invalid-argument>');

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Argument --invalid-argument has invalid name!`);

    try {

      parsingError = null;
      parser.parseArgument('[invalid__]');

    }
    catch (error) {

      parsingError = error;

    }

    expect(parsingError).not.to.be.null;
    expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Argument invalid__ has invalid name!`);

  });

  it('should parse options correctly', function() {

    expect(parser.parseOption('-p --port <port_number>', 'desc', false)).to.deep.equal({
      shortName: 'p',
      longName: 'port',
      apiName: 'port',
      description: 'desc',
      required: false,
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
      argument: null
    });

    expect(parser.parseOption('-p --port', 'desc', false)).to.deep.equal({
      shortName: 'p',
      longName: 'port',
      apiName: 'port',
      description: 'desc',
      required: false,
      argument: null
    });

    expect(parser.parseOption('-P --portNumber', 'desc', false)).to.deep.equal({
      shortName: 'P',
      longName: 'portNumber',
      apiName: 'portNumber',
      description: 'desc',
      required: false,
      argument: null
    });

    expect(parser.parseOption('-p [port_number]', 'desc', false)).to.deep.equal({
      shortName: 'p',
      longName: null,
      apiName: null,
      description: 'desc',
      required: false,
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
      argument: null
    });

    expect(parser.parseOption('--port-p', 'desc', false)).to.deep.equal({
      shortName: null,
      longName: 'port-p',
      apiName: 'portP',
      description: 'desc',
      required: false,
      argument: null
    });

    expect(parser.parseOption('-p', 'desc', false)).to.deep.equal({
      shortName: 'p',
      longName: null,
      apiName: null,
      description: 'desc',
      required: false,
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

  });

});
