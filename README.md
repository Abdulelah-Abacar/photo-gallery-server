# Photo Gallery API 📸

A robust and secure RESTful API for a photo gallery application built with
Node.js, Express, and MongoDB. Features user authentication, photo uploads with
Vercel Blob storage, likes, and user management.

## 🚀 Features

- **User Authentication** - JWT-based registration and login
- **Photo Management** - Upload, view, update, and delete photos
- **Cloud Storage** - Image uploads to Vercel Blob for scalable storage
- **Like System** - Users can like/unlike photos
- **User Profiles** - Get current user info and user-specific photos
- **Security** - Password hashing, JWT tokens, and CORS protection
- **Error Handling** - Comprehensive error handling and validation

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Vercel Blob
- **Security**: bcryptjs for password hashing
- **File Upload**: Multer for handling multipart/form-data

## 📁 Project Structure

```
photo-gallery-server/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authControllers.js   # Authentication logic
│   ├── photoControllers.js  # Photo CRUD operations
│   └── userControllers.js   # User management
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── errorHandler.js      # Global error handling
│   └── upload.js            # File upload configuration
├── models/
│   ├── Photo.js             # Photo schema
│   └── User.js              # User schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── photo.js             # Photo routes
│   └── user.js              # User routes
├── .env.example             # Environment variables template
├── index.js                 # Application entry point
└── package.json             # Dependencies and scripts
```

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Vercel Account (for Blob storage)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd photo-gallery-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and configure the following
variables:

```env
# Database
MOGODB_URI=mongodb://localhost:27017/photo-gallery

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION_DATE=7d

# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# Vercel Blob (Required for production)
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

### 4. Start the Server

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

The server will run on `http://localhost:5000`

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint    | Description       | Body                      |
| ------ | ----------- | ----------------- | ------------------------- |
| POST   | `/register` | Register new user | `{name, email, password}` |
| POST   | `/login`    | User login        | `{email, password}`       |

### Photo Routes (`/api/photos`)

| Method | Endpoint            | Description       | Auth Required |
| ------ | ------------------- | ----------------- | ------------- |
| GET    | `/`                 | Get all photos    | No            |
| POST   | `/`                 | Upload new photo  | Yes           |
| PUT    | `/:id`              | Update photo      | Yes           |
| DELETE | `/:id`              | Delete photo      | Yes           |
| POST   | `/:id/like`         | Like/unlike photo | Yes           |
| GET    | `/users/:id/photos` | Get user's photos | Yes           |

### User Routes (`/api/users`)

| Method | Endpoint | Description      | Auth Required |
| ------ | -------- | ---------------- | ------------- |
| GET    | `/me`    | Get current user | Yes           |

## 📋 API Usage Examples

### User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### User Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Upload Photo

```bash
curl -X POST http://localhost:5000/api/photos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "photo=@/path/to/your/image.jpg" \
  -F "title=Beautiful Sunset" \
  -F "description=Captured at the beach"
```

### Get All Photos

```bash
curl -X GET http://localhost:5000/api/photos
```

## 🔒 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📁 File Upload

- **Supported Formats**: JPEG, JPG, PNG
- **Max File Size**: 5MB (configurable via `MAX_FILE_SIZE`)
- **Storage**: Files are uploaded to Vercel Blob and URLs are stored in MongoDB

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP Status Codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🛠️ Development

### Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **@vercel/blob** - Cloud file storage
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 🌐 Deployment

### Environment Variables for Production

Ensure these are set in your production environment:

- `MOGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secure random string for JWT
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob token
- `FRONTEND_URL` - Your frontend domain

### Vercel Blob Setup

1. Create a Vercel account
2. Create a new project and get your `BLOB_READ_WRITE_TOKEN`
3. Add the token to your environment variables
