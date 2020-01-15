import { expect } from 'chai';
import { BuiltInValidators } from '../../dist/lib/validators';

describe('Validators', function() {

  const validators = new BuiltInValidators();

  it('should validate strings', function() {

    expect(validators.STRING('string value', 'correct value', true, 'command', null)).to.be.undefined;

    let validationError: Error = null;

    try {

      validators.STRING(true, 'incorrect value', false, 'command', null);

    }
    catch (error) {

      validationError = error;

    }

    expect(validationError).to.not.equal(null);
    expect(validationError.message).to.equal('Invalid value for option incorrect value!\n   Value must be string.');

  });

  it('should validate numbers', function() {

    expect(validators.NUMBER(1000, 'correct value', false, 'command', null)).to.equal(1000);
    expect(validators.NUMBER('2000', 'castable string', true, 'command', null)).to.equal(2000);

    let validationError: Error = null;

    try {

      validators.NUMBER('80s', 'incorrect value', true, 'command', null);

    }
    catch (error) {

      validationError = error;

    }

    expect(validationError).to.not.equal(null);
    expect(validationError.message).to.equal('Invalid value for argument incorrect value!\n   Value must be a number.');

  });

  it('should validate booleans', function() {

    expect(validators.BOOLEAN(false, 'correct value', true, 'command', null)).to.equal(false);
    expect(validators.BOOLEAN('true', 'castable boolean', false, 'command', null)).to.equal(true);

    let validationError: Error = null;

    try {

      validators.BOOLEAN(0, 'incorrect value', false, 'command', null);

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
      validators.FILE_PATH('package.json', 'file', true, 'command', null);

    }
    catch (error) {

      validationError = error;

    }

    expect(validationError).to.be.null;

    try {

      validationError = null;
      validators.FILE_PATH('this-file-should-not-exist.json', 'file', true, 'command', null);

    }
    catch (error) {

      validationError = error;

    }

    expect(validationError).not.to.be.null;
    expect(validationError.message).to.equal(`Invalid file path for argument file!\n   File doesn't exist.`);

  });

});
