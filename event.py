class Event:
    def __init__(self, title, summary, start, end):
        self.title = title
        self.summary = summary
        self.start = start
        self.end = end

    def __str__(self):
        return f"{self.title}: {self.summary}"

    def __repr__(self):
        return f"{self.title}: {self.summary}"

    def to_json(self):
        return {
            "summary": self.title,
            "location": "au pays des nains charbonneurs",
            "description": str(self),
            "start": {
                "dateTime": self.start,
                "timeZone": "America/Los_Angeles",
            },
            "end": {
                "dateTime": "2015-05-28T17:00:00-07:00",
                "timeZone": "America/Los_Angeles",
            },
            "recurrence": ["RRULE:FREQ=DAILY;COUNT=2"],
            "attendees": [
                {"email": "lpage@example.com"},
                {"email": "sbrin@example.com"},
            ],
            "reminders": {
                "useDefault": False,
                "overrides": [
                    {"method": "email", "minutes": 24 * 60},
                    {"method": "popup", "minutes": 10},
                ],
            },
        }
