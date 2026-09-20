#!/bin/bash

# Initialize multiple databases in PostgreSQL
set -e

psql -v ON_ERROR_STOP=1 <<-EOSQL
    CREATE DATABASE mindreply;
    CREATE DATABASE a11k;
    CREATE DATABASE rwa;
    
    -- Create users with limited privileges
    CREATE USER mindreply WITH PASSWORD '$POSTGRES_PASSWORD';
    CREATE USER a11k WITH PASSWORD '$POSTGRES_PASSWORD';
    CREATE USER rwa WITH PASSWORD '$POSTGRES_PASSWORD';
    
    -- Grant privileges
    GRANT ALL PRIVILEGES ON DATABASE mindreply TO mindreply;
    GRANT ALL PRIVILEGES ON DATABASE a11k TO a11k;
    GRANT ALL PRIVILEGES ON DATABASE rwa TO rwa;
EOSQL

echo "✓ Databases initialized"
