# Google Meet Generator

A simple web application that allows users to generate Google Meet links for instant meetings or schedule meetings for later. The application is live and hosted at [https://google-meet-generator.vercel.app](https://google-meet-generator.vercel.app).

## Features

- Google SSO Authentication using NextAuth.js
- Create instant Google Meet links
- Schedule meetings with date and time selection
- View list of created meetings
- Responsive UI built with Material UI

## Tech Stack

- **Frontend**: Next.js, React, Redux Toolkit, Material UI
- **Authentication**: NextAuth.js with Google provider
- **API Integration**: Google Calendar API
- **State Management**: Redux with Redux Toolkit

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Google Cloud Platform account with Google Calendar API enabled

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=https://google-meet-generator.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
```

### Google API Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Calendar API
4. Create OAuth 2.0 credentials
   - Set Authorized redirect URIs to `https://google-meet-generator.vercel.app/api/auth/callback/google`
5. Copy the Client ID and Client Secret to your `.env.local` file

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The application will be available at http://localhost:3000 for local development

## Deployment

This application is currently hosted on Vercel at [https://google-meet-generator.vercel.app](https://google-meet-generator.vercel.app).

### Vercel Deployment

If you want to deploy your own instance:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Set the environment variables in the Vercel dashboard
4. Deploy

## Architecture Decisions

- **NextAuth.js**: Used for authentication to simplify the OAuth flow with Google
- **Redux Toolkit**: For state management across the application
- **Material UI**: For a consistent and responsive UI design
- **Google Calendar API**: To generate Google Meet links through calendar events

## Scope Limitations

- No database integration - meeting data is stored in Redux state and lost on page refresh
- Limited error handling for API failures
- No meeting editing or deletion functionality
- No notifications or reminders for scheduled meetings
