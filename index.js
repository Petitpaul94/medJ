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

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  g.authorize(JSON.parse(content), listEvents);
});

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return g.getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function handler (req, res) {
	console.log('new request');
	res.end();
}

server.listen(8080);

const Jmethod = {
	premierRappel : {
		instance : '1',
		moment : '3', 
		importance : 'red'
	},
	deuxièmeRappel : {
		instance : '2',
		moment : '4', 
		importance : 'orange'
	},
	troisiemeRappel : {
		instance : '3',
		moment : '15', 
		importance : 'green'
	},
};

function genererEvent(titre) {
	let date = new Date ();
	let Event = [];
	for (const event of Jmethod) {
		date.setDate(date.getDate()+event.moment);
		
		Event.push({
			'summary': title,
			'description':  `révision ${event.instance} du cours`,
			'colorId' : event.importance,
			'start': {
				'dateTime': date.toISOString(),
				'timeZone': 'Europe/Paris',
			},
			'end': {
				'dateTime': date.toISOString(),
				'timeZone': 'Europe/Paris',

			});
		}
	}
}

2rcan2lpn0lccjkf9f4dmqpthc@group.calendar.google.com