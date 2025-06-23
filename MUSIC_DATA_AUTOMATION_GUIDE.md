# Music Data Automation Guide

This guide explains the complete setup for automatically fetching and updating music data from Stats.fm API using GitHub Actions.

## Overview

The system automatically fetches your music listening data from Stats.fm API and updates your portfolio with the latest statistics. It runs weekly and on every push to the main branch.

## Components

### 1. Data Fetching Script (`scripts/fetch-music-data.js`)

A Node.js script that:
- Fetches data from 5 Stats.fm API endpoints for multiple time ranges:
  - Top genres (weeks, months, lifetime)
  - Streaming stats (weeks, months, lifetime) 
  - Top albums (weeks, months, lifetime)
  - Top tracks (weeks, months, lifetime)
  - Top artists (weeks, months, lifetime)
- Saves data to range-specific directories (`data/music/{range}/latest/`)
- Creates backup copies in `data/music/{range}/old/` directories
- Handles API failures by using stale data from backup
- Supports three time ranges: weeks, months, lifetime

### 2. Directory Structure

```
data/
└── music/
    ├── weeks/           # Weekly data
    │   ├── latest/      # Current weekly data
    │   │   ├── top-genres.json
    │   │   ├── streams-stats.json
    │   │   ├── top-albums.json
    │   │   ├── top-tracks.json
    │   │   └── top-artists.json
    │   └── old/         # Backup weekly data
    │       ├── top-genres.json
    │       ├── streams-stats.json
    │       ├── top-albums.json
    │       ├── top-tracks.json
    │       └── top-artists.json
    ├── months/          # Monthly data
    │   ├── latest/      # Current monthly data
    │   │   ├── top-genres.json
    │   │   ├── streams-stats.json
    │   │   ├── top-albums.json
    │   │   ├── top-tracks.json
    │   │   └── top-artists.json
    │   └── old/         # Backup monthly data
    │       ├── top-genres.json
    │       ├── streams-stats.json
    │       ├── top-albums.json
    │       ├── top-tracks.json
    │       └── top-artists.json
    └── lifetime/        # All-time data
        ├── latest/      # Current lifetime data
        │   ├── top-genres.json
        │   ├── streams-stats.json
        │   ├── top-albums.json
        │   ├── top-tracks.json
        │   └── top-artists.json
        └── old/         # Backup lifetime data
            ├── top-genres.json
            ├── streams-stats.json
            ├── top-albums.json
            ├── top-tracks.json
            └── top-artists.json
```

The same structure is mirrored in `portfolio/public/data/music/` for React component access.

### 3. GitHub Actions Workflow (`.github/workflows/deploy-gh-pages.yml`)

Automated workflow that:
- Runs weekly on Sundays at midnight UTC
- Runs on every push to main branch
- Fetches fresh music data using the secret token
- Copies data to portfolio public folder
- Commits changes back to repository
- Builds and deploys the updated portfolio

## Setup Instructions

### 1. Get Your Stats.fm Bearer Token

1. Go to [Stats.fm](https://stats.fm) and log in
2. Open browser developer tools (F12)
3. Go to Network tab
4. Navigate around the site to trigger API calls
5. Look for requests to `api.stats.fm`
6. Copy the `Authorization` header value (starts with "Bearer ")

### 2. Add GitHub Secret

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `STATS_FM_TOKEN`
5. Value: Your bearer token (including "Bearer " prefix)
6. Click "Add secret"

### 3. API Endpoints Used

The script fetches data from these Stats.fm endpoints:

```javascript
const endpoints = [
  {
    url: 'https://api.stats.fm/api/v1/users/tm2zrwndrp4mc7bhl3ewe94bn/top/genres?range=weeks',
    filename: 'top-genres.json'
  },
  {
    url: 'https://api.stats.fm/api/v1/users/tm2zrwndrp4mc7bhl3ewe94bn/streams/stats?range=weeks',
    filename: 'streams-stats.json'
  },
  {
    url: 'https://api.stats.fm/api/v1/users/tm2zrwndrp4mc7bhl3ewe94bn/top/albums?range=weeks',
    filename: 'top-albums.json'
  },
  {
    url: 'https://api.stats.fm/api/v1/users/tm2zrwndrp4mc7bhl3ewe94bn/top/tracks?range=weeks',
    filename: 'top-tracks.json'
  },
  {
    url: 'https://api.stats.fm/api/v1/users/tm2zrwndrp4mc7bhl3ewe94bn/top/artists?range=weeks',
    filename: 'top-artists.json'
  }
];
```

## Data Format Examples

### Top Tracks (`top-tracks.json`)
```json
{
  "items": [
    {
      "position": 1,
      "streams": 11,
      "playedMs": 3063214,
      "track": {
        "id": 58827563,
        "name": "Assumptions - slowed down version",
        "artists": [
          {
            "id": 6814368,
            "name": "slowed down audioss"
          }
        ],
        "albums": [
          {
            "id": 11286962,
            "name": "Assumptions (slowed down version)",
            "image": "https://i.scdn.co/image/ab67616d0000b273d5eee3d2f69a71eb71a41520"
          }
        ]
      }
    }
  ]
}
```

### Streaming Stats (`streams-stats.json`)
```json
{
  "count": 150,
  "playedMs": 25000000,
  "cardsReceived": 5,
  "hoursPlayed": 694.4
}
```

## Error Handling

### Token Expiration
- If the bearer token expires, the script will fail
- GitHub Actions will use the backup data from `data/music/old/`
- You'll need to update the `STATS_FM_TOKEN` secret with a fresh token

### API Rate Limiting
- The script includes delays between requests
- If rate limited, it falls back to using stale data

### Network Issues
- Failed requests automatically fall back to backup data
- Ensures the website always has music data to display

## Workflow Schedule

- **Weekly Updates**: Every Sunday at midnight UTC
- **Manual Updates**: On every push to main branch
- **Automatic Deployment**: Updated data triggers a new site deployment

## Monitoring

Check the GitHub Actions tab in your repository to monitor:
- Successful data fetches
- API failures
- Deployment status

## Troubleshooting

### Common Issues

1. **Token Expired**
   - Update `STATS_FM_TOKEN` secret with fresh bearer token

2. **API Changes**
   - Stats.fm may change their API endpoints
   - Update the URLs in `scripts/fetch-music-data.js`

3. **User ID Changes**
   - If your Stats.fm user ID changes, update it in the script

4. **Rate Limiting**
   - Increase delays between requests in the script
   - Consider reducing fetch frequency

### Manual Testing

Run the script locally to test:

```bash
# Set environment variable
export STATS_FM_TOKEN="Bearer your_token_here"

# Run the script
node scripts/fetch-music-data.js
```

## Security Notes

- Never commit bearer tokens to the repository
- Use GitHub Secrets for sensitive data
- Tokens should be rotated periodically
- Monitor for unauthorized API usage

## Integration with Portfolio

The fetched data is automatically:
1. Copied to `portfolio/public/data/music/{range}/latest/` for each time range
2. Made available to React components
3. Used by the MusicStats component with dropdown selection for time ranges
4. Updated weekly to show current music preferences across all time periods

### MusicStats Component Features

- **Time Range Selector**: Dropdown to switch between "This Week", "This Month", and "All Time"
- **Dynamic Data Loading**: Automatically fetches data for the selected time range
- **Responsive Design**: Adapts to different screen sizes
- **Real-time Updates**: Shows the most recent data for each time period

This automation ensures your portfolio always displays up-to-date music data across multiple time ranges without manual intervention.
