import app from '../../..';

app
.shared
// Run before all handlers
.actionDestruct<ActionData>(({ data }) => {

  // Set API key
  data.apiKey = 'a032a24b-a44f-4a0d-bec3-8ecc04d0d55f';
  data.apiHost = 'https://api.thedogapi.com/v1';

});
