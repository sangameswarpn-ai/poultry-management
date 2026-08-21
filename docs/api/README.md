# API Route Handler Specifications

This document outlines the planned Next.js server-side endpoint signatures for database synchronization.

## Endpoint Directory

All route handlers are mapped under `src/app/api/`.

### 1. Authentication Portal
- **Route**: `/api/auth`
- **Method**: `POST`
- **Payload**: `{ email, passwordHash, role }`
- **Response**: JWT session token representing Farmer, Officer, or Admin metadata.

### 2. Farms Registry Controller
- **Route**: `/api/farms`
- **Method**: `GET`, `POST`
- **Payload (POST)**: `{ name, lat, lng, address, district, state }`
- **Response**: GeoJSON formatted farm records with current risk statuses.

### 3. Biosecurity Log Sync
- **Route**: `/api/biosecurity`
- **Method**: `POST`
- **Payload**: `{ farmId, disinfection, footbath, quarantine, ppe, complianceRate, photoProofUrl }`
- **Response**: Updated biosecurity score averages.

### 4. Health Telemetry Sync
- **Route**: `/api/health`
- **Method**: `POST`
- **Payload**: `{ farmId, totalAnimals, healthyCount, sickCount, mortalityCount, symptoms: [] }`
- **Response**: Triggers **Risk Engine Calculator** and returns the resulting risk score.

### 5. Risk Assessment Alerts
- **Route**: `/api/risk`
- **Method**: `GET`
- **Query params**: `?district=Namakkal&risk=CRITICAL`
- **Response**: List of critical warnings requiring veterinary inspection dispatch.

### 6. Visitor Registry (QR Code scan)
- **Route**: `/api/visitors`
- **Method**: `POST`, `PATCH`
- **Payload (POST)**: `{ farmId, name, phone, purpose, plateNumber, vehicleType, disinfectionStatus }`
- **Payload (PATCH)**: `{ visitorId, exitTime }`
- **Response**: QR check-in acknowledgement.
