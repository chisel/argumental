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
    expect(validators.NUMBER('14.99', 'castable string', true, 'command', null)).to.equal(14.99);

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

  it('should validate array of strings', function() {

    expect(validators.STRINGS(['s','tring'], 'correct value', true, 'command', null)).to.be.undefined;

    let validationError: Error = null;

    try {

      validators.STRINGS(0, 'incorrect value', false, 'command', null);

    }
    catch (error) {

      validationError = error;

    }

    expect(validationError).to.not.equal(null);
    expect(validationError.message).to.equal('Invalid value for option incorrect value!\n   Value must be multiple strings.');

    validationError = null;

    try {

      validators.STRINGS([false, 'string'], 'incorrect value', false, 'command', null);

    }
    catch (error) {

      validationError = error;

    }

    expect(validationError).to.not.equal(null);
    expect(validationError.message).to.equal('Invalid value for option incorrect value!\n   Value must be multiple strings.');

  });

  it('should validate array of numbers', function() {

    expect(validators.NUMBERS(['23',1, 14.99], 'correct value', true, 'command', null)).to.deep.equal([23, 1, 14.99]);

    let validationError: Error = null;

    try {

      validators.NUMBERS(13, 'incorrect value', false, 'command', null);

    }
    catch (error) {

      validationError = error;

    }

    expect(validationError).to.not.equal(null);
    expect(validationError.message).to.equal('Invalid value for option incorrect value!\n   Value must be multiple numbers.');

    validationError = null;

    try {

      validators.NUMBERS([100, '$1'], 'incorrect value', false, 'command', null);

    }
    catch (error) {

      validationError = error;

    }

    expect(validationError).to.not.equal(null);
    expect(validationError.message).to.equal('Invalid value for option incorrect value!\n   Value must be multiple numbers.');

  });

  it('should validate array of booleans', function() {

    expect(validators.BOOLEANS(['false','true', true], 'correct value', true, 'command', null)).to.deep.equal([false, true, true]);

    let validationError: Error = null;

    try {

      validators.BOOLEANS(true, 'incorrect value', false, 'command', null);

    }
    catch (error) {

      validationError = error;

    }

    expect(validationError).to.not.equal(null);
    expect(validationError.message).to.equal('Invalid value for option incorrect value!\n   Value must be multiple booleans.');

    validationError = null;

    try {

      validators.BOOLEANS([false, 'string'], 'incorrect value', false, 'command', null);

    }
    catch (error) {

      validationError = error;

    }

    expect(validationError).to.not.equal(null);
    expect(validationError.message).to.equal('Invalid value for option incorrect value!\n   Value must be multiple booleans.');

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
