import { expect } from 'chai';
import { BuiltInValidators } from '../../bin/lib/validators';

describe('Validators', function() {

  const validators = new BuiltInValidators();

  it('should validate strings', function() {

    expect(validators.STRING('string value', true, 'correct value', 'command')).to.be.undefined;

    let validationError: Error = null;

    try {

      validators.STRING(true, false, 'incorrect value', 'command')

    }
    catch (error) {

      validationError = error;

    }

    expect(validationError).to.not.equal(null);
    expect(validationError.message).to.equal('Invalid value for option incorrect value!\n   Value must be string.');

  });

  it('should validate numbers', function() {

    expect(validators.NUMBER(1000, false, 'correct value', 'command')).to.equal(1000);
    expect(validators.NUMBER('2000', true, 'castable string', 'comman d')).to.equal(2000);

    let validationError: Error = null;

    try {

      validators.NUMBER('80s', true, 'incorrect value', 'command');

    }
    catch (error) {

      validationError = error;

    }

    expect(validationError).to.not.equal(null);
    expect(validationError.message).to.equal('Invalid value for argument incorrect value!\n   Value must be a number.');

  });

  it('should validate booleans', function() {

    expect(validators.BOOLEAN(false, true, 'correct value', 'command')).to.equal(false);
    expect(validators.BOOLEAN('true', false, 'castable boolean', 'command')).to.equal(true);

    let validationError: Error = null;

    try {

      validators.BOOLEAN(0, false, 'incorrect value', 'command');

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
      validators.FILE_PATH('package.json', true, 'file', 'command');

    }
    catch (error) {

      validationError = error;

    }

    expect(validationError).to.be.null;

    try {

      validationError = null;
      validators.FILE_PATH('this-file-should-not-exist.json', true, 'file', 'command');

    }
    catch (error) {

      validationError = error;

    }

    expect(validationError).not.to.be.null;
    expect(validationError.message).to.equal(`Invalid file path for argument file!\n   File doesn't exist.`);

  });

});
