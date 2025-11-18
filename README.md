# Connection - AI-Powered Portfolio Pitch App

A beautiful web app that lets you share your portfolio with an AI voice agent that pitches your work to viewers, ending with your LinkedIn profile.

## Features

-  Enter your portfolio URL and LinkedIn profile
-  AI voice agent automatically pitches your portfolio
-  LinkedIn profile display after pitch completion

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown (usually `http://localhost:5173`)

## How to Use

1. Enter your portfolio URL (e.g., `https://yourportfolio.com`)
2. Enter your LinkedIn profile URL (e.g., `https://linkedin.com/in/yourprofile`)
3. Click "Generate Connection"
4. The AI voice agent will automatically start pitching your portfolio
5. After the pitch completes, viewers will see your LinkedIn profile

## Tech Stack

- React + TypeScript
- Web Speech API (for voice synthesis)


## Notes

- The voice pitch uses the browser's built-in Web Speech API
- Later we might you use voice agents 
- Some portfolio sites may have CORS restrictions when loading in iframes

