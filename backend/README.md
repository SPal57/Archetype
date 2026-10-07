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

Represents the primary card of Archetype Details with 26 attributes:

| Column (DB) | Type | UI Label | Description |
|---|---|---|---|
| `ARCHT_ID` | VARCHAR(50) | Archetype ID | PRIMARY KEY (e.g. `ARC-0001`) |
| `Short_desc` | VARCHAR(500) | Short Description | Short summary of the lane |
| `Owner_role` | VARCHAR(100) | Owner Role | Role of the owner (dropdown LOV) |
| `Owner` | VARCHAR(255) | Owner | Owner name or email |
| `CSCL_Lane_ID` | VARCHAR(50) | CSCL Lane ID | Unique CSCL lane identifier |
| `Status` | VARCHAR(50) | Status | Status (Draft, Approved, In Review, etc.) |
| `Wave` | VARCHAR(50) | Wave | Rollout wave (dropdown LOV) |
| `Prev_Wave_CSCL_ID`| VARCHAR(50) | Prev Wave CSCL ID | Previous wave CSCL reference ID |
| `Nodes` | VARCHAR(50) | Nodes | Summary count / nodes label |
| `Plan_GRP` | VARCHAR(100) | Plan GRP | Plan Group (dropdown LOV) |
| `Franchise` | VARCHAR(100) | Franchise | Franchise unit (dropdown LOV) |
| `PLAN_team` | VARCHAR(100) | Plan Team | Planning team (dropdown LOV) |
| `TranSCend_PRJ` | VARCHAR(100) | **Project** | Project reference (DB: TranSCend_PRJ / UI: Project) |
| `Comments` | VARCHAR(MAX) | Comments | Notes and commentary |
| `SKU_Count` | INT | SKU Count | Total number of SKUs |
| `Sales_Vol` | VARCHAR(100) | Sales Vol | Sales volume estimate |
| `Tranactions_Vol` | VARCHAR(100) | Transactions Vol | Transaction volume estimate |
| `OMP_relevant` | VARCHAR(50) | **APS Relevant**| Relevance flag (DB: OMP_relevant / UI: APS Relevant) |
| `LEGO` | VARCHAR(50) | LEGO | LEGO indicator / code |
| `Returns` | VARCHAR(100) | Returns | Returns handling / process (dropdown LOV) |
| `Physical_flow` | VARCHAR(255) | Physical Flow | Physical distribution path (dropdown LOV) |
| `Financial_flow` | VARCHAR(255) | Financial Flow | Financial billing path (dropdown LOV) |
| `Description` | VARCHAR(MAX) | Description | In-depth description |
| `File_link` | VARCHAR(1000)| File Link | Attachment or diagram link |
| `prj_arch_ID` | VARCHAR(100) | Project Archetype ID | External/project archetype reference |
| `Documentation` | VARCHAR(MAX) | Documentation | Documentation notes |
| `created_at` | DATETIME2 | Created At | System audit timestamp |
| `updated_at` | DATETIME2 | Updated At | System audit timestamp |


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
