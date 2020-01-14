import fs from 'fs';
import path from 'path';
import { Argumental } from '../types';

export class BuiltInValidators {

  /** Checks if the value is string. */
  STRING: Argumental.Validator = ({ value, name, arg }) => {

    if ( typeof value !== 'string' )
      throw new Error(`Invalid value for ${arg ? 'argument' : 'option'} ${name}!\n   Value must be string.`);

  };

  /** Checks if the value is number or can be converted to number. Casts the value to number if passed. */
  NUMBER: Argumental.Validator = ({ value, name, arg }) => {

    if ( (typeof value !== 'number' && typeof value !== 'string') || (typeof value === 'string' && ! value.trim().match(/^\d+$/)) )
      throw new Error(`Invalid value for ${arg ? 'argument' : 'option'} ${name}!\n   Value must be a number.`);

    return typeof value === 'string' ? +(<string>value).trim() : value;

  };

  /** Checks if the value is boolean or can be converted to boolean (accepts 'true' and 'false' for conversion). Casts the value to boolean if passed. */
  BOOLEAN: Argumental.Validator = ({ value, name, arg }) => {

    if ( (typeof value !== 'boolean' && typeof value !== 'string') || (typeof value === 'string' && ! ['true', 'false'].includes(value.toLowerCase().trim())) )
      throw new Error(`Invalid value for ${arg ? 'argument' : 'option'} ${name}!\n   Value must be boolean.`);

    return typeof value === 'string' ? ((<string>value).toLowerCase().trim() === 'true') : value;

  };

  /** Checks if the value is a valid file path and the file exists and can be read (relative to current working directory). */
  FILE_PATH: Argumental.Validator = ({ value, name, arg }) => {

    try {

      fs.accessSync(path.resolve(process.cwd(), value), fs.constants.F_OK | fs.constants.R_OK);

    }
    catch (error) {

      throw new Error(`Invalid file path for ${arg ? 'argument' : 'option'} ${name}!\n   ${error.code === 'ENOENT' ? 'File doesn\'t exist' : 'File cannot be read'}.`);

    }

  };

}
