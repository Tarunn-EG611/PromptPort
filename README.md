# PromptPort

PromptPort is a full-stack prompt management application built with a Spring Boot backend and a React frontend. It lets users create, organize, and manage prompt templates, categorize them, and maintain personal collections.

## Tech Stack

- Frontend: React, Redux Toolkit, React Router, Axios
- Backend: Java 17, Spring Boot 3, Spring Security, JPA, MySQL
- AI integration: Google Gemini API

## Project Structure

- `backend/` — Java Spring Boot application
- `frontend/` — React frontend application

## Prerequisites

- Java 17+
- Node.js 18+
- MySQL running locally

## Backend Setup

1. Create a MySQL database named `prompt_port`.
2. Set environment variables before running the app:

   ```bash
   export DB_URL="jdbc:mysql://localhost:3306/prompt_port"
   export DB_USERNAME="root"
   export DB_PASSWORD="your_mysql_password"
   export JWT_SECRET="your_jwt_secret"
   export GEMINI_API_KEY="your_gemini_api_key"
   ```

3. Run the backend:

   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

## Frontend Setup

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Start the React app:

   ```bash
   npm start
   ```

3. Open the app at:

   ```text
   http://localhost:3000
   ```

## Default API Connection

The frontend is configured to call the backend at:

```text
http://127.0.0.1:8080/api
```

## Notes

This project is intended to be a portfolio-ready application for demonstration purposes. Before pushing to a public GitHub repository, make sure:

- no real secrets or credentials remain in the codebase
- the database config is set via environment variables
- you review the app and remove any placeholder or debug content

## License

This project is for demonstration and portfolio use.
