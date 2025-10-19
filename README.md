# Personal Admin (Tiny CRM)
> A minimalist, self-hosted micro-CRM for freelance developers, designers, and agencies to manage their job hunting and lead generation process strategically.

![image](https://placehold.co/800x400/222/FFF?text=App+Screenshot+Coming+Soon)

This project was born out of a personal need to apply a surgical, focused approach to finding opportunities, moving away from mass applications towards a curated "Dream 100 List".


## Core Features (v0.1.0)

-   **Multi-User Authentication:** Secure user registration and login using JWT.
-   **Data Segregation:** Each user only has access to their own data.
-   **Company & People Management:** Create and manage `Companies` (agencies, startups) and `People` (contacts, leads) as separate but related entities.
-   **Relational Model:** Assign people to companies with specific roles (e.g., "Lead Developer at Atari, Inc.").
-   **Interactive Tracking:** Update the `Status` and `Interest Level` of each company directly from the main view.
-   **Full CRUD & History:** Complete Create, Read, Update, Delete functionality with an automated `ActivityLog` for key events.
-   **Robust API:** A fully tested backend with Zod validation ensures data integrity and security.

## Tech Stack

-   **Frontend:** [Vue 3](https://vuejs.org/) with TypeScript, [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [DaisyUI](https://daisyui.com/).
-   **Backend:** [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/).
-   **Database:** [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/).
-   **Deployment:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/).

## Getting Started (Local Development)

This project is a monorepo containing the `frontend` and `backend` services. The following instructions will get the entire application running locally.

### Prerequisites

-   [Docker](https://www.docker.com/get-started) & Docker Compose
-   [Node.js](https://nodejs.org/en/) (v20 or higher)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/sebastiangr/personal-admin.git
    cd personal-admin
    ```

2.  **Create your environment file:**
    Copy the example to create your local environment configuration.
    ```bash
    cp .env.example .env
    ```
    *Fill in the variables inside `.env`. The defaults are configured for local Docker development.*

3.  **Launch the Database Service:**
    This command starts the PostgreSQL database container.
    ```bash
    docker compose up -d postgres_db
    ```

4.  **Setup the Backend:**
    Navigate to the backend, install dependencies, and prepare the database.
    ```bash
    cd backend
    npm install
    npm run prisma:reset # This will create the schema and seed the 'admin' user
    ```

5.  **Run Both Services:**
    You will need two separate terminals.

    -   **Terminal 1 (Backend):**
        ```bash
        cd backend
        npm run dev
        ```
    -   **Terminal 2 (Frontend):**
        ```bash
        cd frontend
        npm install
        npm run dev
        ```

The frontend will be available at `http://localhost:5173` and the API at `http://localhost:3300`.

> For more detailed instructions on backend or frontend development, please see the `README.md` file inside each respective directory.

## License

This project is licensed under the **MIT License**.
