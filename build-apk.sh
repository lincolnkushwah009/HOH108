#!/bin/bash

# HOH108 Provider App - APK Build Script
# This script automates the process of building an Android APK

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   HOH108 Provider App - APK Build Script      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print status messages
print_status() {
    echo -e "${BLUE}► $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if EAS CLI is installed
print_status "Checking for EAS CLI..."
if ! command -v eas &> /dev/null; then
    print_warning "EAS CLI not found. Installing..."
    npm install -g eas-cli
    print_success "EAS CLI installed successfully"
else
    print_success "EAS CLI is already installed"
fi

# Check if user is logged in to EAS
print_status "Checking EAS authentication..."
if ! eas whoami &> /dev/null; then
    print_warning "Not logged in to Expo. Please log in..."
    echo ""
    echo -e "${YELLOW}You need an Expo account to build the APK.${NC}"
    echo -e "${YELLOW}If you don't have one, create a free account at: https://expo.dev${NC}"
    echo ""
    eas login

    if [ $? -ne 0 ]; then
        print_error "Login failed. Please try again."
        exit 1
    fi
    print_success "Successfully logged in to Expo"
else
    EXPO_USER=$(eas whoami 2>&1)
    print_success "Already logged in as: $EXPO_USER"
fi

# Show build options menu
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}Select Build Type:${NC}"
echo ""
echo "  1) Development Build (For testing with Expo Go)"
echo "  2) Preview Build (APK for internal testing)"
echo "  3) Production Build (Release APK)"
echo ""
read -p "Enter your choice (1-3): " BUILD_CHOICE

case $BUILD_CHOICE in
    1)
        BUILD_PROFILE="development"
        print_status "Building Development APK..."
        ;;
    2)
        BUILD_PROFILE="preview"
        print_status "Building Preview APK..."
        ;;
    3)
        BUILD_PROFILE="production"
        print_status "Building Production APK..."
        ;;
    *)
        print_error "Invalid choice. Defaulting to Preview build."
        BUILD_PROFILE="preview"
        ;;
esac

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}Build Configuration:${NC}"
echo -e "  Profile: ${GREEN}$BUILD_PROFILE${NC}"
echo -e "  Platform: ${GREEN}Android${NC}"
echo -e "  Package: ${GREEN}com.hoh108.providerapp${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo ""

# Ask for confirmation
read -p "Continue with build? (y/n): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    print_warning "Build cancelled by user"
    exit 0
fi

# Clean previous build artifacts
print_status "Cleaning previous build artifacts..."
rm -rf dist/
rm -rf .expo/
print_success "Cleaned build artifacts"

# Install dependencies
print_status "Checking dependencies..."
if [ ! -d "node_modules" ]; then
    print_warning "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
else
    print_success "Dependencies already installed"
fi

# Start the build
echo ""
print_status "Starting EAS Build (this may take 10-20 minutes)..."
echo ""

# Build the APK
eas build --platform android --profile $BUILD_PROFILE --non-interactive

if [ $? -eq 0 ]; then
    echo ""
    print_success "════════════════════════════════════════════════"
    print_success "   Build completed successfully!               "
    print_success "════════════════════════════════════════════════"
    echo ""
    echo -e "${GREEN}Your APK has been built and uploaded to Expo servers.${NC}"
    echo ""
    echo -e "${YELLOW}To download your APK:${NC}"
    echo "  1. Visit: https://expo.dev/accounts/[your-username]/projects/HOH108_Provider_App/builds"
    echo "  2. Or run: eas build:list"
    echo ""
    echo -e "${YELLOW}To download the latest build directly:${NC}"
    echo "  Run: eas build:download --platform android --profile $BUILD_PROFILE"
    echo ""
else
    echo ""
    print_error "════════════════════════════════════════════════"
    print_error "   Build failed!                               "
    print_error "════════════════════════════════════════════════"
    echo ""
    echo -e "${RED}Please check the error messages above for details.${NC}"
    echo ""
    echo -e "${YELLOW}Common issues:${NC}"
    echo "  - Network connectivity problems"
    echo "  - Invalid credentials"
    echo "  - Build configuration errors"
    echo ""
    echo -e "${YELLOW}For help, visit: https://docs.expo.dev/build/introduction/${NC}"
    exit 1
fi
