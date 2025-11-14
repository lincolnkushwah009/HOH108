# HOH108 - Multi-Service Platform

A complete multi-service platform built with React Native (Provider App), React (Customer Web App), and Node.js (Backend API).

## Project Structure

```
HOH108/
├── provider-app/        # React Native Provider Mobile App
├── frontend/            # React Customer Web Application
├── backend/             # Node.js Backend API
└── docs/                # Documentation files
```

## Applications

### 1. Provider App (React Native)
Mobile application for service providers to manage bookings and services.

**Features:**
- Stunning purple gradient UI with smooth animations
- OTP-based job completion verification
- Real-time booking management
- Progress timeline visualization
- Customer details and navigation

**Tech Stack:**
- React Native + Expo
- React Navigation
- Centralized theme system
- Async Storage for authentication

[Provider App Documentation](./provider-app/README.md)

### 2. Customer Web App (React + Vite)
Web application for customers to browse services and make bookings.

**Features:**
- Modern responsive UI
- Service browsing and booking
- Real-time booking status
- Payment integration
- User authentication

**Tech Stack:**
- React 18
- Vite
- Tailwind CSS
- React Router

[Frontend Documentation](./frontend/README.md)

### 3. Backend API (Node.js + Express)
RESTful API server handling all business logic and data management.

**Features:**
- User authentication (JWT)
- Booking management
- Service provider management
- Payment processing
- Email notifications
- File uploads

**Tech Stack:**
- Node.js + Express
- MongoDB
- JWT authentication
- Multer for uploads
- Nodemailer for emails

[Backend Documentation](./backend/README.md)

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB
- Expo CLI (for provider app)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/lincolnkushwah009/HOH108.git
cd HOH108
```

2. **Setup Backend**
```bash
cd backend
npm install
# Configure .env file
npm start
```

3. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

4. **Setup Provider App**
```bash
cd provider-app
npm install
expo start
```

## Documentation

- [Implementation Guide](./IMPLEMENTATION_GUIDE.md)
- [Multi-Service Platform Guide](./MULTI_SERVICE_PLATFORM_GUIDE.md)
- [Production Deployment Guide](./PRODUCTION_DEPLOYMENT_GUIDE.md)
- [Provider App Build Instructions](./provider-app/BUILD_INSTRUCTIONS.md)

## Environment Variables

Each application requires its own environment configuration:

**Backend (.env)**
```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/hoh108
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:8000/api
```

**Provider App**
Update API URL in `provider-app/src/config/api.js`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/provider/login` - Provider login

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `PUT /api/bookings/:id/status` - Update booking status

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service details
- `POST /api/services` - Create service (admin)

## Development

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Provider app tests
cd provider-app && npm test
```

### Build for Production

**Backend**
```bash
cd backend && npm start
```

**Frontend**
```bash
cd frontend && npm run build
```

**Provider App**
```bash
cd provider-app && npm run build:apk
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email support@hoh108.com or open an issue in the repository.

---

Built with by HOH108 Team
