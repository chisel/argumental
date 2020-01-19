import app from '../../..';
import path from 'path';
import fs from 'fs';

export function batchExists(name: string): void {

  if ( ! app.data<AppData>().config.hasOwnProperty(name) )
    throw new Error(`Batch "${name}" not found!`);

}

export function batchDoesNotExist(name: string): void {

  if ( app.data<AppData>().config.hasOwnProperty(name) )
    throw new Error(`Batch "${name}" already exists!`);

}

export function batchDoesNotExistStr(name: string): boolean|string {

  if ( app.data<AppData>().config.hasOwnProperty(name) )
    return `Batch "${name}" already exists!`;

  return true;

}

export function fileDoesNotExist(filename: string): void {

  if ( fs.existsSync(path.resolve(process.cwd(), filename)) )
    throw new Error(`File ${path.resolve(process.cwd(), filename)} already exists!`);

}
