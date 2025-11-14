# HOH108 Provider App - Build Instructions

## Prerequisites

Before building the APK, you need:
1. A free Expo account (sign up at https://expo.dev)
2. Node.js and npm installed on your system

## Quick Start - Build APK in 3 Steps

### Method 1: Using the Automated Script (Recommended)

1. **Make the script executable:**
   ```bash
   chmod +x build-apk.sh
   ```

2. **Run the build script:**
   ```bash
   ./build-apk.sh
   ```

3. **Follow the prompts:**
   - Login to your Expo account when prompted
   - Select build type (Development/Preview/Production)
   - Wait for the build to complete (~10-20 minutes)
   - Download the APK from the provided link

---

### Method 2: Manual Build Process

If you prefer to run commands manually:

#### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

#### Step 2: Login to Expo
```bash
eas login
```
Enter your Expo account credentials.

#### Step 3: Build the APK

**For Preview/Testing Build:**
```bash
eas build --platform android --profile preview
```

**For Production Build:**
```bash
eas build --platform android --profile production
```

#### Step 4: Download the APK
After the build completes, you'll receive a download link. You can also:
```bash
eas build:download --platform android --profile preview
```

---

## Build Profiles Explained

### 1. Development Build
- Use case: Testing with development features
- Command: `eas build --platform android --profile development`

### 2. Preview Build (Recommended for Testing)
- Use case: Internal testing and QA
- Command: `eas build --platform android --profile preview`
- Output: APK file ready to install on Android devices

### 3. Production Build
- Use case: Release to end users or Play Store
- Command: `eas build --platform android --profile production`
- Output: Optimized APK for production

---

## Useful Commands

### Check build status
```bash
eas build:list
```

### Download latest build
```bash
eas build:download --platform android
```

### View build logs
```bash
eas build:view [BUILD_ID]
```

### Check who you're logged in as
```bash
eas whoami
```

### Logout from Expo
```bash
eas logout
```

---

## What's Included in the Build?

The APK includes:
- ✅ Login screen with phone authentication
- ✅ Dashboard with booking management
- ✅ Booking details with OTP verification
- ✅ Earnings tracking
- ✅ Navigation system
- ✅ All app assets and icons

---

## Troubleshooting

### Error: "Not logged in"
**Solution:** Run `eas login` and enter your credentials

### Error: "Build failed"
**Solution:**
1. Check your internet connection
2. Ensure all dependencies are installed: `npm install`
3. Check build logs for specific errors: `eas build:list`

### Error: "Android build configuration missing"
**Solution:** The `eas.json` file is already configured. Make sure you're in the correct directory.

### Build takes too long
**Note:** Cloud builds typically take 10-20 minutes. This is normal.

---

## After Building

### Installing the APK on Android Device

1. **Download the APK** from the Expo dashboard or use the download command
2. **Transfer to your Android device** via USB, email, or cloud storage
3. **Enable "Install from Unknown Sources"** in Android settings
4. **Open the APK file** on your device and tap "Install"

---

## Alternative: Test Without Building

If you just want to test the app without building an APK:

### Using Expo Go App (Quick Testing)
```bash
npm run web
```

Then:
1. Install "Expo Go" from Play Store
2. Scan the QR code displayed in terminal
3. App will open in Expo Go

**Note:** This method doesn't require building an APK but the app runs in a development environment.

---

## Build Artifacts Location

After successful build:
- **Web Build:** `HOH108_Provider_App/dist/` (already generated)
- **APK Download:** From Expo dashboard or via `eas build:download`
- **Build Logs:** Available on Expo dashboard

---

## Configuration Files

The following files have been configured for you:
- ✅ `eas.json` - EAS Build configuration
- ✅ `app.json` - App metadata and Android package info
- ✅ `build-apk.sh` - Automated build script

---

## Support

For issues with:
- **Expo/EAS Build:** https://docs.expo.dev/build/introduction/
- **App functionality:** Contact the development team
- **Build errors:** Check the build logs on Expo dashboard

---

## Summary

**Fastest way to get an APK:**
```bash
chmod +x build-apk.sh && ./build-apk.sh
```

**Manual build:**
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

That's it! Your APK will be ready in about 15-20 minutes.
