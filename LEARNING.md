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
