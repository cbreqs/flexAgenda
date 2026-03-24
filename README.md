# FlexAgenda Multi-Tenant Booking Platform

FlexAgenda is a sophisticated, multi-tenant scheduling solution built with Next.js 15, Firebase (Firestore & Auth), and Genkit AI. It allows "Business Owners" to manage isolated booking environments for their specific services, while providing "Customers" with a unified, branded reservation experience.

## Key Features

- **Multi-Tenant Isolation**: Each business operates in its own secure data silo.
- **Dynamic Branding**: The entire UI (colors, icons, logic) transforms based on the active business profile (e.g., Elevated Adventures vs. Wands and Ledgers).
- **Single Source of Truth**: Customer data is centralized across the platform in a master `grandclients` collection while keeping bookings business-specific.
- **AI-Powered Insights**: Integrated Genkit flows for generating service descriptions and optimizing schedules.
- **Role-Based Access**: Strict separation between Owner management and Customer booking portals.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database/Auth**: Firebase (Firestore, Authentication)
- **AI**: Firebase Genkit with Gemini
- **UI/Styling**: Tailwind CSS, Shadcn UI, Lucide Icons
- **Language**: TypeScript

## Getting Started

### 1. Prerequisites
- Node.js (v18 or later)
- A Firebase Project (with Firestore and Auth enabled)

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your Firebase configuration and Gemini API Key:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

### 4. Running the App
```bash
npm run dev
```

## How to Export to GitHub

1. **Initialize Git**:
   ```bash
   git init
   ```
2. **Add Remote**:
   ```bash
   git remote add origin https://github.com/your-username/your-repo-name.git
   ```
3. **Commit and Push**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git push -u origin main
   ```

## Deployment

This project is optimized for **Firebase App Hosting**. Simply connect your GitHub repository to the Firebase Console, and it will automatically handle the builds and global CDN deployment.

---
Built with ⚡ in Firebase Studio.