# Docker Instructions

This project is configured to run using Docker Compose. This allows you to start the database, backend, and frontend with a single command.

## Prerequisites

-   [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

## Quick Start

1.  **Open a terminal** in the root directory of the project (where `docker-compose.yml` is located).

2.  **Build and Start** the services:
    ```bash
    docker-compose up --build
    ```
    This command will:
    -   Build the Backend Docker image (Maven build).
    -   Build the Frontend Docker image (Angular build).
    -   Start the H2 Database container.
    -   Start the Backend container (connected to H2).
    -   Start the Frontend container (served by Nginx).

3.  **Access the Application**:
    -   **Frontend**: [http://localhost:80](http://localhost:80)
    -   **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)
    -   **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
    -   **H2 Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

## Troubleshooting

-   **Ports already in use**: Ensure ports `80`, `8080`, and `1521` are free.
-   **Database connection**: The backend waits for the database to be ready. If it fails, check the logs:
    ```bash
    docker-compose logs -f backend
    ```
-   **Rebuild**: If you make code changes, run `docker-compose up --build` again to rebuild the images.
