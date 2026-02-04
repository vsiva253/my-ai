# Sovereign Intelligence - AI Chat Interface

A stunning, production-ready Next.js 15 chat interface for your local Python AI backend. Built with the App Router, TypeScript, Framer Motion, and a premium dark-mode aesthetic.

## 🎨 Features

- **Dual Mode Intelligence**: Seamlessly switch between Text Chat and Image Generation
- **Typewriter Effect**: Character-by-character streaming animation for AI responses
- **Rich Markdown Support**: Full markdown rendering with syntax highlighting for code blocks
- **Glassmorphism UI**: Premium floating input bar with backdrop blur effects
- **Smooth Animations**: Framer Motion powered transitions throughout
- **Media Lightbox**: Expandable image viewer with download functionality
- **Auto-Scroll**: Chat automatically scrolls to show latest messages
- **Error Handling**: Elegant toast notifications for backend connection issues

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Markdown**: react-markdown + rehype-highlight
- **Notifications**: Sonner

## 📋 Prerequisites

**IMPORTANT**: Next.js 15 requires Node.js **20.9.0 or higher**.

Check your Node version:
```bash
node --version
```

If you need to upgrade:
- Using [nvm](https://github.com/nvm-sh/nvm):
  ```bash
  nvm install 20
  nvm use 20
  ```
- Or download from [nodejs.org](https://nodejs.org/)

## 🛠️ Installation

The project is already set up at `/Users/vidh/aurelius_backend/aurelius-frontend/`.

Navigate to the directory and install dependencies (if needed):
```bash
cd /Users/vidh/aurelius_backend/aurelius-frontend
npm install
```

## 🎯 Running the Application

1. **Ensure your Python backend is running** on `http://localhost:8000`
   - Text endpoint: `POST /chat`
   - Image endpoint: `POST /image`

2. **Start the Next.js dev server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to [http://localhost:3000](http://localhost:3000)

## 🔌 Backend Integration

The app connects to your local Python backend with the following contract:

### Text Chat
```typescript
// Request
POST http://localhost:8000/chat
{
  "prompt": "User message here",
  "model": "superdrew100/llama3-abliterated"
}

// Response
{
  "response": "AI response text"
}
```

### Image Generation
```typescript
// Request
POST http://localhost:8000/image
{
  "prompt": "Image description"
}

// Response
{
  "image_base64": "base64_encoded_image_data"
}
```

## 🎨 Design Philosophy

**Sovereign Intelligence** embodies:
- Deep blacks (#0a0a0a) for a distraction-free canvas
- Subtle zinc borders and glassmorphic layers
- Neon blue/purple accents on interaction only
- Inter font family for premium typography
- Minimalist, clean, and production-ready aesthetics

## 📁 Project Structure

```
aurelius-frontend/
├── app/
│   ├── page.tsx              # Main chat interface
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Global styles & design system
├── components/
│   ├── chat-message.tsx      # Message bubbles with markdown
│   ├── streaming-text.tsx    # Typewriter effect component
│   ├── floating-input.tsx    # Glassmorphic input bar
│   ├── media-card.tsx        # Image display with lightbox
│   └── loading-indicator.tsx # Neural processing animation
└── lib/
    └── utils.ts              # Backend API + utilities
```

## 🎮 Usage

### Text Mode
1. Type your message in the input bar
2. Press Enter or click Send
3. Watch the AI response stream in with typewriter effect

### Image Mode
1. Click the Image icon (purple) or type `/image` followed by your prompt
2. Submit your description
3. The generated image appears in a Media Card with expand/download options

### Keyboard Shortcuts
- `Enter`: Send message
- `Shift + Enter`: New line in textarea

## 🐛 Troubleshooting

**"Neural Link Offline" error**:
- Verify your Python backend is running on port 8000
- Check backend logs for errors
- Ensure CORS is enabled on your backend

**Port already in use**:
```bash
npx kill-port 3000
npm run dev
```

**Node version error**:
- Upgrade to Node.js 20.9.0 or higher (see Prerequisites)

## 📝 License

This project is built with production-ready open source libraries. Customize freely.

---

Built with 🔥 by a Principal Frontend Architect mindset.
