
# OpenShelf Analytics 📊

A professional visitor management and facility analytics system for New Era University.

## 🌐 Live Application
The application is hosted at: **[https://studio-8706353121-4d298.web.app](https://studio-8706353121-4d298.web.app)**

## 🚀 Deployment Guide

This project is optimized for dynamic deployment using Firebase.

### Deployment via Firebase CLI
To deploy the application and ensure the dynamic Next.js backend is active:

1. **Enable the Web Frameworks Experiment:**
   ```bash
   firebase experiments:enable webframeworks
   ```

2. **Deploy the App:**
   ```bash
   firebase deploy
   ```
   *Note: This command detects the Next.js project in the current directory, builds it, and deploys it to Firebase Hosting and Cloud Functions automatically.*

### Deployment via Firebase App Hosting (Recommended)
1. Push your code to a GitHub repository.
2. Connect your repository in the [Firebase Console](https://console.firebase.google.com/) under **App Hosting**.
3. Firebase will handle every build and deployment automatically on every push to your main branch.

## 🛠️ Tech Stack
- **Framework:** Next.js 15 (App Router)
- **AI:** Genkit (Google Gemini 2.5 Flash)
- **Database/Auth:** Firebase Firestore & Firebase Auth
- **UI:** Tailwind CSS & ShadCN Components

---
© 2025 New Era University. Authorized Institutional Access Only.
