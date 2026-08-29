# Storefront Backend Project

REST API backing an online storefront: browsing products, placing orders, and managing user accounts. See [`REQUIREMENTS.md`](REQUIREMENTS.md) for the full endpoint map and database schema, and [`CONTEXT.md`](CONTEXT.md) for the domain glossary.

## Required Technologies
- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- bcryptjs from npm for password hashing
- jasmine from npm for testing

## Prerequisites

- Node.js and npm
- Docker (for running Postgres locally via `docker-compose`)

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Copy the example environment file and fill in real values:
   ```
   cp .env.example .env
   ```
   `.env` holds the Postgres connection info, the JWT signing secret, and the bcrypt pepper/salt rounds. Never commit `.env` — it's gitignored.

3. Start Postgres:
   ```
   docker-compose up -d
   ```
   This starts a Postgres 15 container on port 5432, using the credentials from `.env`. The `POSTGRES_DB` value is auto-created as a database when the container first starts.

4. Create the test database (the dev database in `POSTGRES_DB` is created automatically by the Postgres image on first boot):
   ```
   docker exec -it postgres-api-postgres-1 psql -U postgres -c "CREATE DATABASE storefront_test;"
   ```

5. Run migrations against the dev database:
   ```
   npm run migrate:up
   ```

## Running the app

```
npm start
```

The API will listen on `http://localhost:3000`.

## Running tests

```
npm test
```

This applies the migrations to the test database (`storefront_test`, selectd via `db-migrate -e test`), will run the Jasmine model and endpoint specs, and then will tear down the test schema back donwn — so it's safe to run repeatedly.

## Environment variables (for reviewers)

`.env` is gitignored, so the real values used in this submission are listed here for grading:

```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=storefront_dev
POSTGRES_TEST_DB=storefront_test
POSTGRES_USER=postgres
POSTGRES_PASSWORD=mysecretpassword
ENV=dev
BCRYPT_PASSWORD=anewtestpassword
SALT_ROUNDS=10
JWT_SECRET=change_this_secret_in_production
```

## Linting

```
npm run lint
```

Runs `oxlint` against the source. This also runs automatically on every `git commit` via a husky pre-commit hook.
