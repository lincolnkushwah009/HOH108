# HOH 108 Backend API

A production-ready REST API for the HOH 108 web platform, built with Node.js, Express, and MongoDB.

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Environment**: dotenv
- **CORS**: cors middleware

## Project Structure

```
backend/
├── models/           # Mongoose schemas for MongoDB collections
│   ├── Gallery.js    # Gallery project schema
│   ├── Testimonial.js # Client testimonial schema
│   └── Lead.js       # Lead inquiry schema
├── routes/           # API endpoint definitions
│   ├── gallery.js    # Gallery routes
│   ├── testimonials.js # Testimonials routes
│   ├── estimate.js   # Cost estimation routes
│   └── leads.js      # Lead management routes
└── server.js         # Main application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Installation

1. Clone the repository and navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB connection string
   - Adjust `PORT` if needed (default: 5000)

4. Start MongoDB (if using local instance):
   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod

   # Windows
   net start MongoDB
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

   Or run in production mode:
   ```bash
   npm start
   ```

## API Endpoints

### Health Check
```
GET /health
```
Returns API health status.

### Root
```
GET /
```
Returns API information and available endpoints.

### Gallery

#### Get All Gallery Items
```
GET /api/gallery
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "imageUrl": "https://example.com/image.jpg",
      "category": "Kitchen",
      "title": "Modern Kitchen Design",
      "description": "A beautiful modern kitchen...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Testimonials

#### Get All Testimonials
```
GET /api/testimonials
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "photo": "https://example.com/photo.jpg",
      "review": "Excellent service!",
      "rating": 5,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Cost Estimation

#### Calculate Renovation Estimate
```
POST /api/estimate
```

**Request Body:**
```json
{
  "carpetArea": 1000,
  "city": "Mumbai"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "carpetArea": 1000,
    "city": "Mumbai",
    "cityMultiplier": 1.5,
    "baseCostPerSqFt": 1500,
    "estimatedCost": 2250000
  }
}
```

**City Multipliers:**
- Tier 1 Cities: Mumbai (1.5), Bangalore (1.45), Delhi (1.4), etc.
- Tier 2 Cities: Ahmedabad (1.2), Jaipur (1.15), etc.
- Other Cities: Default (1.0)

### Leads

#### Create New Lead
```
POST /api/leads
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "city": "Mumbai",
  "carpetArea": 1000,
  "estimatedCost": 2250000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead inquiry saved successfully",
  "data": {
    "_id": "...",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "city": "Mumbai",
    "carpetArea": 1000,
    "estimatedCost": 2250000,
    "date": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Database Schema

### Gallery Collection
- `imageUrl`: String (required)
- `category`: String (required)
- `title`: String (required)
- `description`: String (required)
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)

### Testimonials Collection
- `name`: String (required)
- `photo`: String (required)
- `review`: String (required)
- `rating`: Number (1-5, required)
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)

### Leads Collection
- `name`: String (required)
- `email`: String (required, validated)
- `city`: String (required)
- `carpetArea`: Number (required, min: 1)
- `estimatedCost`: Number (required, min: 0)
- `date`: Date (default: current date)
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development mode)"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Running in Development Mode
```bash
npm run dev
```
Uses `nodemon` for automatic server restart on file changes.

### Running in Production Mode
```bash
npm start
```

## Testing the API

You can test the API using tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

### Example curl Commands

**Get Gallery Items:**
```bash
curl http://localhost:5000/api/gallery
```

**Calculate Estimate:**
```bash
curl -X POST http://localhost:5000/api/estimate \
  -H "Content-Type: application/json" \
  -d '{"carpetArea": 1000, "city": "Mumbai"}'
```

**Create Lead:**
```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "city": "Mumbai",
    "carpetArea": 1000,
    "estimatedCost": 2250000
  }'
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/interior_managers` |
| `CORS_ORIGIN` | CORS allowed origins | `*` |

## MongoDB Setup

### Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use default connection: `mongodb://localhost:27017/interior_managers`

### MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string and update `.env`:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/interior_managers?retryWrites=true&w=majority
   ```

## Production Deployment

For production deployment:
1. Set `NODE_ENV=production` in environment variables
2. Use a secure MongoDB connection with authentication
3. Configure appropriate CORS origins (not `*`)
4. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start backend/server.js --name interior-managers-api
   ```

## License

ISC

## Author

HOH 108 Development Team
