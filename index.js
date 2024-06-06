const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const server = require('http').createServer(handler);
const {google} = require('googleapis');
const readline = require('readline');
// const server = require('http').createServer(handler);

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
var constants = require('./constant');


function handler(req, res) {
  console.log('new request');
  let chaine = '';
  req.on('data', function(troncon) {
    chaine += troncon;
  }).on('end', function() {
    // Load client secrets from a local file.
    console.log(chaine);
    fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Calendar API.
      authorize(JSON.parse(content), chaine, magie, req.url);
    });

  });
  res.end();
}

server.listen(8080);

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log('No upcoming events found.');
    return;
  }
  console.log('Upcoming 10 events:');
  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date;
    console.log(`${start} - ${event.summary}`);
  });
}

// server.listen(8080);

const Jmethod = {
  premierRappel: {
    instance: '1',
    moment: 4,

  },
  deuxièmeRappel: {
    instance: '2',
    moment: 8,

  },
  troisiemeRappel: {
    instance: '3',
    moment: 16,

  },
  quatriemeRappel: {
    instance: '4',
    moment: 20,

  },
    cinquiemeRappel: {
    instance: '5',
    moment: 30,

  },
    sixiemeRappel: {
    instance: '6',
    moment: 30,

  }
};
//Génère le tableau Event qui liste les évènements à poster
function genererEvent(titre) {
  let date = new Date();
  let Event = [];

  for (const event in Jmethod) {
    date.setDate(date.getDate() + Jmethod[event].moment);
    Event.push({
      'summary': titre,
      'description': `Révision ${Jmethod[event].instance} du cours`,
      'start': {
        'dateTime': date.toISOString(),
        'timeZone': 'Europe/Paris',
      },
      'end': {
        'dateTime': date.toISOString(),
        'timeZone': 'Europe/Paris',

      }
    });
  }
  return Event;
}


async function magie(auth, chaine, url) {
  const calendar = google.calendar({
    version: 'v3',
    auth
  });

    for (var event of genererEvent(chaine)) {
       calendar.events.insert({
        auth: auth,
        calendarId: constants.CALENDAR_ID,
        resource: event,
      }, function(err, event) {
        if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
          return;
        }
        console.log('Event created');

      });
      await sleep(1000);
    }


}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// authorize().then(magie).catch(console.error);
