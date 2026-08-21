# Software Architecture — PoultryLens AI (SIH25006)

This document details the modular layer patterns and future system scalability profiles of the SIH25006 Poultry Management platform.

## Architecture Layers

```text
       [Client Browser] (PWA / Offline Queue)
              ⇅
     [Next.js App Router] (Server Pages & API Controllers)
              ⇅
      [Risk Scoring Engine] (Rule-based weights)
              ⇅
        [Prisma ORM]
              ⇅
     [PostgreSQL Database] (AWS Aurora fallback)
```

### 1. Frontend Design Systems
- **Base Framework**: Next.js 16 App Router.
- **Client Components**: All forms (React Hook Form, Zod), charts (inline SVGs & Recharts), and map elements (dynamic Leaflet wrappers) utilize standard hydration protection controls.
- **Tailwind v4 CSS variables**: Intercepted by `ThemeProvider` (next-themes) to transition styles dynamically between Light and Dark modes.

### 2. Risk Engine Mathematics
The system evaluates farm-level risk indices ranging from `0` to `100` based on live health telemetry:
$$\text{Risk Score} = \text{Score}_{\text{Mortality}} + \text{Score}_{\text{Symptoms}} + \text{Score}_{\text{Biosecurity Lapses}} + \text{Score}_{\text{Vehicle Contact}}$$

Where:
- **Mortality**: Up to $+60$ if mortality exceeds $1.0\%$ of active flock count in 24 hours.
- **Symptoms**: $+45$ for critical anomalies (e.g., sudden death), $+25$ for major (fever, dyspnea), $+10$ for mild (cough).
- **Biosecurity Lapses**: Up to $+25$ for compliance score dropping below $50\%$.
- **Vehicles**: $+15$ for unsanitized transport entries.

### 3. Future AWS Migration Ready
The system is built to decouple data models and allow easy swap-in of cloud primitives:
- **Database**: Prisma connects to local PostgreSQL. In production, this shifts to **AWS Aurora Serverless PostgreSQL**.
- **Contact Tracing logs**: High-volume visitor QR scans can be routed to **Amazon DynamoDB** for low-latency queries and automatic TTL data expiry.
- **Alert Dispatch**: The notification service triggers local state indicators, easily updated to route SMS via **AWS SNS** or push notifications via **AWS Pinpoint**.
