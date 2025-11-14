# HOH 108 - Frontend

A premium, luxury interior design website built with React, Tailwind CSS, and Framer Motion.

## Brand Identity

### Colors
- **Primary (Deep Navy)**: `#153057` - Trust and luxury
- **Accent (Warm Tan)**: `#c69c6d` - Warmth and friendliness
- **Support (Light Grey)**: `#bec1c4` - Calm and readability

### Fonts
- **Headings/Titles**: The Season
- **Subheadings/Buttons**: Nexa Bold
- **Body Text**: Nexa Light

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Sticky navigation with scroll effect
│   ├── HeroSection.jsx     # Full-screen hero with animations
│   ├── WhyChooseUs.jsx     # Feature cards with hover effects
│   ├── HowItWorks.jsx      # Process flow with animated progress line
│   ├── Gallery.jsx         # Project gallery with API integration
│   ├── EstimateForm.jsx    # Lead capture form with validation
│   ├── Testimonials.jsx    # Client testimonials carousel
│   └── Footer.jsx          # Site footer with links
├── pages/
│   └── HomePage.jsx        # Main landing page
├── assets/
│   └── fonts/              # Custom font files (to be added)
├── App.jsx
├── main.jsx
└── index.css               # Global styles with Tailwind
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Add custom fonts:
Place your font files in `src/assets/fonts/`:
- TheSeason.woff / TheSeason.woff2
- NexaBold.woff / NexaBold.woff2
- NexaLight.woff / NexaLight.woff2

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
```bash
npm run preview
```

## API Integration

The following components expect backend API endpoints:

### Gallery Component
- **Endpoint**: `GET /api/gallery`
- **Expected Response**:
```json
[
  {
    "id": 1,
    "title": "Project Title",
    "category": "Residential",
    "image": "https://example.com/image.jpg"
  }
]
```

### Testimonials Component
- **Endpoint**: `GET /api/testimonials`
- **Expected Response**:
```json
[
  {
    "id": 1,
    "name": "Client Name",
    "location": "City, State",
    "rating": 5,
    "text": "Testimonial text",
    "project": "Project Type"
  }
]
```

### EstimateForm Component
- **Endpoints**:
  - `POST /api/estimate`
  - `POST /api/leads`
- **Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string (optional)",
  "city": "string",
  "carpetArea": "string"
}
```

**Note**: All components include demo/fallback data for development purposes.

## Features

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Fully tested across all device sizes

### Animations
- Scroll-triggered animations using Framer Motion
- Smooth transitions and micro-interactions
- Performance-optimized with viewport detection

### Performance
- Code splitting with Vite
- Optimized images with lazy loading
- Minimal bundle size

### Accessibility
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly

## Customization

### Tailwind Configuration
Custom theme extensions are defined in `tailwind.config.js`:
- Brand colors accessible via `bg-primary`, `text-accent`, etc.
- Custom font families: `font-heading`, `font-subheading`, `font-body`

### Component Styling
All components use Tailwind utility classes for consistency and maintainability.

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License
Copyright 2025 HOH 108. All rights reserved.
