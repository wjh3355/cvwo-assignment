# TalkSpace

This repo contains the source code for [**TalkSpace**](https://talkspace-cvwo.netlify.app/), a web forum inspired by [Reddit](https://www.reddit.com/) that allows users to make topics, post content, comment, and vote on submissions (posts and comments). TalkSpace does not require users to create an account or log in to view posts and comments. However, one does need an account to create topics and posts, comment, and vote.

## Code Structure

This is a monorepo containing the client code in the `client/` directory and the server code in the `server/` directory.

## Client

The client-facing website is built using [React](https://react.dev/) (with [Vite](https://vite.dev/)) and TypeScript. Major libraries/technologies used include:

- [React Router](https://reactrouter.com/) for routing and navigation
- [Axios](https://axios-http.com/) for making HTTP requests to backend
- [TanStack Query](https://tanstack.com/query/latest) for data fetching and state management
- [Tailwind CSS](https://tailwindcss.com/) for easy styling
- [Material UI (MUI)](https://mui.com/) for premade UI components
- [React Hook Form](https://react-hook-form.com/) for form handling (login, signup, post/comment creation/editing)

### File Structure

```text
client/
├── public/                
│   └── _redirects      # For Netlify to redirect all routes to index.html, for SPA structure to work (React Router handles routing)
├── src/
│   ├── components /
│   │   ├── auth/         # Authentication components (login, register pages, handler functions)
│   │   ├── new/     # New post/comment creation components
│   │   ├── post/        # Post-related components (post display page)
│   │   ├── topic/      # Topic-related components (page where all posts under a topic are displayed)
│   │   ├── voting/      # Voting-related components (upvote/downvote + vote count display)
│   │   └── Other files (Generic error and loading components, home page, main layout container, navbar, 404 page)
│   ├── hooks/            # Custom React hooks (useFetch (an abstraction on top of useQuery from TanStack Query), useUser (gets identity of user, if logged in))
│   ├── App.tsx        # Main app component where routes are defined
│   ├── main.tsx     # Entry point
│   ├── types.ts     # Type definitions
│   ├── config.ts     # Configuration settings (axios instance etc)
│   ├── utils.ts     # Utility functions (capitalise, format date etc)
│   └── index.css     # Global CSS styles (just imports Tailwind CSS for now)
├── package.json        # Specifies dependencies
└── other config files (vite config, TS config, ESLint config...)
```

### Routes

- `/` - Home page displaying a list of topics
- `/:topic` - Displays all posts under the specified topic (+ create new post form, if logged in)
- `/:topic/:postId` - Displays specific post and its comments (+ create new comment form, if logged in)
- `/auth` - Login page
- `/auth/register` - Registration page

## Server

The backend server is a [Gin](https://gin-gonic.com/en/) (Golang) application. Every endpoint exposed starts with `/api`. It exposes RESTful API endpoints requested by the client.

### Authentication

Authentication is handled using Json Web Tokens (JWTs) using HTTP-Only Cookies for storage. Upon successful login/registration, the server generates a JWT and sends it to the client. The client includes this JWT in every subsequent request to authenticate the user.

#### Authentication Endpoints

- `POST /api/login` - Logs in a user. The client sends the user's username and password in the request body. The server compares the *hashed* password with the stored hash in the database. If it matches, a JWT is generated and sent back to the client with a status code of 200 (success).
- `POST /api/register` - Registers a new user. The client sends the desired username and password in the request body. The server hashes the password and attempts to store the new user in the database. If a user with the same username already exists, a 409 (conflict) status code is returned. If registration is successful, a JWT is generated and sent back to the client with a status code of 200 (success).
- `POST /api/logout` - Logs out a user by invalidating the JWT cookie.
- `GET /api/check-auth` - Checks if the user is authenticated by verifying the JWT cookie (this is called by `useUser` on the client, see above). If valid, returns user information with status code 200 (success).

### Middleware

The backend utilises 3 different middleware functions:

- `middleware.TimeOutMiddleware()` - Sets a 3 second timeout for each request. If the request takes longer than this, it is aborted. This is to prevent long requests from hanging the server, and also to improve UX by ensuring requests are responded to quickly.
- `middleware.SoftAuthMiddleware()` - Checks for the presence of a valid JWT cookie. If present and valid, it extracts user information and attaches it to the request context with a `isAuthenticated=true` flag. If not present or invalid, it **allows the request to proceed** without user information (and sets `isAuthenticated=false`).
- `middleware.HardAuthMiddleware()` - Same as SoftAuthMiddleware, but if the JWT cookie is not present or invalid, it **aborts the request** and returns a 401 (unauthorized) status code.

Having two different authentication middleware functions enables both protected and unprotected routes. Create, updating and deleting operations require the user to be authenticated (HardAuthMiddleware), whereas simply reading posts/comments does not (SoftAuthMiddleware). If the user is authenticated, we still want their identity so we can display the appropriate UI (show edit/delete buttons for own posts/comments, and also highlight their vote direction).

### Other Endpoints

- `GET /api/topics` - Retrieves a list of all available topics.
- `POST /api/topics` - Creates a new topic. Requires hard authentication.
- `GET /api/posts/:topic` - Retrieves all posts under the specified topic, including the number of comments, votes (num of upvotes - num of downvotes), and the user's vote (if authenticated) for each post. Uses soft authentication.
- `POST /api/posts` - Creates a new post. Requires hard authentication.
- `PATCH /api/posts` - Edits an existing post. Requires hard authentication.
- `DELETE /api/posts` - Deletes an existing post. Requires hard authentication.
- `GET /api/comments/:postId` - Retrieves all comments under the specified post, including the number of votes (num of upvotes - num of downvotes), and the user's vote (if authenticated) for each comment. Uses soft authentication.
- `POST /api/comments` - Creates a new comment. Requires hard authentication.
- `PATCH /api/comments` - Edits an existing comment. Requires hard authentication.
- `DELETE /api/comments` - Deletes an existing comment. Requires hard authentication.
- `POST /api/vote` - Casts/updates/removes a vote (upvote/downvote) on a post or comment. Requires hard authentication.

## Database

The project uses a [PostgreSQL](https://www.postgresql.org/) relational database to store user, topic, post, comment and vote data. The database schema is as follows. If the diagram is not rendering, make sure your markdown viewer supports [Mermaid](https://mermaid.js.org/) diagrams.

**NOTE: The postgres database hosted on Render expires on 14/2/2026 due to free tier constraints. The site may not function properly from that date onwards.**

```mermaid
erDiagram

   TOPICS {
      int id PK
      string name
   }

   USERS {
      int id PK
      string username
      string password_hash
      timestamp created_at
   }

   POSTS {
      int id PK
      int topic FK
      int posted_by FK
      string title
      string description
      timestamp posted_on
   }

   POST_VOTES {
      int post_id FK
      int user_id FK
      int vote_value
   }

   COMMENTS {
      int id PK
      int post_id FK
      int commented_by FK
      string content
      timestamp commented_on
   }

   COMMENT_VOTES {
      int comment_id FK
      int user_id FK
      int vote_value
   }

   USERS ||--o{ TOPICS : creates
   USERS ||--o{ POSTS : creates
   USERS ||--o{ COMMENTS : writes

   TOPICS ||--o{ POSTS : contains

   POSTS ||--o{ COMMENTS : has
   POSTS ||--o{ POST_VOTES : receives

   USERS ||--o{ POST_VOTES : casts
   USERS ||--o{ COMMENT_VOTES : casts

   COMMENTS ||--o{ COMMENT_VOTES : receives
```

## Deployment

The application is currently deployed on [Netlify](https://www.netlify.com/) (client) and [Render](https://render.com) (server). The PostgreSQL database is also hosted on Render.

## Local Setup

You will need [Node.js](https://nodejs.org/en/) and [Go](https://go.dev/) installed on your machine.

You will also need to install PostgreSQL. On Linux, you can run:

```bash
sudo apt update
sudo apt install postgresql-client
```

1. Clone the repository:

```bash
git clone https://github.com/wjh3355/cvwo-assignment
cd cvwo-assignment/
```

2. Install the required npm modules for the frontend:

```bash
cd client/
npm i
```

3. Create a `.env` file under the current `client/` directory and add the following environment variable to it:

```text
VITE_API_URL="http://localhost:8080"
```

4. Install the required Go modules for the server:

```bash
cd ../server/
go mod download
go mod verify # To verify if installation was complete
```

5. Log in to Postgres and create a new user and database:

```bash
psql -U postgres
```

```sql
CREATE ROLE cvwo_user WITH LOGIN PASSWORD 'a-secure-password';
CREATE DATABASE cvwo_db OWNER cvwo_user;
```

6. Dump the database schema to the newly created database:

```bash
psql -U cvwo_user -d cvwo_db -f ../init_db.sql
```

7. Create a `.env` file under the current `server/` directory and add the following environment variables to it:

```text
DATABASE_URL="postgresql://cvwo_user:a-secure-password@localhost:5432/cvwo_db" (replace with your own password if different)
JWT_SECRET="some-very-secure-key"
FRONTEND_URL="http://localhost:5173"
```

8. Start the backend server:

```bash
go run cmd/server/main.go
```

9. Open a new terminal window, navigate to the `client/` directory and start the frontend development server:

```bash
npm run dev
```

10. Open your browser and navigate to `http://localhost:5173`!

## Future Improvements

Many features in this project (especially UI/UX) have not been fully polished. Potential future improvements include:

- UI touch ups, Dark mode and mobile responsiveness
- Search bar to search for posts and comments by keywords
- User profiles to view a particular user's posts and comments
- Ability to comment on comments (nested comments, like in reddit)

## AI Declaration

I hereby declare that ChatGPT and Gemini were used in the project in the following ways:

- What the most common MUI components are and how to use them (Container, Box, Button, Card, etc)
- How generic types work in TypeScript (used in useFetch)
- How generic function components work (used in GenericVoteDisplay)

- Learn how JWT-based authentication works and why HTTP-Only cookies are preferred for storing them
- Learn how to implement middleware and routes in Gin
- Learn how structs, struct tags and pointers work in Go
- Learn how generic types work in Go
- Learn what CORS is

- How to set up a local PostgreSQL database in Ubuntu
- Learn why using separate vote tables is more efficient than storing vote counts (and who casted them) in the posts/comments tables
- How subqueries work in SQL
- The order of keywords in SQL statements (WHERE, JOIN, GROUP BY, ORDER BY...) and special clauses like ON CONFLICT, CASE WHEN etc

- How Mermaid syntax works in markdown

- How to migrate a local PostgreSQL database to a cloud-hosted one

Last updated: 17/1/2026
