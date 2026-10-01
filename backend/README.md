# J&J Archetype Provisioning Hub - Backend API

Node.js + Express backend service connected to **Azure SQL Database (`LHM2`)**.

---

## 🛡️ Architecture & Security Isolation

- **Server:** `aykbsd01.database.windows.net`
- **Database:** `LHM2`
- **Custom Schema:** `archetype`
  > **Zero Disruption Guarantee:** All tables, indexes, and queries created by this application are strictly isolated inside the `[archetype]` schema (e.g. `[archetype].[lane_headers]`). It **never** alters, queries, or interferes with any existing `dbo.*` tables (`dbo.FakeDetPre`, etc.).

---

## 📋 Table 1: Lane Header (`archetype.lane_headers`)

Represents the primary card of Archetype Details with 13 attributes:

| Column | Type | Constraints | Description |
|---|---|---|---|
| `archetype_id` | VARCHAR(50) | PRIMARY KEY | Unique ID (e.g., `ARC-0001`) |
| `cscl_lane_id` | VARCHAR(50) | NOT NULL, INDEXED | CSCL Lane ID (e.g., `CSCL-1001`) |
| `code` | VARCHAR(100) | NULL | Code (e.g., `L3J1-USROTC-JP`) |
| `title` | VARCHAR(255) | NULL | Lane Title |
| `status` | VARCHAR(50) | DEFAULT 'Draft' | Status (Draft, Approved, New, etc.) |
| `owner_email` | VARCHAR(255) | NOT NULL, INDEXED | Owner email address |
| `wave` | VARCHAR(50) | NULL | Rollout wave (e.g., `Wave 3`) |
| `short_description` | VARCHAR(500) | NULL | Short summary of the lane |
| `plan_team` | VARCHAR(100) | NULL | Planning Team (e.g., `APAC Planning`) |
| `plan_grp` | VARCHAR(100) | NULL | Plan Group (e.g., `PG-JP-01`) |
| `project` | VARCHAR(100) | NULL | Associated Project ID |
| `nodes_count` | VARCHAR(50) | NULL | Summary count (e.g., `5 nodes defined`) |
| `attachment_name` | VARCHAR(255) | NULL | Filename (e.g., `lane_spec_jp.pdf`) |
| `l1_physical_flow` | VARCHAR(255) | NULL | Physical Flow description |
| `l1_financial_flow` | VARCHAR(255) | NULL | Financial Flow description |
| `created_at` | DATETIME2 | DEFAULT GETUTCDATE() | Timestamp |
| `updated_at` | DATETIME2 | DEFAULT GETUTCDATE() | Timestamp |

---

## 🚀 Getting Started

### 1. Configure `.env`
Ensure your password is set in `backend/.env`:
```env
DB_SERVER=aykbsd01.database.windows.net
DB_DATABASE=LHM2
DB_USER=pipeline
DB_PASSWORD=your_actual_password
DB_PORT=1433
DB_SCHEMA=archetype
PORT=5000
```

### 2. Initialize the Database
*(Run from inside the internal corporate network or Cloud PC)*
```bash
npm run db:init
```
This script will:
1. Verify connectivity to `LHM2`.
2. Automatically create `SCHEMA archetype` if it doesn't exist yet.
3. Automatically create `TABLE archetype.lane_headers` with indexes.
4. Seed the initial record (`ARC-0001` / `CSCL-1001`).

### 3. Start the Backend API
```bash
npm run dev
```
Endpoints:
- `GET  /api/health` — Checks database connectivity status
- `GET  /api/lane-headers` — Retrieves all lane headers
- `GET  /api/lane-headers/:id` — Retrieves a lane header by `archetype_id` or `cscl_lane_id`
- `POST /api/lane-headers` — Creates a new lane header
