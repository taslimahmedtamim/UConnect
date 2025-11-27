# UConnect Frontend

React-based frontend application for UConnect - an AI-driven university ecosystem.

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **React Query** - Data fetching and state management
- **Recharts** - Data visualization
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── Layout.jsx   # Main app layout with sidebar
│   │   ├── Button.jsx  # Button component
│   │   └── Card.jsx    # Card component
│   ├── pages/          # Page components
│   │   ├── Landing.jsx # Landing page
│   │   ├── Login.jsx   # Login page
│   │   ├── Register.jsx # Registration page
│   │   ├── Dashboard.jsx # Main dashboard
│   │   ├── Profile.jsx # User profile
│   │   ├── Projects.jsx # Projects list
│   │   ├── ProjectDetail.jsx # Project detail view
│   │   ├── Teams.jsx   # Teams management
│   │   ├── Resume.jsx  # Resume generator
│   │   ├── Jobs.jsx    # Job opportunities
│   │   ├── Roadmaps.jsx # Career roadmaps
│   │   ├── Showcase.jsx # Project showcase
│   │   ├── HelpBoard.jsx # Help board
│   │   └── Chat.jsx    # Chat interface
│   ├── hooks/          # Custom React hooks
│   │   └── useAuth.js  # Authentication hook
│   ├── lib/            # Utility functions
│   │   └── utils.js    # Helper functions
│   ├── App.jsx         # Main app component with routes
│   ├── main.jsx        # App entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML template
└── package.json        # Dependencies and scripts
```

## Features

- ✅ Landing page
- ✅ Authentication (Login/Register)
- ✅ Dashboard with stats and activity
- ✅ User profile with skill graph
- ✅ Project management
- ✅ Team formation
- ✅ Resume generator (U-Resume)
- ✅ Job matching
- ✅ Career roadmaps
- ✅ Project showcase
- ✅ Help board
- ✅ Chat interface

## Development

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add a route in `src/App.jsx`
3. Add navigation link in `src/components/Layout.jsx` if needed

### Styling

The app uses Tailwind CSS with a custom dark theme. Colors and design tokens are defined in `src/index.css`.

### API Integration

The app is set up to work with a backend API. Update the `VITE_API_URL` in `.env.local` to point to your backend.

API calls should be made using React Query. Example:

```jsx
import { useQuery } from '@tanstack/react-query'

function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`)
      return res.json()
    }
  })
  
  // ...
}
```

## License

MIT
