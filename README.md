# PromptPort

PromptPort is a full-stack prompt management application that lets users create, version, organize, and share AI prompt templates. It features role-based access control, AI-powered prompt optimization via Google Gemini, template forking, version history, and personal collections.

## Tech Stack

- **Frontend:** React, Redux Toolkit, React Router, Axios
- **Backend:** Java 17, Spring Boot 3, Spring Security, JPA, MySQL
- **AI Integration:** Google Gemini API (via WebClient)
- **Auth:** JWT (stateless)

## Project Structure

```
PromptPort/
├── backend/    # Spring Boot REST API
└── frontend/   # React SPA
```

## Features

### Authentication
- Register and login with JWT-based authentication
- Three user roles: `PROMPT_ENGINEER`, `PROMPT_COLLECTOR`, `TEAM_LEAD`

### Prompt Templates
- Create prompt templates with a title, description, category, and initial prompt text
- View all public templates in the library
- View full template details including version history
- Edit and delete your own templates
- Fork any public template into your own account
- Templates can be marked public or private

### Version History
- Publish new versions of a template with a version tag, prompt text, temperature, and model provider
- View full version history per template
- Delete versions (creator or TEAM_LEAD only)

### AI Prompt Optimization
- Optimize any prompt using Google Gemini AI directly from the template creation form
- Available to all authenticated users
- One-click "Use This Version" to apply the optimized prompt to the form

### Collections
- Create personal collections with a name, description, and max capacity
- Add or remove templates from a collection via a sync modal
- Delete collections
- Collections are private to the owner

### Categories
- Browse templates by category
- TEAM_LEAD can create, update, and delete categories
- Categories track template counts

### Dashboard
- Overview stats for the logged-in user

## Roles & Permissions

| Feature                        | PROMPT_ENGINEER | PROMPT_COLLECTOR | TEAM_LEAD |
|-------------------------------|-----------------|------------------|-----------|
| Create templates               | ✅              | ✅               | ✅        |
| Delete own templates           | ✅              | ✅               | ✅        |
| Fork public templates          | ✅              | ✅               | ✅        |
| Publish versions               | ✅              | ✅               | ✅        |
| Delete any version             | ❌              | ❌               | ✅        |
| AI prompt optimization         | ✅              | ✅               | ✅        |
| Manage collections             | ✅              | ✅               | ✅        |
| Manage categories              | ❌              | ❌               | ✅        |

## Prerequisites

- Java 17+
- Node.js 18+
- MySQL running locally

## Backend Setup

1. Create a MySQL database named `prompt_port`.

2. Set environment variables before running:

   ```bash
   export DB_URL="jdbc:mysql://localhost:3306/prompt_port"
   export DB_USERNAME="<your_db_username>"
   export DB_PASSWORD="<your_db_password>"
   export JWT_SECRET="<your_jwt_secret_base64>"
   export GEMINI_API_KEY="<your_gemini_api_key>"
   ```

   On Windows (PowerShell):

   ```powershell
   $env:DB_PASSWORD="<your_db_password>"
   $env:GEMINI_API_KEY="<your_gemini_api_key>"
   ```

3. Run the backend:

   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

The backend seeds the following default accounts on first run:

| Username    | Password       | Role              |
|-------------|----------------|-------------------|
| engineer    | engineer123    | PROMPT_ENGINEER   |
| lead        | lead123        | TEAM_LEAD         |
| collector   | collector123   | PROMPT_COLLECTOR  |

It also seeds 5 default categories: Creative Writing, Coding, Marketing, Data Analysis, Chatbots.

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

3. Open the app at `http://localhost:3000`

## API Base URL

The frontend calls the backend at:

```
http://127.0.0.1:8080/api
```

## API Endpoints

| Method | Endpoint                        | Auth         | Description                        |
|--------|---------------------------------|--------------|------------------------------------|
| POST   | /api/auth/register              | Public       | Register a new user                |
| POST   | /api/auth/login                 | Public       | Login and receive JWT              |
| GET    | /api/templates/public           | Public       | Get all public templates           |
| GET    | /api/templates/mine             | Authenticated| Get your own templates             |
| POST   | /api/templates                  | Authenticated| Create a template                  |
| PUT    | /api/templates/{id}             | Authenticated| Update a template                  |
| DELETE | /api/templates/{id}             | Authenticated| Delete a template                  |
| POST   | /api/templates/{id}/fork        | Authenticated| Fork a template                    |
| GET    | /api/versions/template/{id}     | Authenticated| Get version history                |
| POST   | /api/versions/template/{id}     | Authenticated| Publish a new version              |
| DELETE | /api/versions/{id}              | Authenticated| Delete a version                   |
| GET    | /api/collections/mine           | Authenticated| Get your collections               |
| POST   | /api/collections                | Authenticated| Create a collection                |
| POST   | /api/collections/{id}/sync      | Authenticated| Sync templates in a collection     |
| DELETE | /api/collections/{id}           | Authenticated| Delete a collection                |
| GET    | /api/categories                 | Public       | Get all categories                 |
| POST   | /api/categories                 | TEAM_LEAD    | Create a category                  |
| PUT    | /api/categories/{id}            | TEAM_LEAD    | Update a category                  |
| DELETE | /api/categories/{id}            | TEAM_LEAD    | Delete a category                  |
| POST   | /api/ai/optimize                | Authenticated| Optimize a prompt with Gemini AI   |


