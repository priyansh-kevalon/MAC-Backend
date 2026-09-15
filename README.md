# MAC Backend

Production-ready backend API for the MAC digital marketing website. The current scope is the Contact Us form, with MongoDB persistence and CRUD endpoints ready for a future admin panel.

## Technology Stack

- Node.js and Express.js
- MongoDB Atlas and Mongoose
- dotenv for environment configuration
- CORS for frontend access
- nodemon for development

## Folder Structure

```text
mac-backend/
├── config/db.js
├── controllers/contactController.js
├── middleware/errorHandler.js
├── models/Contact.js
├── routes/contactRoutes.js
├── utils/validation.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

There is intentionally no `src` directory.

## Installation

Requirements: Node.js 18 or newer and a MongoDB Atlas cluster with network access configured for the development machine.

```bash
npm install
copy .env.example .env
```

Update `.env` with the real MongoDB URI. The database name used by this project is `mac_website`.

```env
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xkcfns5.mongodb.net/mac_website
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

URL-encode special characters in the MongoDB username or password before placing them in the URI. Never commit `.env`.

## Run Locally

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Expected startup output:

```text
MongoDB connected successfully
MAC backend running on port 5000
```

The server exits if MongoDB cannot be reached, so it will not run as if the database were available.

## API Endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| POST | `/api/contact` | Submit a contact enquiry |
| GET | `/api/contact` | List newest enquiries first |
| GET | `/api/contact/:id` | Fetch one enquiry |
| DELETE | `/api/contact/:id` | Delete one enquiry |

Contact fields are `name`, `email`, `phone`, and `message`. Unexpected fields are rejected. Phone numbers are stored as strings and accept Indian and common international formats.

## Request Examples

Create an enquiry:

```bash
curl -X POST http://localhost:5000/api/contact ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"phone\":\"9876543210\",\"message\":\"I am interested in your digital marketing services.\"}"
```

Fetch all enquiries:

```bash
curl http://localhost:5000/api/contact
```

Fetch or delete one enquiry:

```bash
curl http://localhost:5000/api/contact/MONGODB_ID
curl -X DELETE http://localhost:5000/api/contact/MONGODB_ID
```

Responses use `{ success, message, data }`; list responses also include `count`.

## Postman Testing

1. `GET http://localhost:5000/api/health`
2. `POST http://localhost:5000/api/contact`, header `Content-Type: application/json`, with:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "message": "I am interested in your digital marketing services."
}
```

3. `GET http://localhost:5000/api/contact`
4. `GET http://localhost:5000/api/contact/MONGODB_ID`
5. `DELETE http://localhost:5000/api/contact/MONGODB_ID`

## React Integration

```js
const response = await fetch('http://localhost:5000/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, phone, message })
});

const result = await response.json();
if (!response.ok) {
  throw new Error(result.message);
}
```

Axios can use the same URL, method, and object as `axios.post('http://localhost:5000/api/contact', { name, email, phone, message })`.

## MongoDB Atlas Configuration

Create or select the Atlas database user, allow the development machine's IP address in Network Access, and use the `mac_website` database name in the URI. Mongoose creates the `contacts` collection when the first enquiry is inserted.

## Production Deployment

1. Set `NODE_ENV=production`.
2. Configure `PORT`, `MONGODB_URI`, and one or more comma-separated `FRONTEND_URL` values in the hosting provider's secret settings.
3. Restrict Atlas Network Access to the deployment server where possible.
4. Use a least-privilege MongoDB user and rotate the exposed development password before deployment.
5. Deploy with `npm install --omit=dev` and run `npm start`.
6. Place the API behind HTTPS and a reverse proxy or managed platform.
7. Monitor database connectivity and application logs without logging credentials.

## Security Notes

- `.env` is ignored by Git and secrets are never returned by the API.
- Request fields are explicitly whitelisted and validated server-side.
- JSON body size is limited to 50 KB and messages to 2,000 characters.
- Invalid ObjectIds, malformed JSON, database errors, and unknown API routes return consistent JSON errors.
- Production errors do not expose stack traces.
- The MongoDB password supplied during setup has been exposed and should be rotated before production deployment.