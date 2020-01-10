import path from 'path';

describe('Argumental', function() {

  // Import tests
  require(path.resolve(__dirname, 'validators.spec.js'));
  require(path.resolve(__dirname, 'parser.spec.js'));
  require(path.resolve(__dirname, 'argumental.spec.js'));

});
