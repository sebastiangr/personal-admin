# Personal Admin API

This directory contains the backend service for the Personal Admin application. It's a robust REST API built with Node.js, Express, TypeScript, and Prisma, designed to handle user authentication, data management, and business logic.

## Core Technologies

-   **Runtime:** [Node.js](https://nodejs.org/)
-   **Framework:** [Express.js](https://expressjs.com/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **ORM:** [Prisma](https://www.prisma.io/)
-   **Database:** [PostgreSQL](https://www.postgresql.org/)
-   **Authentication:** JWT (JSON Web Tokens)
-   **Validation:** [Zod](https://zod.dev/)
-   **Testing:** [Vitest](https://vitest.dev/) & [Supertest](https://github.com/ladjs/supertest)

## Local Development

These instructions assume you are running the database via the root `docker-compose.yml`.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Ensure the database is running:**
    From the project root, run `docker compose up -d postgres_db`.

4.  **Apply database migrations:**
    This will sync your local database schema with the `prisma/schema.prisma` file.
    ```bash
    npm run prisma:migrate
    ```

5.  **Seed the database (optional):**
    This will create the default 'admin' user.
    ```bash
    npm run db:seed:direct
    ```

6.  **Start the development server:**
    The server will run on `http://localhost:3300` (or the port defined in your `.env`) and will automatically restart on file changes.
    ```bash
    npm run dev
    ```

## Available Scripts

-   `npm run dev`: Starts the server in development mode.
-   `npm run build`: Compiles TypeScript to JavaScript for production.
-   `npm run prisma:migrate`: Creates and applies a new database migration.
-   `npm run prisma:reset`: Resets the local development database.
-   `npm run test`: Runs the end-to-end test suite using Vitest.

## API Endpoints

A full collection for Insomnia/Postman is recommended. Here is a summary of the available endpoints:

### Auth (`/api/auth`)

-   `POST /register`: Create a new user.
-   `POST /login`: Log in and receive a JWT.
-   `GET /me`: Get the current authenticated user's info.

### Companies (`/api/companies`)

-   `GET /`: Get all companies for the authenticated user.
-   `POST /`: Create a new company.
-   `GET /:companyId`: Get a specific company.
-   `PUT /:companyId`: Update a company.
-   `DELETE /:companyId`: Delete a company.
-   `GET /:companyId/people`: Get all people associated with a company.
-   `POST /:companyId/people`: Assign a person to a company.

### People (`/api/people`)

-   `GET /`: Get all people for the authenticated user.
-   `POST /`: Create a new person.
-   `PUT /:personId`: Update a new person.
-   `DELETE /:personId`: Delete a new person.


