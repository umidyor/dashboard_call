# Call Analysis Dashboard - Uyim24

Professional, amoCRM-style frontend dashboard for analyzing call recordings. This is a **READ-ONLY** dashboard that visualizes analysis results from the backend API.

## 🎯 Features

- **Dashboard Overview**
  - KPI cards (Total analyses, Completed count, Average score, Poor quality count)
  - Status filters (All, Completed, Processing, Failed)
  - Searchable and sortable analyses table
  - CSV export for selected rows

- **Analysis Detail View**
  - Audio player with speed control (0.5x - 2x)
  - Interactive transcript with clickable timestamps
  - Timeline markers for segments and operator errors
  - Statistics panel with scores and recommendations
  - Lead type and purchase probability indicators
  - Operator errors with severity badges
  - Raw JSON viewer with download option

- **Real-time Updates**
  - Status polling (every 2s) for processing analyses
  - Automatic refetch on window focus
  - Progress indicators

- **Mock Mode**
  - Offline testing with sample data
  - No API required for UI development

## 🛠 Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for data fetching and caching
- **Axios** for API calls
- **Recharts** for charts (ready to use)
- **date-fns** for date formatting

## 📋 Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Docker & Docker Compose (optional, for containerized deployment)

## 🚀 Quick Start

### Development Mode

1. **Clone and setup**
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   VITE_API_BASE=https://uyim24.uz:1300
   VITE_API_KEY=your-api-key-here
   VITE_MOCK=false
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open http://localhost:5173

### Production Build

```bash
npm run build
npm run preview
```

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```
   
   Access at http://localhost:3000

2. **Stop containers**
   ```bash
   docker-compose down
   ```

## 🧪 Testing

### Run tests
```bash
cd frontend
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Test coverage
```bash
npm test -- --coverage
```

## 📁 Project Structure

```
call-analysis-dashboard/
├── frontend/
│   ├── src/
│   │   ├── api/              # API client and mock data
│   │   │   ├── client.ts
│   │   │   ├── analysisApi.ts
│   │   │   └── mockData.ts
│   │   ├── components/       # Reusable components
│   │   │   ├── Layout.tsx
│   │   │   ├── KPICards.tsx
│   │   │   └── AnalysesTable.tsx
│   │   ├── hooks/            # Custom React hooks
│   │   │   └── useAnalysis.ts
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   └── AnalysisDetail.tsx
│   │   ├── types/            # TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/            # Helper functions
│   │   │   └── helpers.ts
│   │   ├── test/             # Test files
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI
├── docker-compose.yml
└── README.md
```

## 🔌 API Integration

The frontend connects to the backend API at `https://uyim24.uz:1300` by default.

### Endpoints Used

- `GET /analyses` - Fetch list of analyses (with optional `?status=completed` filter)
- `GET /analysis/{id}/status` - Poll analysis status (for real-time updates)
- `GET /analysis/{id}` - Fetch complete analysis with transcript and statistics
- `GET /analysis/{id}/statistics` - Fetch statistics only (optional)

### Authentication

Set `VITE_API_KEY` in your `.env` file. The API key is sent in the `x-api-key` header.

## 🎨 Mock Mode

For offline development and UI testing:

```env
VITE_MOCK=true
```

This uses sample data from `src/api/mockData.ts` instead of making real API calls.

## 📊 Response Format

The frontend expects the following API response structures:

### Analyses List
```json
{
  "total": 10,
  "analyses": [
    {
      "id": "a1b2c3",
      "filename": "call_2024_01_15.mp3",
      "created_at": "2024-01-15T10:30:00Z",
      "completed_at": "2024-01-15T10:32:45Z",
      "status": "completed",
      "audio_url": "https://example.com/audio.mp3"
    }
  ]
}
```

### Analysis Detail
```json
{
  "id": "a1b2c3",
  "filename": "call_2024_01_15.mp3",
  "created_at": "2024-01-15T10:30:00Z",
  "completed_at": "2024-01-15T10:32:45Z",
  "status": "completed",
  "audio_url": "https://example.com/audio.mp3",
  "transcript": [
    {
      "speaker": "operator",
      "start": 0,
      "end": 5.2,
      "text": "Assalomu alaykum..."
    }
  ],
  "statistics": {
    "lead_turi": "Issiq",
    "xarid_qilish_ehtimoli": 75,
    "reyting": {
      "umumiy_ball": 82,
      "maxsus_ball": 78,
      "shovqin_sifati": 90,
      "operator_malakasi": 85
    },
    "keyingi_qadamlar": ["Step 1", "Step 2"],
    "operator_xatolari": [
      {
        "xato_turi": "Type",
        "tavsif": "Description",
        "vaqt": 10.5,
        "jiddiylik": "o'rta"
      }
    ]
  }
}
```

## 🎯 Key Features Explained

### 1. Status Polling
When viewing an analysis in "processing" status, the app automatically polls the status endpoint every 2 seconds until completion.

### 2. Audio Timeline Navigation
- Click on transcript segments to jump to that timestamp in the audio
- Click on operator error markers to seek to error location
- Adjust playback speed from 0.5x to 2x

### 3. Data Export
- **JSON Download**: Download complete analysis data for any analysis
- **CSV Export**: Select rows in the table and export as CSV

### 4. Responsive Design
- Desktop and tablet optimized
- Collapsible sidebar navigation
- Keyboard accessible

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE` | Backend API base URL | `https://uyim24.uz:1300` |
| `VITE_API_KEY` | API authentication key | `` |
| `VITE_MOCK` | Enable mock mode | `false` |

### React Query Configuration

Customize caching and refetching in `src/App.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,  // Refetch when window gains focus
      retry: 1,                      // Retry failed requests once
      staleTime: 30000,              // Data stays fresh for 30s
    },
  },
});
```

## 🧩 Extending the Dashboard

### Adding Charts

Recharts is installed and ready to use:

```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
  { name: 'Jan', score: 85 },
  { name: 'Feb', score: 92 },
];

<BarChart width={500} height={300} data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="score" fill="#0ea5e9" />
</BarChart>
```

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`:
   ```tsx
   <Route path="/new-page" element={<NewPage />} />
   ```
3. Add navigation link in `src/components/Layout.tsx`

## 🐛 Troubleshooting

### API Connection Issues
- Check `VITE_API_BASE` is correct
- Verify API key is set in `VITE_API_KEY`
- Check CORS configuration on backend
- Try enabling mock mode: `VITE_MOCK=true`

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install --legacy-peer-deps`
- Clear build cache: `rm -rf dist .vite`

### Docker Issues
- Rebuild images: `docker-compose build --no-cache`
- Check logs: `docker-compose logs frontend`

## 📝 License

MIT

## 👥 Support

For issues and questions, contact the Uyim24 development team.
