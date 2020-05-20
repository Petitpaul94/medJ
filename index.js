const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const g = require('./google.js');
const server = require('http').createServer(handler);

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
    fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Calendar API.
      g.authorize(JSON.parse(content), magie);
    });

  });
  res.end();
}

server.listen(8080);

const Jmethod = {
  premierRappel: {
    instance: '1',
    moment: '3',
    importance: 'red'
  },
  deuxièmeRappel: {
    instance: '2',
    moment: '4',
    importance: 'orange'
  },
  troisiemeRappel: {
    instance: '3',
    moment: '15',
    importance: 'green'
  },
};
 //Génère le tableau Event qui liste les évènements à poster
function genererEvent(titre) {
  let date = new Date();
  let Event = [];
  for (const event of Jmethod) {
    date.setDate(date.getDate() + event.moment);
    Event.push({
      'summary': title,
      'description': `révision ${event.instance} du cours`,
      'colorId': event.importance,
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

//Poste le tableau dans le calendrier
function magie(auth) {
  const calendar = google.calendar({version: 'v3', auth});
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
      console.log('Event created: %s', event.htmlLink);
    });
  }
}
