# SUVIDHA-2026 Database

This directory contains the database schema, structures, and initial data required for the SUVIDHA-2026 platform. 

The primary file in this directory is a PostgreSQL dump (`database.sql`) that can be used to spin up a local instance of the database or migrate it to another environment.

## 🚀 Technologies Used

- **Database Engine**: [PostgreSQL](https://www.postgresql.org/)
- **Data Types Used**:
  - Relational Models
  - JSONB for flexible schema structures
- **Default Ownership**: `suvidha_user`

## 📋 Prerequisites

Before you begin, ensure you have the following installed to interact with the database dump:
- **PostgreSQL Server**: Version 16.x (The dump is created with version 16.11)
- **PostgreSQL Client Tools** (optional but recommended): `psql`, `pg_restore`, or a graphical client like pgAdmin, DBeaver.

## 🛠️ Getting Started

To restore the database on your local setup, you need to execute the SQL dump file against an empty PostgreSQL database.

1. **Create the target database and user**:
   ```sql
   CREATE USER suvidha_user WITH PASSWORD 'your_password';
   CREATE DATABASE suvidha_db OWNER suvidha_user;
   ```

2. **Restore the dump**:
   Run the following command in your terminal (make sure your PostgreSQL `bin` directory is in your PATH):
   ```bash
   psql -U suvidha_user -d suvidha_db -f database.sql
   ```
   *Note: You may be prompted for the password for `suvidha_user`.*

## 📂 Structure Overview

The database contains tables related to various microservices and domains of the SUVIDHA-2026 application:
- **Authentication & Core (`auth_`, `django_`)**: Users, groups, permissions, API keys.
- **Billing (`billing_`)**: Electricity, Gas, Water accounts, Bills, and Line Items.
- **Payments (`payments_`)**: Payments and Payment Receipts.
- **Grievances (`grievances_`)**: Complaints, updates, and attachments.
- **Service Requests (`service_requests_`)**: Service requests and related documentation.
- **Notifications (`notifications_`)**: Notifications and system alerts.
- **Content (`content_`)**: FAQs and Service contents.
- **Audit Logs (`audit_`)**: API access logs and detailed entity audit logging.
