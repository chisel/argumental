import app from '../../../..';
import request from 'request-promise-native';
import chalk from 'chalk';

app
.command('list')
.alias('l')
.description('Lists all known dog breeds')

.option('-p --page <page_number>', 'Pagination')
// Page number must be a valid number
.validate(app.NUMBER)
// Cast into string (since request's query params must be string only)
.sanitize(value => value + '')
.default('0')

.option('-l --limit <limit_count>', 'Breeds per page')
.validate(app.NUMBER)
.sanitize(value => value + '')
.default('5')

.option('-i --imperial', 'Displays imperial units')

.actionDestruct<ActionData>(async ({ opts, data }) => {

  const breeds: Breed[] = await request.get({
    url: data.apiHost + '/breeds',
    qs: {
      page: opts.page,
      limit: opts.limit
    },
    headers: {
      'x-api-key': data.apiKey
    },
    json: true
  });

  console.log('');

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

  console.log(chalk.dim('More results maybe available! Use the --page and --limit options to control pagination.\n'));

});
