#!/bin/bash
set -e

# Creates the extra databases for the multi-db architecture
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE buscadados;
    CREATE DATABASE dados_viacep;
EOSQL
