# Sleep4Fajr Website

This project replaces the Bun proxy with a Next.js application that provides:

- A public web app version of Sleep4Fajr
- A server-side API for prayer times at `/api/prayer-times`
- A health endpoint at `/api/health`

## Environment

Create `.env.local`:

```env
ISLAMIC_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## API

Example:

```bash
curl "http://localhost:3000/api/prayer-times?location=Algiers"
```

The response shape matches the extension's current expectations.
