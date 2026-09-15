# BlogSphere

A full-stack blogging platform where users can write, share, and engage with blog posts. Built with the **MERN** stack (MongoDB, Express.js, React, Node.js), featuring secure JWT authentication, image uploads via Cloudinary, and a clean, responsive UI.

> **Live Demo:** [https://blog-sphere-one-delta.vercel.app/]  
> **Backend API:** [https://blogsphere-elw4.onrender.com]

---

## Features

- **User Authentication** — Sign up, sign in, and sign out with JWT-based sessions. Passwords are hashed using HMAC-SHA256 with per-user salts.
- **Create Blog Posts** — Write posts with a title, content, and cover image.
- **Image Uploads** — Cover images are uploaded and stored on Cloudinary, with a 5 MB size limit and image-only file filter.
- **Browse & Read** — View all published blogs in reverse-chronological order.
- **Comments** — Authenticated users can comment on blog posts; comments are displayed newest-first.
- **User Roles** — Built-in `User` / `Admin` role field for future access-control extensions.
- **Responsive Frontend** — React 19 + Vite with client-side routing.
- **REST API** — Clean, modular Express routes with proper HTTP status codes and error handling.

---

## Tech Stack

### Backend

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v5 |
| Database | MongoDB (Mongoose v8) |
| Authentication | JSON Web Tokens (jsonwebtoken), HMAC-SHA256 |
| File Upload | Multer + multer-storage-cloudinary |
| Image Storage | Cloudinary |
| Environment | dotenv |
| CORS | cors |
| Dev Tool | Nodemon |

### Frontend

| Layer | Technology |
|---|---|
| Library | React 19 |
| Build Tool | Vite 8 |
| Routing | React Router v7 |
| Linting | ESLint |
| Environment | dotenv |

---

## Project Structure

```
BlogSphere/
├── Backend/
│   ├── middlewares/
│   │   └── authentication.js      # JWT verification middleware
│   ├── models/
│   │   ├── blog.js                # Blog schema
│   │   ├── comment.js             # Comment schema
│   │   └── user.js                # User schema with password hashing
│   ├── public/                    # Static assets
│   ├── routes/
│   │   ├── blog.js                # Blog & comment routes
│   │   └── user.js                # Auth routes (signin/signup/signout)
│   ├── services/
│   │   └── authentication.js      # JWT create/validate helpers
│   ├── app.js                     # Express app entry point
│   ├── package.json
│   └── .gitignore
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
│
├── .gitignore
└── README.md
```

---

## API Endpoints

### User Routes — `/api/user`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/signin` | Authenticate user, returns JWT token | No |
| `POST` | `/signup` | Register a new user | No |
| `GET` | `/signout` | Clear authentication cookie | No |

### Blog Routes — `/api/blog`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/all` | Fetch all blogs (newest first) | No |
| `GET` | `/:id` | Fetch a single blog with its comments | No |
| `POST` | `/add-new` | Create a new blog post (multipart/form-data) | Yes |
| `POST` | `/comment/:blogId` | Add a comment to a blog | Yes |

### Root

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check — returns current user + all blogs |

---

## Authentication Flow

1. **Sign Up** → `POST /api/user/signup` with `fullName`, `email`, `password`.  
   The password is hashed with a random 16-byte salt using `createHmac("sha256", salt)` before storage.

2. **Sign In** → `POST /api/user/signin` with `email`, `password`.  
   On success, the server returns a JWT signed with `HS256`, expiring in **1 hour**. The token payload contains `_id`, `email`, `profileImageURL`, and `role`.

3. **Authenticated Requests** → Include the token in the `Authorization` header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```
   The `checkForAuthenticationCookie` middleware validates the token and attaches the user payload to `req.user`.

4. **Sign Out** → `GET /api/user/signout` clears the `token` cookie.

---

## Database Models

### User

```js
{
  fullName:      String (required),
  email:         String (required, unique),
  salt:          String,
  password:      String (required),   // hashed
  profileImgURL: String,              // default Cloudinary image
  role:          String,              // enum: ["User", "Admin"], default: "User"
  timestamps:    true
}
```

### Blog

```js
{
  title:         String (required),
  content:       String (required),
  coverImageURL: String,
  createdBy:     ObjectId (ref: "user", required),
  timestamps:    true
}
```

### Comment

```js
{
  content:    String (required),
  blogId:     ObjectId (ref: "blog"),
  createdBy:  ObjectId (ref: "user"),
  timestamps: true
}
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** — local instance or a MongoDB Atlas cluster
- **Cloudinary** account (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/brajeshjars124/BlogSphere.git
cd BlogSphere
```

### 2. Set Up the Backend

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```env
PORT=8000
MONGO_URL=mongodb://localhost:27017/blogsphere
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
API_SECRET=your_api_secret
```

Start the backend server:

```bash
npm run dev
```

The API will run at `http://localhost:8000`.

### 3. Set Up the Frontend

```bash
cd ../Frontend
npm install
```

Create a `.env` file in `Frontend/`:

```env
VITE_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

## Scripts

### Backend

| Command | Description |
|---|---|
| `npm start` | Run the server with Node |
| `npm run dev` | Run with Nodemon (auto-restart) |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## Key Implementation Details

- **Password Security** — No plaintext passwords. Each user gets a unique salt; the stored hash is `HMAC-SHA256(salt, password)`.
- **JWT Expiry** — Tokens expire after 1 hour. The frontend should handle 401 responses and redirect to login.
- **Image Validation** — Only `image/*` MIME types are accepted. File size is capped at 5 MB.
- **CORS** — Configured to allow credentials from the frontend origin (`FRONTEND_URL`) with methods `GET, POST, PUT, DELETE, OPTIONS`.
- **Cloudinary Folder** — All uploads go to the `blogify_uploads` folder with allowed formats `jpg`, `png`, `jpeg`, `webp`.

---

## Roadmap

- [ ] Edit and delete blog posts (author-only)
- [ ] Like / upvote system
- [ ] User profile pages with post history
- [ ] Search and filter blogs by title or author
- [ ] Admin dashboard for content moderation
- [ ] Refresh token mechanism (currently 1-hour expiry with no renewal)
- [ ] Rate limiting on auth endpoints
- [ ] Unit and integration tests

---

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request.

Please make sure your code passes `npm run lint` in the frontend and follows the existing project structure.

---

## License

This project is open source and available under the **MIT License**.

---

## Author

**Brajesh Jarsoniya**  
GitHub: [@brajeshjars124](https://github.com/brajeshjars124)

---

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Cloudinary](https://cloudinary.com/)
- [JWT](https://jwt.io/)

---

⭐ If you found this project useful, consider giving it a star on GitHub.
