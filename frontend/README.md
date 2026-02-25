# SUVIDHA-2026 Frontend

This is the frontend application for the SUVIDHA-2026 platform, built with modern web technologies including Next.js, React, Tailwind CSS, and various specialized libraries for UI and AI integration.

## 🚀 Technologies Used

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) (Accessible, unstyled components)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Maps**: [Leaflet](https://leafletjs.com/) & React-Leaflet
- **Charts**: [Recharts](https://recharts.org/)
- **AI Integration**: [Genkit](https://github.com/firebase/genkit) (Google GenAI)
- **Backend/Services**: [Firebase](https://firebase.google.com/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: Version 20 or later
- **npm**: Node package manager (comes with Node.js)

## 🛠️ Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:9002` (or the port specified in the script).

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Start the production server**:
   ```bash
   npm run start
   ```

## 📜 Available Scripts

- `npm run dev` - Starts the development server with Turbopack.
- `npm run build` - Builds the application for production.
- `npm run start` - Starts the Next.js production server.
- `npm run lint` - Runs ESLint to check for code quality issues.
- `npm run typecheck` - Runs the TypeScript compiler to check for type errors without emitting files.
- `npm run genkit:dev` - Starts the Genkit development environment.
- `npm run genkit:watch` - Starts Genkit in watch mode.

## 📂 Project Structure

- `/src/app` - Next.js App Router pages and layouts.
- `/src/components` - Reusable React components (UI components, layouts, etc.).
- `/src/ai` - AI integration logic using Genkit.
- `/public` - Static assets like images and fonts.

## 🔒 Environment Variables

Make sure to create a `.env` or `.env.local` file in the root directory (if not already present) with all the necessary environment variables required for Firebase, Genkit, and other services. Look for a `.env.example` file if provided.
