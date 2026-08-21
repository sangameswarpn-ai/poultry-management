# SIH25006 — Demo Evaluation Guide

This guide walks you through verifying and evaluation-testing the core features of the Biosecurity Portal.

## Demo Sequence

### Step 1: Launch and Theme Verification
1. Run the local Next.js development server:
   ```bash
   npm run dev
   ```
2. Navigate to [http://localhost:3000](http://localhost:3000).
3. Toggle the Theme Toggle located in the top navbar (Sun / Moon / System).
4. Verify that card borders, background colors, and typography adjust correctly without white-out issues.

### Step 2: Simulated Authentication
1. Click **Portal Sign-In** or navigate to `/login`.
2. Select **Farmer Profile**. You will be logged in as Ramesh Kumar and routed to the Farmer Dashboard.
3. Observe the live counters, biosecurity compliance meter, and the SVG mortality chart.

### Step 3: Farmer Operations
1. Go to **Biosecurity Checklist** on the sidebar.
2. Select daily parameters (e.g. Disinfection, Footbath) and click **Submit Daily Verification**. Observe the live score.
3. Navigate to **Health Log**. Tap the `[+]` button on Deaths Today. Note how the healthy bird count shifts dynamically. Click **Submit Daily Telemetry**.
4. Go to **Visitors Log**. Create a new entry for a truck feed loader, select vehicle parameters, and check in. Click **Mark Exit** when done.
5. Go to **Report Disease**. Select symptoms and observe the accessibility voice notes button. Click **Dispatch Outbreak Alert**.

### Step 4: Veterinary Officer Assessment
1. Quick-switch to the **Officer** portal using the developer links in the top header.
2. Observe the **GIS Infection Map** centered around Namakkal, TN. Hover over the markers to view live popup metadata.
3. Review the **Active Alerts Queue**. Click **Mark Investigating** or **Resolve Alert** and note status shifts.
4. Schedule a visit in **Inspections** or review lab results in **Reports**.

### Step 5: State Admin Dashboard
1. Switch to the **Admin** portal.
2. Verify state-wide registered counts and the correlation chart linking low compliance to high disease indexes.
3. Compare district stats (Namakkal vs Coimbatore vs Vellore) inside the **District Stats** table.
