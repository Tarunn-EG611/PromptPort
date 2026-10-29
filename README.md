<img width="1917" height="1017" alt="Screenshot 2026-10-27 235617" src="https://github.com/user-attachments/assets/a5f69788-9f37-44ae-9974-171e908c7e74" />
<img width="1917" height="1007" alt="Screenshot 2026-10-27 235549" src="https://github.com/user-attachments/assets/2f3f8e95-10e8-40b5-823a-6102dc2f2c63" />
<img width="1917" height="1077" alt="Screenshot 2026-10-27 235414" src="https://github.com/user-attachments/assets/2fb4c6c8-ae0a-4369-b694-999d9c7e985a" />
<img width="1917" height="1077" alt="Screenshot 2026-10-27 130926" src="https://github.com/user-attachments/assets/bcd33c1a-55bf-4eb6-8968-7db4ade539e9" />
<img width="1917" height="1077" alt="Dashboard" src="https://github.com/user-attachments/assets/7de55dc1-8b7c-457b-a287-bc0062f34c5b" />
<h1 align="center">PromptPort</h1>

<p align="center">
  <strong>A full-stack prompt engineering studio to design, version, optimize, and organize production-ready AI prompt templates.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-orange.svg" alt="Java 17" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg" alt="Spring Boot 3" />
  <img src="https://img.shields.io/badge/React-19-blue.svg" alt="React 19" />
  <img src="https://img.shields.io/badge/Redux%20Toolkit-2.x-purple.svg" alt="Redux Toolkit" />
  <img src="https://img.shields.io/badge/MySQL-8.0-blue.svg" alt="MySQL 8" />
  <img src="https://img.shields.io/badge/AI-Google%20Gemini-4285F4.svg" alt="Google Gemini API" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License: MIT" />
</p>

---

## Overview

As teams and developers build LLM-powered applications, managing prompts across scattered notes, text files, or chat histories leads to lost context and inconsistent outputs.

**PromptPort** brings production engineering principles to prompt development. It provides an end-to-end studio to craft, test, version-control, organize, and share prompts with integrated **Google Gemini AI optimization**.

---

## Key Features

### Dual-Column Creation Studio

* **Live Variable Scanner:** Automatically detects dynamic placeholders (such as `{{topic}}` or `{{audience}}`) as you type.
* **1-Click Variable Inserter:** Quick-insert chips to append tokens directly into prompt templates.
* **Prompt Readiness Meter:** Real-time checklist and progress bar tracking prompt completeness.
* **Live Token and Word Metrics:** Dynamic character, word, and estimated token counters.
* **Starter Blueprints:** 1-click architecture presets (Code Reviewer, Executive Summary, JSON Extractor).

### AI Prompt Optimization

* Integrated with the **Google Gemini API** via reactive `Spring WebClient`.
* One-click prompt enhancement analyzing structure, clarity, and instructions with instant diff previews.

### Version Control and Forking

* Track iterations and revisions for every template.
* Label target model providers (**Google Gemini**, **Claude**, **ChatGPT**, **Llama 3**, **Mistral**).
* Fork public community templates into personal accounts.

### Custom Collections and Curation

* Organize templates into personal workspaces with capacity utilization progress bars.
* Search-enabled modal to sync and bulk-manage templates within collections.

### Role-Based Access Control (RBAC)

* Stateless authentication using **Spring Security** and signed **JWT** tokens.
* Self-service registration: anyone can create their own account and sign in.
* Three distinct roles: `PROMPT_ENGINEER`, `PROMPT_COLLECTOR`, and `TEAM_LEAD`.

### Modern Studio Design System

* High-contrast dark studio aesthetic with electric violet/indigo accents.
* Interactive dark/light theme toggle with persistent user preferences in `localStorage`.
* Fully responsive layout built with pure CSS custom properties.

---

## Architecture and Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Redux Toolkit, React Router 6, Axios, Custom CSS Tokens |
| **Backend** | Java 17, Spring Boot 3, Spring Security, Spring Data JPA / Hibernate |
| **Database** | MySQL 8.0 |
| **AI Integration** | Google Gemini API (via Spring WebClient) |
| **Authentication** | Stateless JWT (JSON Web Tokens) |
| **Build Tools** | Apache Maven, npm |

---

## Roles and Permissions Matrix

| Feature | PROMPT_ENGINEER | PROMPT_COLLECTOR | TEAM_LEAD |
| :--- | :---: | :---: | :---: |
| Browse Public Library | Yes | Yes | Yes |
| Create and Edit Own Templates | Yes | Yes | Yes |
| Fork Public Templates | Yes | Yes | Yes |
| Publish New Versions | Yes | Yes | Yes |
| AI Prompt Optimization (Gemini) | Yes | Yes | Yes |
| Manage Personal Collections | Yes | Yes | Yes |
| Delete Any Version | No | No | Yes |
| Manage Taxonomy Categories | No | No | Yes |

---

## Prerequisites

* **Java:** JDK 17 or higher
* **Node.js:** v18.0 or higher
* **MySQL:** v8.0 or higher
* **Apache Maven:** 3.8+ (or bundled wrapper)
* **Google Gemini API Key:** [Get an API key](https://aistudio.google.com/)

---

## Quick Start

### 1. Database Setup

Ensure MySQL is running and create the database:

```sql
CREATE DATABASE prompt_port;
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Configure your environment variables:

**Linux / macOS:**

```bash
export DB_URL="jdbc:mysql://localhost:3306/prompt_port"
export DB_USERNAME="root"
export DB_PASSWORD="your_mysql_password"
export JWT_SECRET="your_base64_jwt_secret"
export GEMINI_API_KEY="your_gemini_api_key"
```

**Windows (PowerShell):**

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/prompt_port"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
$env:JWT_SECRET="your_base64_jwt_secret"
$env:GEMINI_API_KEY="your_gemini_api_key"
```

Run the backend server:

```bash
mvn spring-boot:run
```

The REST API will start on `http://localhost:8080`.

> **Note:** Users can create their own account from the registration page (or via `POST /api/auth/register`) and choose a role. For quick testing, the backend also seeds 3 demo accounts and 5 initial categories on its first launch:

| Username | Password | Role |
| :--- | :--- | :--- |
| `engineer` | `engineer123` | `PROMPT_ENGINEER` |
| `lead` | `lead123` | `TEAM_LEAD` |
| `collector` | `collector123` | `PROMPT_COLLECTOR` |

### 3. Frontend Setup

In a new terminal window, navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm start
```

The application will launch in your browser at `http://localhost:3000`.

---

## REST API Reference

**Base URL:** `http://localhost:8080/api`

### Authentication

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | None | Register a new user |
| `POST` | `/auth/login` | None | Authenticate and obtain JWT token |

### Templates

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/templates/public` | None | Fetch all public templates |
| `GET` | `/templates/mine` | User | Fetch templates owned by current user |
| `GET` | `/templates/{id}` | User | Fetch template details by ID |
| `POST` | `/templates` | User | Create a new template |
| `PUT` | `/templates/{id}` | Owner | Update an existing template |
| `DELETE` | `/templates/{id}` | Owner | Delete a template |
| `POST` | `/templates/{id}/fork` | User | Fork a template to user's library |

### Versions

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/versions/template/{id}` | User | Get version history for a template |
| `POST` | `/versions/template/{id}` | User | Publish a new prompt version |
| `DELETE` | `/versions/{id}` | Team Lead / Owner | Delete a specific version |

### Collections

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/collections/mine` | User | Get current user's collections |
| `POST` | `/collections` | User | Create a new collection |
| `POST` | `/collections/{id}/sync` | User | Add or remove templates in collection |
| `DELETE` | `/collections/{id}` | User | Delete a collection |

### Categories

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/categories` | None | List all categories |
| `POST` | `/categories` | Team Lead | Create a new category |
| `PUT` | `/categories/{id}` | Team Lead | Update category details |
| `DELETE` | `/categories/{id}` | Team Lead | Remove a category |

### AI Optimization

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/ai/optimize` | User | Optimize prompt using Google Gemini API |

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
