# Personal Admin (Tiny CRM)

> A minimalist, self-hosted micro-CRM designed for a strategic job search, for freelance devs.

![image](https://placehold.co/800x400/222/FFF?text=App+Screenshot+Coming+Soon)

This project was born out of a personal need to apply a surgical approach to the job hunting process. Instead of mass-applying to hundreds of listings, this tool helps you manage a curated list of target companies and track every interaction with precision.

## MVP Features

-   **Contact Management:** Add, edit, and view key companies and contacts.
-   **Status Tracking:** Classify each contact with clear, actionable statuses (`BACKLOG`, `TO_CONTACT`, `CONTACTED`, `WAITING_RESPONSE`, etc.).
-   **Prioritization:** Assign an interest level (1 to 3) to each contact to focus your energy where it matters most.
-   **Activity History:** An automated log records every important action (contact creation, status changes), providing a clear timeline.
-   **Secure API:** The backend is protected with JWT-based authentication.
-   **Effortless Deployment:** Fully containerized with Docker and Docker Compose for a quick and repeatable setup on any VPS.

## Tech Stack

-   **Frontend:** SvelteKit (Coming Soon)
-   **Backend:** Node.js, Express, TypeScript
-   **Database:** PostgreSQL
-   **ORM:** Prisma
-   **Infrastructure:** Docker, Docker Compose
-   **Reverse Proxy:** Caddy

## Getting Started (Local Development)

### Prerequisites

-   [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/install/)
-   [Node.js](https://nodejs.org/en/) (v18 or higher)
-   [pnpm](https://pnpm.io/) (Recommended package manager)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/sebastiangr/personal-admin
    ```

2.  **Create your environment file:**
    Copy the example `.env.example` to a new `.env` file at the project root. This file will be used by Docker Compose to provision all services.
    ```bash
    cp .env.example .env
    ```
    *Fill in the variables inside `.env` with your desired credentials.*

3.  **Launch the services:**
    This command will build the necessary images and start the backend API and the database containers.
    ```bash
    docker compose up -d --build
    ```

4.  **Run database migrations:**
    With the database container running, you can now apply the database schema.
    ```bash
    cd backend
    npm install
    npx prisma migrate dev
    ```

The API will be available at `http://localhost:3033`.

## License

This project is licensed under the **MIT License**. See the `LICENSE` file for more details.
