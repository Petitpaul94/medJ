#!/usr/bin/env python
import datetime
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from utils import open_config_file

# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/calendar"]

params = open_config_file("constant.json")


def create_event(event, service):
    """
    Function to create an event in the Google Calendar.
    """
    event = service.events().insert(calendarId=params.CALENDAR_ID, body=event).execute()
    print("Event created: %s" % (event.get("htmlLink")))


def main(new_event):
    """Shows basic usage of the Google Calendar API.
    Prints the start and name of the next 10 events on the user's calendar.
    Creates a new random event.
    """

    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    try:
        service = build("calendar", "v3", credentials=creds)

        # Call the Calendar API
        now = datetime.datetime.now(datetime.timezone.utc).astimezone().isoformat()
        print("Getting the upcoming 10 events")
        events_result = (
            service.events()
            .list(
                calendarId="primary",
                timeMin=now,
                maxResults=10,
                singleEvents=True,
                orderBy="startTime",
            )
            .execute()
        )
        events = events_result.get("items", [])

        if not events:
            print("No upcoming events found.")
            return

        # Prints the start and name of the next 10 events
        for event in events:
            start = event["start"].get("dateTime", event["start"].get("date"))
            print(start, event["summary"])

        # Create a new event
        print("Creating a new event")
        create_event(new_event, service)

    except HttpError as error:
        print(f"An error occurred: {error}")


# Refer to the Python quickstart on how to setup the environment:
# https://developers.google.com/calendar/quickstart/python
# Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
# stored credentials.

if __name__ == "__main__":
    event = {
        "id": "1234567890",
        "summary": "nain de jardin Google I/O 2015",
        "location": "800 Howard St., San Francisco, CA 94103",
        "description": "A chance to hear more about Google'ssssss developer products.",
        "start": {"date": datetime.date.today().isoformat()},
        "end": {"date": datetime.date.today().isoformat()},
    }
    main(event)
