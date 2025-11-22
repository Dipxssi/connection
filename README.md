# Connection - Portfolio Pitch App

A web app that lets you share your portfolio with a voice pitch that presents your work to viewers, ending with your LinkedIn profile.


## Getting Started

1. Install dependencies:
```bash
npm install
```

2. (Optional) Copy environment configuration:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown (usually `http://localhost:5173`)

## How to Use

1. Enter your portfolio URL (e.g., `https://yourportfolio.com`)
2. Enter your LinkedIn profile URL (e.g., `https://linkedin.com/in/yourprofile`)
3. Write your custom pitch text (minimum 10 characters)
4. Click "Generate QR Code"
5. Share the QR code or link with others
6. When viewers open the link, they can click "Play Portfolio Pitch" to hear your pitch
7. After the pitch completes, viewers will see your LinkedIn profile

## Tech Stack

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **Voice**: Web Speech API (for voice synthesis)
- **QR Codes**: qrcode.react




## Features in Detail

### URL Validation
- Validates portfolio URLs (must be http/https with valid domain)
- Validates LinkedIn URLs (must be from linkedin.com with /in/ path)







## Notes

- The voice pitch uses the browser's built-in Web Speech API
- Some portfolio sites may have CORS restrictions when loading in iframes (handled gracefully)
- Pitch text is stored in localStorage to avoid URL length limits
- The app automatically cleans up old localStorage entries (keeps last 10)

## Browser Support

- Chrome/Edge: Full support including Web Speech API
- Firefox: Full support including Web Speech API
- Safari: Full support including Web Speech API
- Mobile browsers: Supported (may require user interaction for speech)

## License

MIT

