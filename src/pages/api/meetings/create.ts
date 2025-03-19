import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.accessToken) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { title, startDateTime, endDateTime, isInstant, attendees } =
      req.body;

    if (isInstant) {
      // For instant meetings, do not create a calendar event
      const generatedId = `instant-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 11)}`;
      const generatedLink = `https://meet.google.com/${Math.random()
        .toString(36)
        .substring(2, 11)}`;
      const meetingData = {
        id: generatedId,
        link: generatedLink,
        title: title || "Instant Meeting",
        dateTime: null,
        isInstant: true,
        createdAt: new Date().toISOString(),
        attendees: attendees && attendees.length > 0 ? attendees : undefined,
        duration: null,
      };
      return res.status(200).json(meetingData);
    }

    // Configure OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    // Set credentials with both access and refresh tokens
    oauth2Client.setCredentials({
      access_token: token.accessToken as string,
      refresh_token: token.refreshToken as string,
    });

    // Configure Google Calendar API with the OAuth2 client
    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });

    // Create event with Google Meet link
    const event = {
      summary: title || "Instant Meeting",
      start: {
        dateTime: startDateTime || new Date().toISOString(),
      },
      end: {
        dateTime: endDateTime || new Date(Date.now() + 3600000).toISOString(), // Default 1 hour
      },
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 11)}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      // Add attendees if provided
      ...(attendees && attendees.length > 0
        ? {
            attendees: attendees.map((email: any) => ({ email })),
          }
        : {}),
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: event,
    });

    // Calculate duration in minutes if not an instant meeting
    let durationMinutes;
    if (!isInstant && startDateTime && endDateTime) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      durationMinutes = Math.round(
        (end.getTime() - start.getTime()) / (1000 * 60)
      );
    }

    const meetingData = {
      id: response.data.id,
      link: response.data.hangoutLink,
      title: response.data.summary,
      dateTime: isInstant ? null : response.data.start?.dateTime,
      isInstant: !!isInstant,
      createdAt: new Date().toISOString(),
      attendees: attendees && attendees.length > 0 ? attendees : undefined,
      duration: durationMinutes || null,
    };

    return res.status(200).json(meetingData);
  } catch (error) {
    console.error("Error creating meeting:", error);
    return res.status(500).json({ message: "Failed to create meeting", error });
  }
}
