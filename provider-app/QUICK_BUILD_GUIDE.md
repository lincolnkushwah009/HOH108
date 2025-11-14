# Quick APK Build Guide for Phone Testing

## Step-by-Step Instructions

### Step 1: Open Terminal
Open your terminal application and navigate to the provider app folder.

### Step 2: Copy and Paste This Command
```bash
cd /Users/lincolnkushwah/Desktop/HOH-tech/HOH108_Provider_App && eas login
```

### Step 3: Create/Login to Expo Account
You'll see a prompt like this:
```
Log in to EAS with email or username
Email or username:
```

**If you don't have an account:**
- Go to https://expo.dev/signup
- Create a free account (takes 1 minute)
- Come back and enter your credentials

**If you have an account:**
- Enter your email or username
- Enter your password

### Step 4: Start the Build
After successful login, run:
```bash
eas build --platform android --profile preview
```

### Step 5: Answer the Prompts

You'll be asked a few questions:

**1. "Generate a new Android Keystore?"**
→ Answer: **Yes** (press Y)

**2. "Would you like to automatically create an EAS project for..."**
→ Answer: **Yes** (press Y)

### Step 6: Wait for Build
You'll see progress like:
```
✔ Compressing project files
✔ Uploading to EAS Build
✔ Queued...
✔ Building...
```

**This takes 15-20 minutes.** You can minimize the terminal and do other work.

### Step 7: Download Your APK

When complete, you'll see:
```
✔ Build finished

https://expo.dev/accounts/[your-username]/projects/hoh108-provider-app/builds/[build-id]
```

**To download:**

Option A: Click the link above and download from browser

Option B: Run this command:
```bash
eas build:download --platform android --profile preview
```

The APK will be downloaded to your current folder.

### Step 8: Install on Your Phone

1. **Transfer the APK** to your phone:
   - Email it to yourself
   - Use Google Drive / Dropbox
   - Connect via USB and copy

2. **Enable installation from unknown sources:**
   - Go to Settings > Security
   - Enable "Install from Unknown Sources" or "Install Unknown Apps"

3. **Install the APK:**
   - Locate the APK file on your phone
   - Tap it and tap "Install"
   - Wait for installation to complete

4. **Open the app:**
   - Find "HOH108_Provider_App" in your app drawer
   - Tap to open

---

## Quick Commands Reference

**Login:**
```bash
cd /Users/lincolnkushwah/Desktop/HOH-tech/HOH108_Provider_App
eas login
```

**Build APK:**
```bash
eas build --platform android --profile preview
```

**Download APK:**
```bash
eas build:download --platform android --profile preview
```

**Check build status:**
```bash
eas build:list
```

---

## Test Credentials

Once the app is installed, use these credentials to test:

- **Phone:** 9876543210
- **Password:** password123

---

## Troubleshooting

**"Command not found: eas"**
→ Run: `npm install -g eas-cli`

**"Not logged in"**
→ Run: `eas login` again

**"Build failed"**
→ Run: `eas build:list` to see error details

**Can't install APK on phone**
→ Make sure "Install from Unknown Sources" is enabled in Settings

---

## Need Help?

- Check build status: https://expo.dev
- View detailed logs in the build URL provided
- Re-run the build if it fails: `eas build --platform android --profile preview`

---

## Expected APK Details

- **File size:** ~40-60 MB
- **Package name:** com.hoh108.providerapp
- **Version:** 1.0.0
- **Minimum Android:** 5.0 (Lollipop)

---

## Next Steps After Build

1. Install APK on your phone
2. Test the login functionality
3. Verify bookings are showing (6 test bookings available)
4. Test the booking details and OTP flow
5. Check earnings screen

The backend server must be running at http://localhost:8000 for the app to connect properly during testing.
