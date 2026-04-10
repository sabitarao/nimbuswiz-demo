Design a complete set of low-to-mid fidelity wireframes for a SaaS product called "NimbusCloud".

## Product Overview

NimbusCloud is an enterprise modernization platform that helps users upgrade and manage legacy “Nimbus2000-class” flight systems (fictional, inspired by Harry Potter) to modern “Nimbus2026” capabilities.

The tone should be professional and enterprise-grade, with subtle thematic cues (e.g., naming, iconography), but avoid playful or cartoonish visuals. This should feel like a real B2B cloud platform (similar to AWS, Datadog, or HashiCorp tools).

---

## Target Users

1. DevOps Engineers – manage upgrades, automation, CI/CD integration
2. System Administrators – monitor system health, run scans, troubleshoot
3. Technical Managers – track system performance, risk, and modernization progress

---

## Core User Goals

* Register and manage legacy systems
* Run system scans and dependency analysis
* Apply upgrade profiles (Stable, Performance, Extended)
* Monitor system metrics and alerts
* Automate upgrades via pipelines
* Troubleshoot failures and view logs

---

## Primary Navigation (Sidebar)

Include a left sidebar with these sections:

* Overview (Dashboard)
* Systems
* System Assessment
* Modernization
* Deployment
* Monitoring
* API & Integrations
* Automation
* Troubleshooting
* Settings

---

## Required Screens (Design Each Clearly)

### 1. Dashboard (Overview)

* High-level metrics:

  * Stability Index
  * Responsiveness Score
  * Network Interaction
* Alerts summary panel
* Recent activity feed
* Systems health overview (cards or table)

---

### 2. Systems List Page

* Table with:

  * System Name
  * Status
  * Last Upgrade
  * Stability Score
* Actions:

  * View details
  * Run scan
  * Upgrade
* “Register New System” CTA

---

### 3. System Detail Page

* Tabs:

  * Overview
  * Dependencies
  * Metrics
  * Logs
* Show:

  * System metadata
  * Current upgrade profile
  * Health metrics visualization
  * Recent alerts

---

### 4. System Assessment (Scan Results)

* Dependency graph (visual placeholder)
* Risk heatmap table:

  * Component
  * Risk level (High/Medium/Low)
  * Recommendation
* CTA: “Proceed to Modernization”

---

### 5. Modernization (Upgrade Profiles)

* Card layout for:

  * Stable
  * Performance
  * Extended Operation
* Each card shows:

  * Description
  * Impact on metrics
  * Risk level
* CTA: “Apply Profile”

---

### 6. Deployment Page

* Timeline view:

  * Scheduled upgrades
  * In-progress deployments
* Deployment status:

  * Preparing / Executing / Monitoring / Completed
* Rollback button
* Logs preview panel

---

### 7. Monitoring & Alerts

* Metrics dashboard:

  * Line graphs for Stability, Responsiveness, Network
* Alerts panel:

  * Severity (Critical, Warning, Info)
* Predictive maintenance suggestions

---

### 8. API & Integrations

* API key management UI
* Example API request/response blocks
* Integration cards:

  * CI/CD tools
  * Monitoring tools

---

### 9. Automation (CI/CD)

* Pipeline visualization
* YAML editor panel (mock)
* Scheduled jobs list
* Event hooks configuration

---

### 10. Troubleshooting

* Log viewer (terminal-style)
* Filters:

  * Time
  * Severity
* Common issues panel
* Suggested fixes

---

### 11. Settings / Security

* Role-based access control UI:

  * Viewer / Operator / Admin
* API key rotation
* Audit logs

---

## Design Style Guidelines

* Clean, modern SaaS UI (inspired by AWS, Stripe Dashboard, Datadog)
* Neutral color palette (greys, blues), with subtle accent color
* Avoid fantasy visuals; use only subtle naming cues (Nimbus, etc.)
* Use cards, tables, and dashboards heavily
* Prioritize clarity, hierarchy, and scannability

---

## Interaction Requirements

* Include hover states, modals, and dropdowns
* Show empty states and error states
* Include loading states for scans and deployments

---

## Data Realism

Use realistic mock data:

* System IDs (e.g., n2k-alpha-001)
* Metrics (e.g., Stability: 72 → 85)
* Logs with timestamps
* API responses in JSON

---

## Output Format

* Provide wireframes for all screens
* Use consistent layout and reusable components
* Include annotations explaining UX decisions
* Label key components (tables, charts, CTAs)

---

## Bonus (if supported)

* Include a user journey flow:
  Register System → Scan → Modernize → Deploy → Monitor → Troubleshoot

---

Goal: The result should look like a real enterprise cloud platform that could exist today, demonstrating strong product thinking, UX clarity, and technical system design.
