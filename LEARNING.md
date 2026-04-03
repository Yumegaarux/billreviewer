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
