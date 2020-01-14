import { expect } from 'chai';
import { BuiltInValidators } from '../../dist/lib/validators';

describe('Validators', function() {

  const validators = new BuiltInValidators();

  it('should validate strings', function() {

    expect(validators.STRING({ value: 'string value', name: 'correct value', arg: true, cmd: 'command', suspend: null })).to.be.undefined;

    let validationError: Error = null;

    try {

      validators.STRING({ value: true, name: 'incorrect value', arg: false, cmd: 'command', suspend: null });

    }
    catch (error) {

      validationError = error;

    }

    expect(validationError).to.not.equal(null);
    expect(validationError.message).to.equal('Invalid value for option incorrect value!\n   Value must be string.');

  });

  it('should validate numbers', function() {

    expect(validators.NUMBER({ value: 1000, name: 'correct value', arg: false, cmd: 'command', suspend: null })).to.equal(1000);
    expect(validators.NUMBER({ value: '2000', name: 'castable string', arg: true, cmd: 'command', suspend: null })).to.equal(2000);

    let validationError: Error = null;

    try {

      validators.NUMBER({ value: '80s', name: 'incorrect value', arg: true, cmd: 'command', suspend: null} );

    }
    catch (error) {

      validationError = error;

    }

    expect(validationError).to.not.equal(null);
    expect(validationError.message).to.equal('Invalid value for argument incorrect value!\n   Value must be a number.');

  });

  it('should validate booleans', function() {

    expect(validators.BOOLEAN({ value: false, name: 'correct value', arg: true, cmd: 'command', suspend: null })).to.equal(false);
    expect(validators.BOOLEAN({ value: 'true', name: 'castable boolean', arg: false, cmd: 'command', suspend: null })).to.equal(true);

    let validationError: Error = null;

    try {

      validators.BOOLEAN({ value: 0, name: 'incorrect value', arg: false, cmd: 'command', suspend: null });

    }
    catch (error) {

      validationError = error;

    }

    expect(validationError).to.not.equal(null);
    expect(validationError.message).to.equal('Invalid value for option incorrect value!\n   Value must be boolean.');

  });

  it('should validate file paths', function() {

    let validationError: Error = null;

    try {

      validationError = null;
      validators.FILE_PATH({ value: 'package.json', name: 'file', arg: true, cmd: 'command', suspend: null });

    }
    catch (error) {

      validationError = error;

    }

    expect(validationError).to.be.null;

    try {

      validationError = null;
      validators.FILE_PATH({ value: 'this-file-should-not-exist.json', name: 'file', arg: true, cmd: 'command', suspend: null });

    }
    catch (error) {

      validationError = error;

    }

    expect(validationError).not.to.be.null;
    expect(validationError.message).to.equal(`Invalid file path for argument file!\n   File doesn't exist.`);

  });

});
