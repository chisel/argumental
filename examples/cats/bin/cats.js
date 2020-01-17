#!/usr/bin/env node
const app = require('../../..');
const path = require('path');
const chalk = require('chalk');
const request = require('request-promise-native');
const terminalImage = require('terminal-image');
const API_KEY = '6f2dde9b-63d5-4945-b5d4-8c48e599b03d';
const HOST = 'https://api.thecatapi.com/v1';

app
// Set version from package.json
.version(require(path.resolve(__dirname, '..', 'package.json')).version)

// Command: list
.command('list')
.alias('l')
.description('lists all known cat breeds')

.option('-p --page <page_number>')
.description('page number for pagination')
// Page number must be a valid number
.validate(app.NUMBER)
// Cast into string (since request's query params must be string only)
.sanitize(value => value + '')
.default('0')

.option('-l --limit <limit_count>')
.description('breeds per page')
.validate(app.NUMBER)
.sanitize(value => value + '')
.default('5')

.option('-i --imperial')
.description('displays imperial units')

.actionDestruct(async ({ opts }) => {

  const breeds = await request.get({
    url: HOST + '/breeds',
    qs: {
      page: opts.page,
      limit: opts.limit
    },
    headers: {
      'x-api-key': API_KEY
    },
    json: true
  });

  console.log('');

  for ( const breed of breeds ) {

    if ( breed.name ) console.log(chalk.blueBright('Name:'.padEnd(13)), chalk.bold(breed.name));
    if ( breed.life_span ) console.log(chalk.blueBright('Life Span:'.padEnd(13)), breed.life_span);
    if ( breed.temperament ) console.log(chalk.blueBright('Temperament:'.padEnd(13)), breed.temperament.split(',').map(w => w.trim().substr(0, 1).toUpperCase() + w.trim().substr(1).toLowerCase()).join(', '));
    if ( breed.hairless !== undefined ) console.log(chalk.blueBright('Hairless:'.padEnd(13)), ['No', 'Yes'][breed.hairless]);
    if ( breed.weight ) console.log(chalk.blueBright('Weight:'.padEnd(13)), breed.weight[opts.i ? 'imperial' : 'metric']);
    if ( breed.hypoallergenic !== undefined ) console.log(chalk.blueBright('Hypoallergenic:'.padEnd(13)), ['No', 'Yes'][breed.hypoallergenic]);
    if ( breed.origin ) console.log(chalk.blueBright('Origin:'.padEnd(13)), breed.origin);

    console.log('');

  }

  console.log(chalk.dim(`More results maybe available! Use the ${chalk.yellow('--page')} and ${chalk.yellow('--limit')} options to control pagination.\n`));

})

// Command: search
.command('search')
.alias('s')
.description('searches for a cat breed')

.argument('<...query>')
.description('breed name to search for')
// Join all values
.sanitize(values => values.join(' '))
// Guard against empty strings
.validate(value => ! value.trim().length ? new Error('Invalid query!') : value)
// NOTE: Returning an error object would work the same as throwing one

.option('-i --imperial', 'displays imperial units')

.action(async (args, opts) => {

  const breeds = await request.get({
    url: HOST + '/breeds/search',
    qs: {
      q: args.query
    },
    headers: {
      'x-api-key': API_KEY
    },
    json: true
  });

  console.log('');

  if ( ! breeds.length ) return console.log(chalk.redBright.bold(`No breeds found with name similar to ${args.query}!\n`));

  for ( const breed of breeds ) {

    if ( breed.name ) console.log(chalk.blueBright('Name:'.padEnd(13)), chalk.bold(breed.name));
    if ( breed.life_span ) console.log(chalk.blueBright('Life Span:'.padEnd(13)), breed.life_span);
    if ( breed.temperament ) console.log(chalk.blueBright('Temperament:'.padEnd(13)), breed.temperament.split(',').map(w => w.trim().substr(0, 1).toUpperCase() + w.trim().substr(1).toLowerCase()).join(', '));
    if ( breed.hairless !== undefined ) console.log(chalk.blueBright('Hairless:'.padEnd(13)), ['No', 'Yes'][breed.hairless]);
    if ( breed.weight ) console.log(chalk.blueBright('Weight:'.padEnd(13)), breed.weight[opts.i ? 'imperial' : 'metric']);
    if ( breed.hypoallergenic !== undefined ) console.log(chalk.blueBright('Hypoallergenic:'.padEnd(13)), ['No', 'Yes'][breed.hypoallergenic]);
    if ( breed.origin ) console.log(chalk.blueBright('Origin:'.padEnd(13)), breed.origin);

    console.log('');

  }

  console.log(chalk.yellow.bold(`Found ${breeds.length} result${breeds.length !== 1 ? 's' : ''}\n`));

})

// Command: image
.command('image')
.alias('i')
.description('displays an image of a cat breed')

.argument('<...query>', 'breed name to search for')
// Join all values
.sanitize(values => values.join(' '))
// Guard against empty strings
.validate(value => ! value.trim().length ? new Error('Invalid query!') : value)

.action(async (args) => {

  // Search for breed
  const breeds = await request.get({
    url: HOST + '/breeds/search',
    qs: {
      q: args.query
    },
    headers: {
      'x-api-key': API_KEY
    },
    json: true
  });

  console.log('');

  // If not found
  if ( ! breeds.length ) return console.log(chalk.redBright.bold(`No breeds found with name similar to ${args.query}!\n`));

  // Use the first found breed to search for an image
  const images = await request.get({
    url: HOST + '/images/search',
    qs: {
      breed_id: breeds[0].id,
      size: 'med'
    },
    headers: {
      'x-api-key': API_KEY
    },
    json: true
  });

  // If no images
  if ( ! images.length ) return console.log(chalk.redBright.bold(`No image found for breed ${breeds[0].name}!\n`));

  // Print image in the terminal
  console.log(await terminalImage.buffer(await request.get({ url: images[0].url, encoding: null })), '');

})

.parse(process.argv);
