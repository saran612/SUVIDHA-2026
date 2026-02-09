# SUVIDHA PostgreSQL Database Documentation

This document provides instructions for setting up and managing the PostgreSQL database for the SUVIDHA backend.

## Prerequisites

- **PostgreSQL** (v12 or higher) must be installed and running.
  - Ubuntu/Debian: `sudo apt install postgresql postgresql-contrib`
  - macOS: `brew install postgresql`
  - Windows: Download installer from [postgresql.org](https://www.postgresql.org/download/windows/)

## Configuration

The default configuration used in `scripts/setup_db.sh` and `.env` is:

| Setting | Value |
| :--- | :--- |
| **Database Name** | `suvidha` |
| **User** | `suvidha_user` |
| **Password** | `suvidha_pass` |
| **Host** | `localhost` |
| **Port** | `5432` |

## Setup Instructions

### Option 1: Automated Script (Recommended)

We have provided a script to automate the database creation.

1.  Navigate to the `backend` directory.
2.  Run the setup script:
    ```bash
    bash scripts/setup_db.sh
    ```
    *Note: You may be prompted for your `sudo` password to create the postgres user/database.*

### Option 2: Manual Setup

If you prefer to set it up manually, access the PostgreSQL shell:

```bash
sudo -u postgres psql
```

Then run the following SQL commands:

```sql
-- Create User
CREATE USER suvidha_user WITH PASSWORD 'suvidha_pass';

-- Create Database
CREATE DATABASE suvidha OWNER suvidha_user;

-- Grant Privileges
ALTER ROLE suvidha_user SET client_encoding TO 'utf8';
ALTER ROLE suvidha_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE suvidha_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE suvidha TO suvidha_user;

-- Exit
\q
```

## Running Migrations

Once the database is created, apply the Django migrations to create the schema:

1.  Activate your virtual environment:
    ```bash
    source venv/bin/activate
    ```
2.  Run migrations:
    ```bash
    python manage.py migrate
    ```

## Useful Commands

### Access Database Shell
To access the database using the `suvidha_user`:

```bash
psql -h localhost -U suvidha_user -d suvidha
```
*(Enter `suvidha_pass` when prompted)*

### Common PSQL Commands
- `\dt` : List all tables.
- `\d table_name` : Describe a specific table.
- `\du` : List all users/roles.
- `\l` : List all databases.
- `\q` : Quit psql.

### Reset Database
If you need to completely wipe the database and start fresh (WARNING: DELETES ALL DATA):

```bash
python scripts/reset_schema.py
python manage.py migrate
```

## Troubleshooting

-   **Peer authentication failed for user "suvidha_user"**:
    -   Ensure `pg_hba.conf` allows MD5/password authentication for local connections, or use `-h localhost` to force TCP connection (which usually defaults to password auth).
-   **Database does not exist**:
    -   Run the setup script or create the database manually.
-   **Permission denied**:
    -   Ensure the `suvidha_user` has `ALL PRIVILEGES` on the `suvidha` database.
