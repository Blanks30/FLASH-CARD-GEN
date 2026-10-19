# Flashcard Maker

An interactive flashcard application built with React, TypeScript, and Vite. The project includes study cards and a Gemini-powered service for AI-assisted flashcard content.

## Requirements

- Node.js and npm
- A Gemini API key for AI-generated content

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root and add your key:

   ```dotenv
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   Open the local URL printed by Vite. The current Vite configuration uses port `3000`.

## Useful commands

```bash
npm run build
npm run lint
```

## Security

Never commit a real `.env` file or API key. This project currently injects its configured Gemini key into the frontend bundle at build time, which means a deployed key can be inspected by users. For a public production deployment, move Gemini requests to a backend and restrict the key in Google AI Studio/Cloud.
