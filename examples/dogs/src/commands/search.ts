import app from '../../../..';
import request from 'request-promise-native';
import chalk from 'chalk';

app
.command('search')
.alias('s')
.description('searches for a dog breed')

.argument('<...query>', 'breed name to search for')
// Join all values
.sanitize(values => values.join(' '))
// Guard against empty strings
.validate(value => ! value.trim().length ? new Error('Invalid query!') : value)
// NOTE: Returning an error object would work the same as throwing one

.option('-i --imperial', 'displays imperial units')

.actionDestruct<ActionData>(async ({ args, opts, data }) => {

  const breeds: Breed[] = await request.get({
    url: data.apiHost + '/breeds/search',
    qs: {
      q: args.query
    },
    headers: {
      'x-api-key': data.apiKey
    },
    json: true
  });

  console.log('');

  if ( ! breeds.length ) return console.log(chalk.redBright.bold(`No breeds found with name similar to ${args.query}!\n`));

  for ( const breed of breeds ) {

    if ( breed.name ) console.log(chalk.blueBright('Name:'.padEnd(13)), chalk.bold(breed.name));
    if ( breed.life_span ) console.log(chalk.blueBright('Life Span:'.padEnd(13)), breed.life_span);
    if ( breed.temperament ) console.log(chalk.blueBright('Temperament:'.padEnd(13)), breed.temperament);
    if ( breed.breed_group ) console.log(chalk.blueBright('Breed Group:'.padEnd(13)), breed.breed_group);
    if ( breed.bred_for ) console.log(chalk.blueBright('Bred For:'.padEnd(13)), breed.bred_for);
    if ( breed.height ) console.log(chalk.blueBright('Height:'.padEnd(13)), breed.height[opts.i ? 'imperial' : 'metric']);
    if ( breed.weight ) console.log(chalk.blueBright('Weight:'.padEnd(13)), breed.weight[opts.i ? 'imperial' : 'metric']);
    if ( breed.origin ) console.log(chalk.blueBright('Origin:'.padEnd(13)), breed.origin);

    console.log('');

  }

  console.log(chalk.cyan.bold(`Found ${breeds.length} result${breeds.length !== 1 ? 's' : ''}\n`));

});
