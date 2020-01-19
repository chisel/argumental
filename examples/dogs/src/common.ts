import app from '../../..';

app
.shared
// Run before all handlers
.action(() => {

  // Set API key
  app.data<AppData>().apiKey = 'a032a24b-a44f-4a0d-bec3-8ecc04d0d55f';
  app.data<AppData>().apiHost = 'https://api.thedogapi.com/v1';

});
