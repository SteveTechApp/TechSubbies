# TechSubbies.com - Backend API Specification

This document outlines the API contract required by the TechSubbies.com frontend application. The existing frontend is built against this specification, using the `apiService.ts` and `realtimeService.ts` as clients.

## 1. Authentication (JWT)

The API must be secured using JSON Web Tokens (JWT).

### `POST /api/auth/login`
Authenticates a user and returns a JWT.
- **Request Body:** `{ "email": "user@example.com", "password": "password123" }`
- **Success Response (200):** `{ "token": "...", "user": { ...UserProfile } }`
- **Error Response (401):** `{ "error": "Invalid credentials" }`

### `POST /api/auth/register`
Registers a new user.
- **Request Body:** `{ "role": "Engineer", "profileData": { ... } }`
- **Success Response (201):** `{ "token": "...", "user": { ...UserProfile } }`

All subsequent authenticated requests must include the token in the `Authorization` header:
`Authorization: Bearer <your_jwt_token>`

---

## 2. REST API Endpoints

All endpoints should be prefixed with `/api`.

### Users & Profiles
- `GET /users`: Get a list of all user profiles (for search, etc.).
- `GET /users/:profileId`: Get a single user profile.
- `PATCH /users/me`: Update the currently authenticated user's profile.
  - **Request Body:** `Partial<EngineerProfile | CompanyProfile>`

### Jobs
- `GET /jobs`: Get a list of all active jobs. Supports query params for filtering.
- `POST /jobs`: Create a new job posting (requires Company role).
- `PATCH /jobs/:jobId`: Update a job posting.

### Applications
- `POST /jobs/:jobId/apply`: Submit an application for a job (requires Engineer role).

### Contracts
- `GET /contracts`: Get all contracts for the authenticated user.
- `POST /contracts`: Create a new draft contract.
- `POST /contracts/:contractId/sign`: E-sign a contract.
- `POST /contracts/:contractId/milestones/:milestoneId/fund`: Fund an escrow milestone.
- `POST /contracts/:contractId/milestones/:milestoneId/approve`: Approve a completed milestone.

---

## 3. File Uploads (Cloud Storage Integration)

File uploads must follow a secure, two-step pattern to avoid passing large files through the backend server.

### 1. `POST /api/uploads/presigned-url`
Request a secure, temporary URL to upload a file directly to the cloud storage provider (e.g., AWS S3).
- **Request Body:** `{ "fileName": "my_cv.pdf", "fileType": "application/pdf" }`
- **Success Response (200):** `{ "uploadUrl": "https://s3...", "fileUrl": "https://cdn..." }`
  - `uploadUrl`: The URL the client will `PUT` the file to.
  - `fileUrl`: The final, public URL of the file after upload.

### 2. `POST /api/uploads/confirm`
The client calls this endpoint *after* successfully uploading the file to the `uploadUrl`. The backend uses this to link the `fileUrl` to the correct entity in the database (e.g., a user's CV).
- **Request Body:** `{ "fileUrl": "https://cdn...", "context": { "entityId": "user-profile-id", "documentType": "cv" } }`
- **Success Response (200):** `{ "success": true }`

---

## 4. Payments (Stripe Integration)

The backend will handle creating PaymentIntents. The client will use the returned secret to confirm the payment with Stripe.js.

### `POST /api/payments/create-intent`
- **Request Body:** `{ "amount": 500, "currency": "gbp", "description": "Fund Milestone" }` (Amount in pence/cents)
- **Success Response (200):** `{ "clientSecret": "pi_..." }`

---

## 5. E-Signatures (DocuSign/HelloSign Integration)

The backend will create the signing session and provide the frontend with an embedded signing URL.

### `POST /api/signatures/create-session`
- **Request Body:** `{ "contractId": "...", "signerId": "..." }`
- **Success Response (200):** `{ "signingUrl": "https://app.docusign.com/..." }`

---

## 6. Real-time Services (WebSocket API)

A WebSocket server is required for real-time messaging and notifications. The client will connect upon login.

### Connection
- The client will attempt to connect to the WebSocket server after successful login, passing the JWT for authentication.

### Client Emits (Events sent from Frontend to Backend)
- `sendMessage`:
  - **Payload:** `{ "conversationId": "...", "text": "Hello world" }`
- `startTyping`:
  - **Payload:** `{ "conversationId": "..." }`
- `stopTyping`:
  - **Payload:** `{ "conversationId": "..." }`

### Server Emits (Events pushed from Backend to Frontend)
- `newMessage`: Pushed to all participants in a conversation when a new message is sent.
  - **Payload:** `{ ...MessageObject }`
- `typingIndicator`: Pushed to other participants when a user starts/stops typing.
  - **Payload:** `{ "conversationId": "...", "isTyping": true, "userName": "Steve G." }`
- `newNotification`: Pushed to a specific user.
  - **Payload:** `{ ...NotificationObject }`
