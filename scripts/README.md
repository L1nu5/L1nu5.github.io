# Stats.fm Music Data Fetcher

This script automatically fetches your music listening data from Stats.fm API and stores it locally for use in your portfolio website.

## Features

- Fetches 5 different types of music data from Stats.fm API:
  - Top Genres (weekly)
  - Stream Statistics (weekly)
  - Top Albums (weekly)
  - Top Tracks (weekly)
  - Top Artists (weekly)
- Automatic fallback to previously stored data if API token expires
- Integrated with GitHub Actions for automated updates
- Respectful API usage with delays between requests

## Setup

### 1. GitHub Secret Configuration

You need to add your Stats.fm bearer token as a **Repository Secret**:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Under the **Repository secrets** section, click **"New repository secret"**
4. Name: `STATS_FM_TOKEN`
5. Value: Your Stats.fm bearer token (without the "Bearer " prefix)

**Note**: Use Repository Secret (not Environment Secret) since this workflow runs on pushes to main and doesn't require environment-specific deployment approval.

### 2. Getting Your Stats.fm Bearer Token

1. Log in to [Stats.fm](https://stats.fm)
2. Open your browser's Developer Tools (F12)
3. Go to the Network tab
4. Navigate around the Stats.fm website
5. Look for API requests to `api.stats.fm`
6. Find the `Authorization` header in any request
7. Copy the token part after "Bearer " (the long JWT string)

### 3. Directory Structure

The script creates the following directory structure:

```
data/
└── music/
    ├── latest/          # Current/fresh data
    │   ├── top-genres.json
    │   ├── streams-stats.json
    │   ├── top-albums.json
    │   ├── top-tracks.json
    │   └── top-artists.json
    └── old/             # Backup/fallback data
        ├── top-genres.json
        ├── streams-stats.json
        ├── top-albums.json
        ├── top-tracks.json
        └── top-artists.json
```

## Usage

### Automatic (GitHub Actions)

The script runs automatically:
- Every time **you** push to the main branch (not when GitHub Actions pushes)
- Weekly on Sundays at midnight UTC
- As part of the GitHub Pages deployment process

**Smart Triggering**: The workflow only fetches fresh music data when triggered by your manual pushes, not by automated commits from GitHub Actions. This prevents infinite loops and unnecessary API calls.

### Manual (Local Development)

To run the script locally:

```bash
# Set your token as an environment variable
export STATS_FM_TOKEN="your_token_here"

# Run the script
node scripts/fetch-music-data.js
```

## How It Works

1. **Fresh Data Fetch**: The script attempts to fetch fresh data from all 5 Stats.fm API endpoints
2. **Success Handling**: If successful, it saves the data to the `latest/` directory and backs up to `old/`
3. **Auto-Commit**: The GitHub Action automatically commits and pushes the fetched data back to your repository
4. **Failure Handling**: If the API token is expired or requests fail, it copies data from `old/` to `latest/`
5. **Graceful Degradation**: Your website will always have data to display, even if the API is temporarily unavailable

**Note**: The workflow includes `[skip ci]` in commit messages to prevent infinite loops when pushing data updates.

## Error Handling

The script handles various error scenarios:

- **Expired Token**: Uses fallback data from previous successful runs
- **Network Issues**: Retries and falls back to cached data
- **Partial Failures**: If some endpoints succeed and others fail, it uses a mix of fresh and cached data
- **First Run**: If no cached data exists and API fails, the script will exit with an error

## API Rate Limiting

The script includes a 1-second delay between API requests to be respectful to the Stats.fm API servers.

## Troubleshooting

### Common Issues

1. **"STATS_FM_TOKEN environment variable is required"**
   - Make sure you've added the `STATS_FM_TOKEN` secret in GitHub
   - For local runs, ensure the environment variable is set

2. **"HTTP 401" or "HTTP 403" errors**
   - Your bearer token has likely expired
   - Get a fresh token from Stats.fm and update the GitHub secret

3. **"No fallback data available"**
   - This happens on the first run when the API fails
   - Ensure your token is valid for the initial setup

### Debugging

To see detailed logs, check the GitHub Actions workflow run logs in your repository's Actions tab.

## File Descriptions

- `fetch-music-data.js`: Main script that handles API requests and data management
- `README.md`: This documentation file
- `../data/music/latest/`: Directory containing the most recent data
- `../data/music/old/`: Directory containing backup data for fallback

## Integration with Portfolio

The fetched JSON files can be imported and used in your React portfolio application. The data structure follows Stats.fm's API response format, containing detailed information about your music listening habits.
