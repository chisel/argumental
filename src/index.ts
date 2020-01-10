import { ArgumentalApp } from './lib/argumental';
import { BuiltInValidators } from './lib/validators';

/**
* Function for applying mixins to a class.
* @param derivedCtor The target class which extends others.
* @param baseCtors An array of mixins to extend the target with.
* @see {@link https://www.typescriptlang.org/docs/handbook/mixins.html#mixin-sample}
*/
function applyMixins(derivedCtor: any, baseCtors: any[]) {

  baseCtors.forEach(baseCtor => {

    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {

      Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));

    });

  });

}

// Extend the ArgumentalApp class with BuildInValidators
applyMixins(ArgumentalApp, [BuiltInValidators]);

// Define typings
namespace Argumental {

  export interface App extends ArgumentalApp, BuiltInValidators { }

}

// Export a new instance of the app and cast its typings
export = <Argumental.App>(new ArgumentalApp());
