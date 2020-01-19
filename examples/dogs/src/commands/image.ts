import app from '../../../..';
import request from 'request-promise-native';
import chalk from 'chalk';
import terminalImage from 'terminal-image';

app
.command('image')
.alias('i')
.description('displays an image of a dog breed')

.argument('<...query>', 'breed name to search for')
// Join all values
.sanitize(values => values.join(' '))
// Guard against empty strings
.validate(value => ! value.trim().length ? new Error('Invalid query!') : value)
// NOTE: Returning an error object would work the same as throwing one

.action(async (args) => {

  // Search for breed
  const breeds: Breed[] = await request.get({
    url: app.data<AppData>().apiHost + '/breeds/search',
    qs: {
      q: args.query
    },
    headers: {
      'x-api-key': app.data<AppData>().apiKey
    },
    json: true
  });

  console.log('');

  // If not found
  if ( ! breeds.length ) return console.log(chalk.redBright.bold(`No breeds found with name similar to ${args.query}!\n`));

  // Use the first found breed to search for an image
  const images: ImageResult[] = await request.get({
    url: app.data<AppData>().apiHost + '/images/search',
    qs: {
      breed_id: breeds[0].id,
      size: 'med'
    },
    headers: {
      'x-api-key': app.data<AppData>().apiKey
    },
    json: true
  });

  // If no images
  if ( ! images.length ) return console.log(chalk.redBright.bold(`No image found for breed ${breeds[0].name}!\n`));

  // Print image in the terminal
  console.log(await terminalImage.buffer(await request.get({ url: images[0].url, encoding: null })), '');

});
