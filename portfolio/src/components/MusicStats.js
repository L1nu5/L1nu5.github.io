import React, { useState, useEffect } from 'react';
import './MusicStats.css';

const MusicStats = () => {
  const [selectedRange, setSelectedRange] = useState('weeks');
  const [musicData, setMusicData] = useState({
    genres: null,
    stats: null,
    albums: null,
    tracks: null,
    artists: null,
    loading: true,
    error: null
  });

  const ranges = [
    { value: 'weeks', label: 'This Week' },
    { value: 'months', label: 'This Month' },
    { value: 'lifetime', label: 'All Time' }
  ];

  useEffect(() => {
    const loadMusicData = async () => {
      setMusicData(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        // Load all music data files for the selected range
        const [genresRes, statsRes, albumsRes, tracksRes, artistsRes] = await Promise.allSettled([
          fetch(`/data/music/${selectedRange}/latest/top-genres.json`),
          fetch(`/data/music/${selectedRange}/latest/streams-stats.json`),
          fetch(`/data/music/${selectedRange}/latest/top-albums.json`),
          fetch(`/data/music/${selectedRange}/latest/top-tracks.json`),
          fetch(`/data/music/${selectedRange}/latest/top-artists.json`)
        ]);

        const data = {};
        
        if (genresRes.status === 'fulfilled' && genresRes.value.ok) {
          data.genres = await genresRes.value.json();
        }
        if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
          data.stats = await statsRes.value.json();
        }
        if (albumsRes.status === 'fulfilled' && albumsRes.value.ok) {
          data.albums = await albumsRes.value.json();
        }
        if (tracksRes.status === 'fulfilled' && tracksRes.value.ok) {
          data.tracks = await tracksRes.value.json();
        }
        if (artistsRes.status === 'fulfilled' && artistsRes.value.ok) {
          data.artists = await artistsRes.value.json();
        }

        setMusicData({
          ...data,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Failed to load music data:', error);
        setMusicData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load music data'
        }));
      }
    };

    loadMusicData();
  }, [selectedRange]);

  const handleRangeChange = (event) => {
    setSelectedRange(event.target.value);
  };

  const getCurrentRangeLabel = () => {
    return ranges.find(range => range.value === selectedRange)?.label || 'This Week';
  };

  if (musicData.loading) {
    return (
      <div className="music-stats-loading">
        <p>Loading music stats...</p>
      </div>
    );
  }

  if (musicData.error) {
    return (
      <div className="music-stats-error">
        <p>Unable to load music statistics</p>
      </div>
    );
  }

  return (
    <div className="music-stats">
      <div className="music-stats-header">
        <h2>🎵 My Music Stats</h2>
        <div className="range-selector">
          <label htmlFor="range-select">Time Range:</label>
          <select 
            id="range-select"
            value={selectedRange} 
            onChange={handleRangeChange}
            className="range-dropdown"
          >
            {ranges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Stream Statistics */}
      {musicData.stats && (
        <div className="stats-section">
          <h3>Listening Activity ({getCurrentRangeLabel()})</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{musicData.stats.items?.count || 0}</span>
              <span className="stat-label">Total Streams</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {musicData.stats.items?.durationMs ? Math.round(musicData.stats.items.durationMs / 1000 / 60 / 60 / 24) : 0}
              </span>
              <span className="stat-label">Days Listened</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{musicData.stats.items?.cardinality?.tracks || 0}</span>
              <span className="stat-label">Unique Tracks</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{musicData.stats.items?.cardinality?.artists || 0}</span>
              <span className="stat-label">Unique Artists</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{musicData.stats.items?.cardinality?.albums || 0}</span>
              <span className="stat-label">Unique Albums</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Genres */}
      {musicData.genres && musicData.genres.items && (
        <div className="top-section">
          <h3>Top Genres</h3>
          <div className="genre-tags">
            {musicData.genres.items.slice(0, 8).map((genre, index) => (
              <span key={genre.genre?.tag || index} className="genre-tag">
                {genre.genre?.tag || 'Unknown'} ({genre.streams})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Top Artists */}
      {musicData.artists && musicData.artists.items && (
        <div className="top-section">
          <h3>Top Artists</h3>
          <div className="top-list">
            {musicData.artists.items.slice(0, 5).map((artistItem, index) => (
              <div key={artistItem.artist?.id || index} className="top-item">
                <span className="rank">#{index + 1}</span>
                {artistItem.artist?.image && (
                  <img 
                    src={artistItem.artist.image} 
                    alt={artistItem.artist?.name || 'Artist'} 
                    className="item-image"
                  />
                )}
                <div className="item-info">
                  <span className="item-name">{artistItem.artist?.name || 'Unknown Artist'}</span>
                  <span className="item-plays">{artistItem.streams} streams</span>
                  {artistItem.playedMs && (
                    <span className="item-time">{Math.round(artistItem.playedMs / 1000 / 60)} minutes</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Tracks */}
      {musicData.tracks && musicData.tracks.items && (
        <div className="top-section">
          <h3>Top Tracks</h3>
          <div className="top-list">
            {musicData.tracks.items.slice(0, 5).map((trackItem, index) => (
              <div key={trackItem.track?.id || index} className="top-item">
                <span className="rank">#{index + 1}</span>
                {trackItem.track?.albums?.[0]?.image && (
                  <img 
                    src={trackItem.track.albums[0].image} 
                    alt={trackItem.track?.name || 'Track'} 
                    className="item-image"
                  />
                )}
                <div className="item-info">
                  <span className="item-name">{trackItem.track?.name || 'Unknown Track'}</span>
                  <span className="item-artist">by {trackItem.track?.artists?.[0]?.name || 'Unknown Artist'}</span>
                  <span className="item-plays">{trackItem.streams} streams</span>
                  {trackItem.playedMs && (
                    <span className="item-time">{Math.round(trackItem.playedMs / 1000 / 60)} minutes</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Albums */}
      {musicData.albums && musicData.albums.items && (
        <div className="top-section">
          <h3>Top Albums</h3>
          <div className="top-list">
            {musicData.albums.items.slice(0, 3).map((albumItem, index) => (
              <div key={albumItem.album?.id || index} className="top-item">
                <span className="rank">#{index + 1}</span>
                {albumItem.album?.image && (
                  <img 
                    src={albumItem.album.image} 
                    alt={albumItem.album?.name || 'Album'} 
                    className="item-image"
                  />
                )}
                <div className="item-info">
                  <span className="item-name">{albumItem.album?.name || 'Unknown Album'}</span>
                  <span className="item-artist">by {albumItem.album?.artists?.[0]?.name || 'Unknown Artist'}</span>
                  <span className="item-plays">{albumItem.streams} streams</span>
                  {albumItem.playedMs && (
                    <span className="item-time">{Math.round(albumItem.playedMs / 1000 / 60)} minutes</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="music-stats-footer">
        <p>Data from <a href="https://stats.fm" target="_blank" rel="noopener noreferrer">Stats.fm</a></p>
      </div>
    </div>
  );
};

export default MusicStats;
