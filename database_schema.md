This document outlines the database schema for the application. All tables and columns are defined here, and this file serves as the single source of truth for the database structure.

### `dbce_categories`

| Column | Type | Description |
| --- | --- | --- |
| id | text | Primary Key |
| summary_group | text |  |
| department | text |  |
| sub_department | text |  |
| line_item | text |  |
| created_at | timestamp with time zone |  |

### `dbce_production`

| Column | Type | Description |
| --- | --- | --- |
| id | text | Primary Key |
| production_artist_name | text |  |
| agent | text |  |
| agent_email_address | text |  |
| created_at | timestamp with time zone |  |

### `dbce_recoupment_scenarios`

| Column | Type | Description |
| --- | --- | --- |
| id | bigint | Primary Key |
| production_id | text | Foreign Key to `dbce_production.id` |
| name | text |  |
| gross_box_office_potential | numeric |  |
| number_of_seats | integer |  |
| vat_rate | numeric |  |
| agent_commission_rate | numeric |  |
| solt_levy_amount | numeric |  |
| rest_levy_per_seat | numeric |  |
| royalty_rate | numeric |  |
| created_at | timestamp with time zone |  |

### `dbce_show`

| Column | Type | Description |
| --- | --- | --- |
| id | text | Primary Key |
| production_id | text | Foreign Key to `dbce_production.id` |
| local_date | date |  |
| local_time | time without time zone |  |
| show_utc | timestamp with time zone |  |
| status | text |  |
| show_number | integer |  |
| notes | text |  |
| created_at | timestamp with time zone |  |
| venue_id | text | Foreign Key to `dbce_venue.id` |

### `dbce_show_budget_item`

| Column | Type | Description |
| --- | --- | --- |
| id | bigint | Primary Key |
| show_id | text | Foreign Key to `dbce_show.id` |
| summary_group | text |  |
| department | text |  |
| sub_department | text |  |
| line_item | text |  |
| unit | text |  |
| number | integer |  |
| rate | numeric |  |
| created_at | timestamp with time zone |  |
| details | public.details_enum_type |  |

### `dbce_venue`

| Column | Type | Description |
| --- | --- | --- |
| id | text | Primary Key |
| venue_name | text |  |
| city | text |  |
| total_capacity | integer |  |
| seat_kills | integer |  |
| comps | integer |  |