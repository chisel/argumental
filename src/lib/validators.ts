import fs from 'fs';
import path from 'path';
import { Argumental } from '../types';

export class BuiltInValidators {

  /** Checks if the value is string (cannot be converted into a number or boolean). */
  STRING: Argumental.Validator = (value, name, arg) => {

    if ( typeof value !== 'string' || ['true', 'false'].includes(value.trim().toLowerCase()) || value.trim().match(/^\d+$/) )
      throw new Error(`Invalid value for ${arg ? 'argument' : 'option'} ${name}!\n   Value must be string.`);

  };

  /** Checks if the value is number or can be converted to number. Casts the value to number if passed. */
  NUMBER: Argumental.Validator = (value, name, arg) => {

    if ( (typeof value !== 'number' && typeof value !== 'string') || (typeof value === 'string' && ! value.trim().match(/^\d+$/)) )
      throw new Error(`Invalid value for ${arg ? 'argument' : 'option'} ${name}!\n   Value must be a number.`);

    return typeof value === 'string' ? +(<string>value).trim() : value;

  };

  /** Checks if the value is boolean or can be converted to boolean (accepts 'true' and 'false' for conversion). Casts the value to boolean if passed. */
  BOOLEAN: Argumental.Validator = (value, name, arg) => {

    if ( (typeof value !== 'boolean' && typeof value !== 'string') || (typeof value === 'string' && ! ['true', 'false'].includes(value.toLowerCase().trim())) )
      throw new Error(`Invalid value for ${arg ? 'argument' : 'option'} ${name}!\n   Value must be boolean.`);

    return typeof value === 'string' ? ((<string>value).toLowerCase().trim() === 'true') : value;

  };

  /** Checks if all values of the array are strings (cannot be converted into numbers or booleans). */
  STRINGS: Argumental.Validator = (value, name, arg) => {

    const errorMessage = `Invalid value for ${arg ? 'argument' : 'option'} ${name}!\n   Value must be multiple strings.`;

    if ( ! value || typeof value !== 'object' || value.constructor !== Array )
      throw new Error(errorMessage);

    for ( const v of value ) {

      if ( typeof v !== 'string' || ['true', 'false'].includes(v.trim().toLowerCase()) || v.trim().match(/^\d+$/) )
        throw new Error(errorMessage);

    }

  };

  /** Checks if all values of the array are numbers or can be converted to number. Casts all values to number if passed. */
  NUMBERS: Argumental.Validator = (value, name, arg) => {

    const errorMessage = `Invalid value for ${arg ? 'argument' : 'option'} ${name}!\n   Value must be multiple numbers.`;

    if ( ! value || typeof value !== 'object' || value.constructor !== Array )
      throw new Error(errorMessage);

    for ( const v of value ) {

      if ( (typeof v !== 'number' && typeof v !== 'string') || (typeof v === 'string' && ! v.trim().match(/^\d+$/)) )
        throw new Error(errorMessage);

    }

    return value.map(v => typeof v === 'string' ? +(<string>v).trim() : v);

  };

  /** Checks if all values of the array are booleans or can be converted to booleans (accepts 'true' and 'false' for conversion). Casts all values to boolean if passed. */
  BOOLEANS: Argumental.Validator = (value, name, arg) => {

    const errorMessage = `Invalid value for ${arg ? 'argument' : 'option'} ${name}!\n   Value must be multiple booleans.`;

    if ( ! value || typeof value !== 'object' || value.constructor !== Array )
      throw new Error(errorMessage);

    for ( const v of value ) {

      if ( (typeof v !== 'boolean' && typeof v !== 'string') || (typeof v === 'string' && ! ['true', 'false'].includes(v.toLowerCase().trim())) )
        throw new Error(errorMessage);

    }

    return value.map(v => typeof v === 'string' ? ((<string>v).toLowerCase().trim() === 'true') : v);

  };

  /** Checks if the value is a valid file path and the file exists and can be read (absolute or relative to current working directory). */
  FILE_PATH: Argumental.Validator = (value, name, arg) => {

    try {

      fs.accessSync(path.resolve(process.cwd(), value), fs.constants.F_OK | fs.constants.R_OK);

    }
    catch (error) {

      throw new Error(`Invalid file path for ${arg ? 'argument' : 'option'} ${name}!\n   ${error.code === 'ENOENT' ? 'File doesn\'t exist' : 'File cannot be read'}.`);

    }

  };

}
