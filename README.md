<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/leaf.svg" alt="KrishiSetu Logo" width="80" height="80">
  <br/>
  <h1>🌾 KrishiSetu (कृषि सेतु)</h1>
  <p><strong>Your Intelligent AI Farming Partner</strong></p>
  <p>Empowering Indian farmers with real-time data, cutting-edge AI diagnostics powered by Grok, and multilingual support.</p>

  <p align="center">
    <a href="#-overview">Overview</a> •
    <a href="#-key-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-project-structure">Project Structure</a>
  </p>
</div>

---

## 📖 Overview

**KrishiSetu** (meaning "Farming Bridge") is a comprehensive, mobile-first web application designed specifically for Indian farmers. It leverages artificial intelligence—specifically utilizing **Grok AI** for enhanced logic and reasoning—to provide actionable insights, crop disease diagnostics, live market prices, and personalized farming schedules. 

Built with modern web technologies, KrishiSetu delivers a highly responsive, native-app-like experience on budget Android devices even under slow network conditions.

---

## ✨ Key Features

- 🤖 **KisanSarthi AI Chat (WhatsApp Style)**
  - Ask farming questions in English, Hindi, Kannada, Telugu, Tamil, or Marathi.
  - Voice dictation and Text-to-Speech support for high accessibility.
  - Context-aware responses powered by state-of-the-art AI, including **Grok** and Google Gemini.

- 🔬 **AI Crop Doctor**
  - Upload photos of diseased crops directly from your mobile camera.
  - Instantly receive accurate AI diagnostics, identify causes, and get actionable, organic, and chemical treatment recommendations.

- 📊 **Live Mandi Prices**
  - Real-time and historical market prices across various Indian states and commodities.
  - Visual trends with interactive area graphs to help farmers decide the best time to sell.

- 📋 **Government Schemes Explorer**
  - Easily discover eligible agricultural schemes (like PM-KISAN, Fasal Bima Yojana).
  - Simple step-by-step application guidance, eligibility criteria, and required documents.

- 📅 **Smart Crop Planner**
  - Track your fields and calculate estimated harvest dates.
  - Get a dynamic timeline of tasks (plowing, sowing, watering, harvesting).

- ⛅ **Localized Weather & Jalsathi**
  - Current localized weather conditions and accurate short-term forecasts.
  - **Jalsathi**: Smart irrigation planner that advises when to run pumps based on soil moisture and upcoming rain, saving water and diesel.

- 🛒 **Krishi Marketplace**
  - Direct peer-to-peer platform for buying and selling crops, seeds, fertilizers, and equipment.
  - Filter by category, price, and exact location without any middlemen.

- 📦 **Inventory Management**
  - Track stock levels for seeds, fertilizers, pesticides, and farming equipment.
  - Automatic calculation of total inventory value with smart low-stock alerts.

- 👷 **Digital Majdoor (Labor Management)**
  - Manage farm laborers, track attendance, and log daily wages seamlessly.
  - Record and monitor advance payments to avoid disputes and maintain clear records.

- 🔐 **Secure Auth & Personalized Onboarding**
  - Email/Password authentication powered by Supabase.
  - Comprehensive onboarding capturing farm size, primary crops, and exact GPS location for highly customized insights.

- 📱 **100% Mobile Optimized Experience**
  - Built explicitly for 320px–430px screens commonly used in rural areas.
  - Large touch targets, horizontal scroll chips, and intuitive bottom-sheet navigation.
  - "Offline-aware" capability with automatic reconnection banners.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Framer Motion
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + RLS Policies)
- **AI Engine**: **Grok API** (xAI) & Google Gemini Pro
- **Icons & Charts**: Lucide React & Recharts
- **Mapping**: Leaflet & OpenStreetMap API

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- Supabase Account & Project
- Grok API Key / Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/krishisetu.git
cd krishisetu
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and add the following keys:

```env
# Next.js App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Keys (Find these in your Supabase Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI API Keys
GROK_API_KEY=your_grok_api_key
GEMINI_API_KEY=your_gemini_api_key

# Govt Data API (Optional: For live Mandi Prices from data.gov.in)
DATA_GOV_API_KEY=your_data_gov_api_key
```

### 4. Setup Database schema
Navigate to your Supabase SQL Editor and run the schema definitions found in:
`supabase/schema.sql`

This will create all necessary tables (`farmer_profiles`, `crop_plans`, `inventory`, `majdoor_logs`) and setup Row Level Security (RLS) policies.

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. 

> **Tip:** For the best testing experience, use your browser's Developer Tools to view the app in a mobile viewport (e.g., iPhone SE or Pixel 5).

---

## 📂 Project Structure

```text
krishisetu/
├── app/                  # Next.js App Router Pages
│   ├── (auth)/           # Login & Signup flows
│   ├── (dashboard)/      # Protected dashboard routes (Chat, Mandi, Planner, etc.)
│   ├── api/              # Backend API routes (Chat, Profile, Scrapers)
│   ├── globals.css       # Core styling & mobile utility classes
│   └── layout.tsx        # Root layout & PWA meta tags
├── components/           # Reusable UI Components
│   ├── home/             # Landing page sections
│   ├── layout/           # Header, Sidebar, and mobile BottomNav
│   ├── onboarding/       # Multi-step profile setup
│   └── ui/               # Base components (Loaders, OfflineBanner)
├── lib/                  # Utilities (Supabase client, AI APIs, Voice processing)
├── public/               # Static assets (icons, splash screens)
├── stores/               # Zustand state management
├── supabase/             # SQL schemas & DB migrations
└── types/                # TypeScript interface definitions
```

---

## 🎨 Design System

KrishiSetu utilizes a nature-inspired design system meant to evoke trust and growth:
- **Primary Green**: `#166534` (Brand color)
- **Light Green Background**: `#f0fdf4`
- **Text Body**: `#4b5563`
- **Typography**: `Poppins` (Weights: 300 to 800)
- **Borders**: Highly rounded corners (`rounded-2xl` & `rounded-xl`) for a friendly, modern feel.



## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
<div align="center">
  <i>Built with ❤️ for the farmers of India.</i>
  <br/>
  <b>Developed by Prajwal P Raikar</b>
</div>
