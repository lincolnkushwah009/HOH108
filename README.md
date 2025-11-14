# HOH108 Provider App

A React Native mobile application for service providers to manage their bookings, track earnings, and handle customer requests.

## Features

- 📱 Cross-platform (iOS, Android, Web)
- 🔐 Phone number authentication
- 📊 Dashboard with booking overview
- 📋 Booking management with status updates
- 🔢 OTP-based service completion
- 💰 Earnings tracking
- 🎨 Modern UI with smooth animations

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run web      # Web browser
npm run android  # Android device/emulator
npm run ios      # iOS device/simulator
```

### Building APK

**Easiest Method:**
```bash
npm run build:apk
```

**Or manually:**
```bash
./build-apk.sh
```

See [BUILD_INSTRUCTIONS.md](./BUILD_INSTRUCTIONS.md) for detailed build instructions.

## Available Scripts

- `npm start` - Start Expo development server
- `npm run web` - Run in web browser
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run build:apk` - Build Android APK (automated script)
- `npm run build:preview` - Build preview APK
- `npm run build:production` - Build production APK
- `npm run build:web` - Build for web deployment
- `npm run download:apk` - Download latest built APK

## Project Structure

```
HOH108_Provider_App/
├── src/
│   ├── screens/          # App screens
│   │   ├── LoginScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── BookingDetailScreen.js
│   │   └── EarningsScreen.js
│   ├── navigation/       # Navigation configuration
│   ├── services/         # API services
│   └── config/           # App configuration
├── assets/               # Images, icons, fonts
├── dist/                 # Build output (generated)
├── app.json              # Expo configuration
├── eas.json              # EAS Build configuration
├── package.json          # Dependencies
├── build-apk.sh          # APK build script
└── BUILD_INSTRUCTIONS.md # Detailed build guide
```

## API Configuration

The app connects to the backend API at:
- **Development:** `http://localhost:8000`
- **Production:** Update `API_URL` in `src/config/api.js`

## Authentication

Login credentials for testing:
- **Phone:** 9876543210
- **Password:** password123

## Build Artifacts

After building, you'll find:
- **Web Build:** `dist/` folder (892 KB)
- **APK:** Download from Expo dashboard or via `npm run download:apk`

## Requirements

- Node.js 16+
- npm or yarn
- Expo CLI (installed automatically)
- Expo account (for building APKs)

## Tech Stack

- **Framework:** React Native + Expo
- **Navigation:** React Navigation
- **State Management:** React Hooks + AsyncStorage
- **HTTP Client:** Axios
- **UI:** Custom components with React Native

## Documentation

- [Build Instructions](./BUILD_INSTRUCTIONS.md) - Detailed APK build guide
- [Expo Docs](https://docs.expo.dev/) - Expo framework documentation

## Support

For issues or questions:
- Check [BUILD_INSTRUCTIONS.md](./BUILD_INSTRUCTIONS.md)
- Review Expo documentation
- Contact the development team

## Version

**Current Version:** 1.0.0

## License

Proprietary - HOH108 Platform
