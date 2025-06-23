# Music Data Integration Guide

This guide explains how to access and use the Stats.fm music data in your portfolio.

## 🎵 How It Works

### 1. Data Flow
```
Stats.fm API → GitHub Action → JSON Files → React Component → Your Portfolio
```

### 2. File Structure
```
portfolio/
├── public/
│   └── data/
│       └── music/
│           └── latest/
│               ├── top-genres.json
│               ├── streams-stats.json
│               ├── top-albums.json
│               ├── top-tracks.json
│               └── top-artists.json
└── src/
    └── components/
        ├── MusicStats.js
        └── MusicStats.css
```

## 🔧 Integration Steps

### Step 1: Data is Already Available
The GitHub Action has already fetched your music data and placed it in:
- `data/music/latest/` (root level - for GitHub Action)
- `portfolio/public/data/music/latest/` (for React app)

### Step 2: Component is Already Integrated
The `MusicStats` component is already integrated into your `MusicEvents` tab under the "📊 Music Stats" section.

### Step 3: How to View It
1. Go to your portfolio website
2. Click on the "🎵 Music Events" tab
3. Click on the "📊 Music Stats" sub-tab
4. You'll see your Stats.fm data displayed!

## 📊 What Data is Available

### 1. Stream Statistics (`streams-stats.json`)
```json
{
  "count": 1234,
  "durationMs": 5678900
}
```

### 2. Top Artists (`top-artists.json`)
```json
{
  "items": [
    {
      "id": "artist-id",
      "name": "Artist Name",
      "playcount": 123
    }
  ]
}
```

### 3. Top Tracks (`top-tracks.json`)
```json
{
  "items": [
    {
      "id": "track-id",
      "name": "Track Name",
      "artists": [{"name": "Artist Name"}],
      "playcount": 45
    }
  ]
}
```

### 4. Top Albums (`top-albums.json`)
```json
{
  "items": [
    {
      "id": "album-id",
      "name": "Album Name",
      "artists": [{"name": "Artist Name"}],
      "playcount": 23
    }
  ]
}
```

### 5. Top Genres (`top-genres.json`)
```json
{
  "items": [
    {
      "genre": "Genre Name",
      "playcount": 67
    }
  ]
}
```

## 🎨 Customization Options

### Option 1: Modify the MusicStats Component
Edit `portfolio/src/components/MusicStats.js` to:
- Change the number of items displayed
- Modify the styling
- Add new sections
- Change the layout

### Option 2: Create Your Own Component
```javascript
import React, { useState, useEffect } from 'react';

const MyMusicComponent = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetch('/data/music/latest/top-artists.json')
      .then(res => res.json())
      .then(data => setArtists(data.items || []))
      .catch(err => console.error('Failed to load artists:', err));
  }, []);

  return (
    <div>
      <h3>My Top Artists</h3>
      {artists.slice(0, 5).map((artist, index) => (
        <div key={artist.id}>
          {index + 1}. {artist.name} ({artist.playcount} plays)
        </div>
      ))}
    </div>
  );
};

export default MyMusicComponent;
```

### Option 3: Use Data in Other Components
You can fetch and use this data in any React component:

```javascript
// In any component
const [musicData, setMusicData] = useState(null);

useEffect(() => {
  const loadData = async () => {
    try {
      const response = await fetch('/data/music/latest/top-tracks.json');
      const data = await response.json();
      setMusicData(data);
    } catch (error) {
      console.error('Failed to load music data:', error);
    }
  };
  loadData();
}, []);
```

## 🔄 Data Updates

### Automatic Updates
- **On Push**: Every time you push code to main branch
- **Weekly**: Every Sunday at midnight UTC
- **Manual**: Run the GitHub Action manually

### Manual Local Testing
```bash
# Set your token
export STATS_FM_TOKEN="your_token_here"

# Run the fetch script
node scripts/fetch-music-data.js

# Copy to portfolio public folder
cp data/music/latest/*.json portfolio/public/data/music/latest/

# Start the portfolio
cd portfolio && npm start
```

## 🎯 Current Integration

Your music data is already integrated and accessible at:
- **URL**: Your portfolio website
- **Tab**: 🎵 Music Events
- **Sub-tab**: 📊 Music Stats
- **Component**: `MusicStats` (displays all your Stats.fm data)

## 🚀 Next Steps

1. **View Your Data**: Go to your portfolio and check the Music Stats tab
2. **Customize**: Modify the `MusicStats` component to match your preferences
3. **Expand**: Add the music data to other parts of your portfolio
4. **Style**: Customize the CSS in `MusicStats.css`

## 🔍 Troubleshooting

### Data Not Loading?
1. Check if files exist in `portfolio/public/data/music/latest/`
2. Check browser console for fetch errors
3. Verify GitHub Action ran successfully
4. Ensure `STATS_FM_TOKEN` secret is set correctly

### Component Not Showing?
1. Verify the import in `MusicEvents.js`
2. Check for JavaScript errors in browser console
3. Ensure you're on the correct tab (Music Events → Music Stats)

### Styling Issues?
1. Check if `MusicStats.css` is imported
2. Verify CSS classes are applied correctly
3. Use browser dev tools to inspect styles

Your Stats.fm music data is now fully integrated and ready to use! 🎵
