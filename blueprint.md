# Project Blueprint

This document serves as the single source of truth for the application's architecture, features, and design decisions.

## 1. Overview

*(Awaiting user input for project overview)*

---

## 2. Database Schema (Supabase)

This section outlines the database structure for the project. The database is a Supabase PostgreSQL instance.

### Table: `dbce_categories`
- **Type:** BASE TABLE

| Column Name | Data Type | Nullable | Default |
|---|---|---|---|
| id | text | NO | null |
| summary_group | text | NO | null |
| department | text | NO | null |
| sub_department | text | YES | null |
| line_item | text | NO | null |
| created_at | timestamp with time zone | NO | now() |

### Table: `dbce_production`
- **Type:** BASE TABLE

| Column Name | Data Type | Nullable | Default |
|---|---|---|---|
| id | text | NO | null |
| production_artist_name | text | NO | null |
| agent | text | YES | null |
| agent_email_address | text | YES | null |
| created_at | timestamp with time zone | NO | now() |

### Table: `dbce_show`
- **Type:** BASE TABLE

| Column Name | Data Type | Nullable | Default |
|---|---|---|---|
| id | text | NO | null |
| production_id | text | NO | null |
| local_date | date | NO | null |
| local_time | time without time zone | NO | '19:30:00'::time without time zone |
| show_utc | timestamp with time zone | YES | null |
| status | text | NO | 'option'::text |
| show_number | integer | NO | 1 |
| notes | text | YES | null |
| created_at | timestamp with time zone | NO | now() |
| venue_id | text | YES | null |

### Table: `dbce_show_budget_item`
- **Type:** BASE TABLE

| Column Name | Data Type | Nullable | Default |
|---|---|---|---|
| id | bigint | NO | null |
| show_id | text | NO | null |
| summary_group | text | NO | null |
| department | text | NO | null |
| sub_department | text | YES | null |
| line_item | text | NO | null |
| unit | text | YES | null |
| number | integer | YES | 1 |
| rate | numeric | YES | 0 |
| created_at | timestamp with time zone | NO | now() |
| details | USER-DEFINED | YES | null |

### Table: `dbce_venue`
- **Type:** BASE TABLE

| Column Name | Data Type | Nullable | Default |
|---|---|---|---|
| id | text | NO | null |
| venue_name | text | NO | null |
| city | text | NO | null |
| total_capacity | integer | NO | null |
| seat_kills | integer | NO | 0 |
| comps | integer | NO | 0 |
| producer_holds | integer | NO | 0 |
| total_sellable | integer | YES | null |
| created_at | timestamp with time zone | NO | now() |
| venue_rental | numeric | YES | 0 |
| extra_show_fee | numeric | YES | 0 |
| hourly_extra_rate | numeric | YES | 0 |
