const fs = require('fs');
const readline = require('readline');
const server = require('http').createServer(handler);
const {
  google
} = require('googleapis');
const db = require('./db.js');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';


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

const Jmethod = {
  premierRappel: {
    instance: '1',
    moment: 3,
    importance: 'red'
  },
  deuxièmeRappel: {
    instance: '2',
    moment: 4,
    importance: 'orange'
  },
  troisiemeRappel: {
    instance: '3',
    moment: 15,
    importance: 'green'
  }
};
//Génère le tableau Event qui liste les évènements à poster
function genererEvent(titre) {
  let date = new Date();
  let Event = [];
  //appelle la base de données et renvoie la couleur de l'évènement
  const couleur = db.call(titre, date.toISOString());
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

      },
      'colorId': couleur
    });
  }
  return Event;
}


function magie(auth, chaine, url) {
  const calendar = google.calendar({
    version: 'v3',
    auth
  });

  if (url == '/reporter') {
    let date = new Date();
    const event = {
      'summary': chaine,
      'description': 'report du cours',
      'start': {
        'dateTime': date.toISOString(),
        'timeZone': 'Europe/Paris',
      },
      'end': {
        'dateTime': date.toISOString(),
        'timeZone': 'Europe/Paris',
      }
    };
    calendar.events.insert({
      auth: auth,
      calendarId: '2rcan2lpn0lccjkf9f4dmqpthc@group.calendar.google.com',
      resource: event,
    }, function(err, event) {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return;
      }
      console.log('Event created');
    });


  } else {
    for (var event of genererEvent(chaine)) {
      calendar.events.insert({
        auth: auth,
        calendarId: '2rcan2lpn0lccjkf9f4dmqpthc@group.calendar.google.com',
        resource: event,
      }, function(err, event) {
        if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
          return;
        }
        console.log('Event created');
      });
    }
  }


}









/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, titre, callback, url) {
  const {
    client_secret,
    client_id,
    redirect_uris
  } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, titre, callback, url);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, titre, url);
  });
}
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, titre, callback, url) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client, titre, url);
    });
  });
}
