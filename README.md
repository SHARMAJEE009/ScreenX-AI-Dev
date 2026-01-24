# ScreenX AI Dev - HR Dashboard

A modern, responsive HR Dashboard web frontend for managing resume screening data. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard Overview**: KPI cards showing total candidates, shortlisted, rejected, and pending reviews
- **Candidates Management**: Searchable and filterable table with pagination and sorting
- **Candidate Details**: Modal view with full candidate information and status management
- **Shortlisted/Rejected Pages**: Dedicated views for filtered candidate lists
- **Analytics**: Charts showing position-wise applicants, shortlist ratios, top locations, and more
- **Modern UI**: Clean design with light theme, soft shadows, rounded cards, and blue/purple accents

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Recharts** - Charts and analytics
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Badge.tsx
│   ├── CandidateDetailsModal.tsx
│   ├── ConfirmationDialog.tsx
│   ├── EmptyState.tsx
│   ├── KPICard.tsx
│   ├── LoadingSkeleton.tsx
│   ├── Modal.tsx
│   ├── SearchFilterBar.tsx
│   └── Sidebar.tsx
├── data/            # Mock data
│   └── mockData.ts
├── pages/           # Page components
│   ├── Analytics.tsx
│   ├── Candidates.tsx
│   ├── Dashboard.tsx
│   ├── Rejected.tsx
│   ├── Settings.tsx
│   └── Shortlisted.tsx
├── services/        # API service layer
│   └── api.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── utils/           # Utility functions
│   └── toast.tsx
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Backend Integration

The application is designed to work with a MySQL backend. The API service layer (`src/services/api.ts`) currently uses mock data but is structured to easily connect to real APIs.

To connect to your backend:

1. Update the `API_BASE_URL` constant in `src/services/api.ts`
2. Replace the mock implementations with actual fetch/axios calls
3. Ensure your backend endpoints match the expected interface:
   - `GET /api/candidates` - Get candidates with filters, sorting, pagination
   - `GET /api/candidates/:id` - Get candidate by ID
   - `PUT /api/candidates/:id` - Update candidate status
   - `GET /api/analytics` - Get analytics data

## Database Schema

Expected MySQL table structure:

```sql
CREATE TABLE candidates (
  id VARCHAR(255) PRIMARY KEY,
  Full_Name VARCHAR(255) NOT NULL,
  Number VARCHAR(50),
  Email VARCHAR(255) NOT NULL,
  Location VARCHAR(255),
  Position_Applied VARCHAR(255),
  Short_Listed ENUM('YES', 'NO', 'PENDING') DEFAULT 'PENDING',
  Reason TEXT,
  Notes TEXT,
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Features in Detail

### Search and Filtering
- Search by name, email, or position
- Filter by position, status, and location
- Real-time filtering with debouncing

### Sorting
- Sort by name, position, or status
- Toggle ascending/descending order

### Pagination
- Configurable page size (default: 10)
- Page navigation controls
- Shows current range and total count

### Status Management
- Mark candidates as Shortlisted, Rejected, or Pending
- Confirmation dialogs for status changes
- Toast notifications for actions

### Export
- Export shortlisted candidates to CSV
- Includes all relevant candidate data

## License

MIT
