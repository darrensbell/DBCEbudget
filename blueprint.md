# Project Blueprint

This document serves as the single source of truth for the application's architecture, features, and design decisions.

## 1. Overview

A web-based budget tool for DBCE, designed with the "Paper Dashboard" aesthetic. It interfaces with a Supabase backend and provides a clean, modern dashboard for managing budget-related data.

---

## 2. Implemented Features

### "Paper Dashboard" Design

The application's visual identity is based on the "Paper Dashboard React" template by Creative Tim. This includes:

- A dark sidebar for navigation.
- A light, textured main content area.
- A card-based layout for displaying data.

### Icon-Driven Sidebar

The sidebar has been transformed into a full navigation menu:

- **Icons:** Uses the `react-icons` library for clear, intuitive navigation links (e.g., Productions, Settings).
- **Active State:** The currently selected page is highlighted.
- **Database Status:** Retains the at-a-glance database connection indicator at the bottom.

### Dashboard View

The main content area is designed as a dashboard hub:

- **Header:** Includes a title ("Dashboard") and a control area with a search bar and icons for notifications and settings.
- **Stat Cards:** A grid of four placeholder "Stat Cards" displays key metrics with icons, titles, values, and footers, mimicking the reference design.

---

## 3. Styling & Component Libraries

- **React-Bootstrap:** A component library for building responsive and modern UIs.
- **React-Icons:** For iconography throughout the application.

### Design System ("Paper Dashboard")

- **Color Palette:**
  - Sidebar Background: `#1E1E2D`
  - Content Background: `#F4F3EF`
  - Text (Dark): `#333`
  - Text (Light): `#fff`
- **Typography:**
  - Primary Font: "Helvetica Neue", Arial, sans-serif.

---

## 4. Database Schema (Supabase)

This section outlines the database structure for the project. The database is a Supabase PostgreSQL instance.

### Table: `dbce_categories`

- **Type:** BASE TABLE

| Column Name    | Data Type                | Nullable | Default |
| -------------- | ------------------------ | -------- | ------- |
| id             | text                     | NO       | null    |
| summary_group  | text                     | NO       | null    |
| department     | text                     | NO       | null    |
| sub_department | text                     | YES      | null    |
| line_item      | text                     | NO       | null    |
| created_at     | timestamp with time zone | NO       | now()   |

### Table: `dbce_production`

- **Type:** BASE TABLE

| Column Name            | Data Type                | Nullable | Default |
| ---------------------- | ------------------------ | -------- | ------- |
| id                     | text                     | NO       | null    |
| production_artist_name | text                     | NO       | null    |
| agent                  | text                     | YES      | null    |
| agent_email_address    | text                     | YES      | null    |
| created_at             | timestamp with time zone | NO       | now()   |

### Table: `dbce_show`

- **Type:** BASE TABLE

| Column Name   | Data Type                | Nullable | Default                            |
| ------------- | ------------------------ | -------- | ---------------------------------- |
| id            | text                     | NO       | null                               |
| production_id | text                     | NO       | null                               |
| local_date    | date                     | NO       | null                               |
| local_time    | time without time zone   | NO       | '19:30:00'::time without time zone |
| show_utc      | timestamp with time zone | YES      | null                               |
| status        | text                     | NO       | 'option'::text                     |
| show_number   | integer                  | NO       | 1                                  |
| notes         | text                     | YES      | null                               |
| created_at    | timestamp with time zone | NO       | now()                              |
| venue_id      | text                     | YES      | null                               |

### Table: `dbce_show_budget_item`

- **Type:** BASE TABLE

| Column Name    | Data Type                | Nullable | Default |
| -------------- | ------------------------ | -------- | ------- |
| id             | bigint                   | NO       | null    |
| show_id        | text                     | NO       | null    |
| summary_group  | text                     | NO       | null    |
| department     | text                     | NO       | null    |
| sub_department | text                     | YES      | null    |
| line_item      | text                     | NO       | null    |
| unit           | text                     | YES      | null    |
| number         | integer                  | YES      | 1       |
| rate           | numeric                  | YES      | 0       |
| created_at     | timestamp with time zone | NO       | now()   |
| details        | USER-DEFINED             | YES      | null    |

### Table: `dbce_venue`

- **Type:** BASE TABLE

| Column Name       | Data Type                | Nullable | Default |
| ----------------- | ------------------------ | -------- | ------- |
| id                | text                     | NO       | null    |
| venue_name        | text                     | NO       | null    |
| city              | text                     | NO       | null    |
| total_capacity    | integer                  | NO       | null    |
| seat_kills        | integer                  | NO       | 0       |
| comps             | integer                  | NO       | 0       |
| producer_holds    | integer                  | NO       | 0       |
| total_sellable    | integer                  | YES      | null    |
| created_at        | timestamp with time zone | NO       | now()   |
| venue_rental      | numeric                  | YES      | 0       |
| extra_show_fee    | numeric                  | YES      | 0       |
| hourly_extra_rate | numeric                  | YES      | 0       |

---

## 5. Development Plan: Productions, Shows, and Budgets

This section outlines the development plan for the core functionality of the application.

### Phase 1: Production Management

- **Goal:** Create, read, and update productions.
- **UI:**
  - Display productions as individual cards on the "Productions" page.
  - Each card will show the production's name and other key details.
  - Include a "+" button to add a new production.
  - Each production card will have an "Edit" button.

### Phase 2: Show Management

- **Goal:** Manage shows associated with each production.
- **UI:**
  - Inside each production card, display a list of its shows.
  - Each show will have its own set of controls: "Edit" and "Remove".
  - An "Add Show" button will be available within each production card.
- **Core Logic:**
  - When a new show is created, a corresponding budget will be automatically generated.
  - This budget will be a direct copy of the master list of categories from the `dbce_categories` table, with each category becoming a line item in the new budget.

### Phase 3: Interactive Budget View

- **Goal:** Provide an editable, spreadsheet-like interface for managing a show's budget.
- **UI:**
  - Clicking a "Budget" button on a show will open a new view.
  - This view will resemble an Excel spreadsheet, with rows representing budget line items.
  - All fields in a budget line (e.g., unit, number, rate) will be editable.
  - The budget view will include options to add or remove line items.
- **Data Flow:**
  - All changes made in the budget view will be saved back to the `dbce_show_budget_item` table in real-time or via a "Save" button.

---

## 6. Tooling and Code Quality

### ESLint

- **Purpose:** To statically analyze the code to quickly find problems.
- **Configuration:** The project is configured with ESLint to enforce code quality and a consistent style.
- **Usage:** Run `eslint . --fix` to automatically fix many linting issues.

### Prettier

- **Purpose:** To maintain a consistent code format across the entire codebase.
- **Configuration:** Prettier is installed as a development dependency.
- **Usage:** Run `npx prettier . --write` to format all project files.

---

## 7. Development Process

### Pre-Publishing Checklist

To ensure code quality and a stable deployment, a pre-publishing checklist has been codified in `AI_LAW_FIREBASE.md`. Before any deployment, the following automated steps are required:

1.  **Run Linter:** Execute `eslint . --fix`.
2.  **Run Prettier:** Execute `npx prettier . --write`.

This process is enforced to maintain a high standard of code quality for all deployments.
