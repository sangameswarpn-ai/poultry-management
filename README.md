# Digital Farm Management Portal for Biosecurity (SIH25006)

This is a comprehensive, production-ready farm-level biosecurity management portal developed for **Smart India Hackathon SIH25006: Digital Farm Management Portal for Implementing Biosecurity Measures in Pig and Poultry Farms**.

The portal digitizes biosecurity management, performs explainable risk analysis on health and mortality spikes, enables contact tracing through vehicle/visitor QR codes, and connects Farmers, Veterinary Officers, District Admins, and State Admins into a cohesive response loop.

## Core Architecture & Workflow

```text
Farm Registration
        ↓
Daily Biosecurity Checklists
        ↓
Health & Mortality Logging (Counter-based, with Symptom logging)
        ↓
Risk Engine (Rule-based anomaly scoring: Low, Medium, High, Critical)
        ↓
Risk Alert Dispatch (Notification Center, prepared for SMS/Push/WhatsApp)
        ↓
Veterinary Investigation & Scheduling
        ↓
Field Inspection & Actions
        ↓
Admin/State-Level Spatial Monitoring & Analytics
```

## Technology Stack

### Frontend & UI
- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling & Components**: Tailwind CSS v4, shadcn/ui, Radix UI, Lucide React
- **Forms**: React Hook Form, Zod
- **Data Visualization**: Recharts
- **Spatial Map**: Leaflet & React Leaflet with OpenStreetMap
- **QR Operations**: QR Code generation and html5-qrcode scanning integrations

### Backend & Database
- **API Engine**: Next.js Route Handlers
- **Database ORM**: Prisma
- **Database**: PostgreSQL (Prepared for AWS Aurora PostgreSQL & DynamoDB)

### Accessibility & Offline Capabilities
- **Languages**: English, Tamil (தமிழ்), Hindi (हिन्दी)
- **Offline Sync**: Network status indicator with IndexedDB / localStorage queueing structure
- **A11y features**: Voice input setup, high contrast support, clean typography, large touch-friendly buttons

---

## Directory Structure

```text
poultry management/
├── src/
│   ├── app/                 # Next.js App Router Pages and API routes
│   ├── components/          # Reusable UI & Layout Components (Sidebar, Theme Toggle, Map, etc.)
│   ├── features/            # Business feature domains (biosecurity, risk, tracing)
│   ├── lib/                 # Core utilities, db init, risk engine, and maps
│   ├── mock-data/           # Real-world telemetry for 15+ farms
│   ├── hooks/               # Custom hooks (offline sync, theme context, etc.)
│   ├── types/               # TypeScript declarations
│   ├── constants/           # Global constants (symptoms, risk colors, links)
│   └── config/              # App config parameters
├── prisma/                  # Prisma Database schema
├── public/                  # Static assets (icons, maps, sounds)
├── docs/                    # Core technical documentation (Architecture, API, DB)
└── tests/                   # Automated Unit & E2E tests
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL (optional, falls back to mocks for local dev)

### Installation & Run

1. Clone or open the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables:
   ```bash
   cp .env.example .env
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## User Roles & Credentials (Demo Mode)

The Login page allows selecting simulated roles:
1. **Farmer**: Daily biosecurity logs, sickness trackers, QR code entry check.
2. **Veterinary Officer**: Risk maps, alerts manager, inspection planner, reports.
3. **Admin**: Territorial dashboards, district analytics, mortality grids.
