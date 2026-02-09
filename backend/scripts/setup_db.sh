#!/bin/bash

# Database Configuration
DB_NAME="suvidha"
DB_USER="suvidha_user"
DB_PASS="suvidha_pass"

echo "Setup Suvidha Database..."

# Check if postgres is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install it first."
    exit 1
fi

# Create User
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" || echo "User likely exists, skipping..."

# Create Database
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" || echo "Database likely exists, skipping..."

# Grant Privileges
sudo -u postgres psql -c "ALTER ROLE $DB_USER SET client_encoding TO 'utf8';"
sudo -u postgres psql -c "ALTER ROLE $DB_USER SET default_transaction_isolation TO 'read committed';"
sudo -u postgres psql -c "ALTER ROLE $DB_USER SET timezone TO 'UTC';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo "Database $DB_NAME created successfully!"
echo "Connection String: postgres://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"
