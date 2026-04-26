# You've reached learning MD! 
This is where me and my team will log everything that we learned in the process of creating the system.
(Note: The comments in other pages)

--- 

-Yume

## Make sure your React project has a Dockerfile inside it:
March 14, 2026

Before making docker work on my system, I had some issues on running React and PHP. One of the issue 
in particular was dockerfile wasn't inside the same folder as frontend (where all the react code is).

Another one of them was 

## sh: 1: vite: not found 

**Cause**: Volume mapping was replacing the container's `node_modules` directory with your local frontend files that didn't contain the required dependencies.

**Solution**: Updated compose.yaml to preserve the installed node_modules inside the container:

```js
    volumes:
  - ./frontend:/app
  - /app/node_modules  # Preserve node_modules inside container
```

## 404 Error on http://localhost:9000/ 

**Cause**: Incorrect root: 'frontend' configuration in vite.config.js made Vite look for files in a non-existent subdirectory.

**Solution**: Fixed vite.config.js with proper server configuration:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 9000,
    host: '0.0.0.0',
  },
})
```
---

## What exactly does Docker do?
Docker is basically a machine inside your machine. You write a recipe (the docker-compose.yml) that describes what services you need — a database, a PHP server, a frontend — and Docker spins each one up in its own isolated box called a container.
The containers can talk to each other using their service names as hostnames. But by default, they're invisible to the outside world (your browser, Workbench, etc.). The ports setting is what punches a hole so you can reach in.

<img width="1440" height="1102" alt="image" src="https://github.com/user-attachments/assets/74c08ff0-ce86-4106-98c6-e09e5486e678" />

### Breaking it down
Inside Docker, containers talk to each other using service names. So in your docker-compose.yml, if you name your database service db, your PHP container connects to it at host db, port 3306 — never localhost. Docker handles that DNS internally.
The ports: setting is what makes something reachable from your machine. The format is always:

```
"your_machine_port : container_port"
```

So "3306:3306" means: "when I go to localhost:3306 on my machine, forward me into the container's port 3306." That's how Workbench reaches MySQL — it hits 127.0.0.1:3306 on your machine, Docker forwards it in.

If a service has no ports: entry (like PHP in most setups), it's only reachable by other containers inside Docker — not by you directly. That's actually fine and intentional.

The volume (db_data:/var/lib/mysql) is what makes your data survive. Without it, every time you run docker compose down, your database gets wiped. The volume stores the actual data files on your machine, outside the container.

***The boot-up sequence***

```
docker compose up
  → MySQL container starts  → data loads from volume
  → PHP container starts    → connects to "db:3306"
  → Vite container starts   → connects to PHP

    You open Workbench         → connects to localhost:3306
    You open browser           → hits localhost:5173
```

When you write "3306:3306" in docker-compose, you're telling Docker: "expose this container's port to my local machine." It never leaves your computer. Your machine and the container are on the same physical hardware — Docker is just bridging two virtual network spaces on the same box.

```
your machine ──► Docker container
(same computer, two virtual networks)
```
## How does the Advanced MVC Work here?
The backend will use an advanced version of MVC instead of using a basic one. It's structured, scalable, and shows you understand separation of concerns.

```bash
index.php         ← router (handles all requests, directs traffic)
Database.php      ← singleton DB connection
BaseModel.php     ← reusable CRUD for all tables
User.php          ← specific model, extends BaseModel
```

What usually happens here is: 

**1. a frontend view will call do an API call**

That API call will be protected quite well because it will use an endpoint in api.js (where all the API paths are usually stored). This is also where the API endpoints are going to be classified, it is classified as there is an JavaScript object (key value pairs) that specifices the value, which will later on be used in index.php.

```js 
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  LOGOUT: '/api/logout',
  USERS: '/api/users',
  RESEARCH: '/api/research',
  RESEARCH_REVIEW: '/api/research-review',
  RESEARCH_REVISIONS: '/api/research-revisions',
  REVISION_COMMENTS: '/api/revision-comments',
  REVISIONS: '/api/revisions',
  COMMENTS: '/api/comments',
  TEXT_COMMENTS: '/api/text-comments',
  COMMENT_REPLIES: '/api/comment-replies',
  TEMPLATES: '/api/templates',
};

```

This is how it's usually called in the views: 

```js 
const response = await apiCall(API_ENDPOINTS.USERS);
```

**2. That API call will trigger a switch case on index.php**

There will be a use case waiting in index.php that will receive the endpoint type that was used in one of the views and used the object containing endpoints. Once that is passed onto index.php, that value will be sliced:

```php
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// -------------------------------------------------------------
// SMART ROUTING FIX
// -------------------------------------------------------------

// 1. Identify the "Project Folder" (Base Path)
// We calculate where index.php lives relative to the server root
$scriptName = dirname($_SERVER['SCRIPT_NAME']); // Output: /researchSubReact-main/backend/public

// 2. Remove that folder path from the Request URI
// Before: /researchSubReact-main/backend/public/api/auth
// After:  /api/auth
if (strpos($requestUri, $scriptName) === 0) {
    $requestUri = substr($requestUri, strlen($scriptName));
}

// 3. Clean up slashes and split
$pathParts = explode('/', trim($requestUri, '/')); 

// 4. Handle the "api" prefix
// If the first part is "api", throw it away so we get "auth"
if (!empty($pathParts) && $pathParts[0] === 'api') {
    array_shift($pathParts); 
}

$endpoint = $pathParts[0] ?? '';
$id = $pathParts[1] ?? null;
$action = $pathParts[2] ?? null;
```
---
## 2 AI messages?

**`role` — who is speaking**
**`content` — what they're saying**

## Why you have both system and user

They serve completely different purposes:

**`system`** — sets the rules and personality of the AI **before** the conversation starts. The AI never "speaks" this, it just internalized it as instructions.

```jsx
{ role: "system", content: "You are a civic education assistant..." }
```
This is like a job briefing. You're telling the AI *"this is who you are and how you should behave."*

**`user`** — the actual request you're sending, like a real person typing a message.

```jsx
{ role: "user", content: "Explain this Philippine Senate bill..." }
```
This is the actual question being asked.

## Analogy

Think of it like hiring a customer service rep:

```
system  →  "You are a customer service rep. 
            Be polite. Keep answers short. 
            Only talk about our products."       ← the job briefing

user    →  "Hi, how do I return my order?"      ← customer's actual message

assistant → "Sure! Here's how to return..."     ← rep's response
```

## Why not just put everything in `user`?

You technically could:

```jsx
{ 
  role: "user", 
  content: `You are a civic assistant. Explain this bill: ${bill.long_title}` 
}
```

But separating them is better because:
- `system` instructions are weighted more heavily by the AI
- It's cleaner and easier to maintain
- You can change the bill data in `user` without touching your instructions in `system`

---

Notes:
- When database connection not working, check docker logs using:
```bash
  docker compose ps
```
- compose down -v does two things in one command:
```bash
  docker compose down -v
```
down — stops and removes your containers
-v — also deletes the volumes attached to those containers
(So using these when there's data inside the DB is a bit dangerous.)
- Modern Architectures usually use 1 dockerfile per service (frontend, backend).
- The use of advanced MVC typically uses composer.
