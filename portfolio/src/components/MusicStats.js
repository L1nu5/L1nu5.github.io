import React, { useState, useEffect } from 'react';
import './MusicStats.css';

const MusicStats = () => {
  const [musicData, setMusicData] = useState({
    genres: null,
    stats: null,
    albums: null,
    tracks: null,
    artists: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const loadMusicData = async () => {
      try {
        // Load all music data files
        const [genresRes, statsRes, albumsRes, tracksRes, artistsRes] = await Promise.allSettled([
          fetch('/data/music/latest/top-genres.json'),
          fetch('/data/music/latest/streams-stats.json'),
          fetch('/data/music/latest/top-albums.json'),
          fetch('/data/music/latest/top-tracks.json'),
          fetch('/data/music/latest/top-artists.json')
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
  }, []);

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
      <h2>🎵 My Music Stats (This Week)</h2>
      
      {/* Stream Statistics */}
      {musicData.stats && (
        <div className="stats-section">
          <h3>Listening Activity</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{musicData.stats.count || 0}</span>
              <span className="stat-label">Total Streams</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {musicData.stats.durationMs ? Math.round(musicData.stats.durationMs / 1000 / 60) : 0}
              </span>
              <span className="stat-label">Minutes Listened</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Artists */}
      {musicData.artists && musicData.artists.items && (
        <div className="top-section">
          <h3>Top Artists</h3>
          <div className="top-list">
            {musicData.artists.items.slice(0, 5).map((artist, index) => (
              <div key={artist.id || index} className="top-item">
                <span className="rank">#{index + 1}</span>
                <div className="item-info">
                  <span className="item-name">{artist.name}</span>
                  <span className="item-plays">{artist.playcount} plays</span>
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
            {musicData.tracks.items.slice(0, 5).map((track, index) => (
              <div key={track.id || index} className="top-item">
                <span className="rank">#{index + 1}</span>
                <div className="item-info">
                  <span className="item-name">{track.name}</span>
                  <span className="item-artist">by {track.artists?.[0]?.name || 'Unknown Artist'}</span>
                  <span className="item-plays">{track.playcount} plays</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Genres */}
      {musicData.genres && musicData.genres.items && (
        <div className="top-section">
          <h3>Top Genres</h3>
          <div className="genre-tags">
            {musicData.genres.items.slice(0, 8).map((genre, index) => (
              <span key={genre.genre || index} className="genre-tag">
                {genre.genre} ({genre.playcount})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Top Albums */}
      {musicData.albums && musicData.albums.items && (
        <div className="top-section">
          <h3>Top Albums</h3>
          <div className="top-list">
            {musicData.albums.items.slice(0, 3).map((album, index) => (
              <div key={album.id || index} className="top-item">
                <span className="rank">#{index + 1}</span>
                <div className="item-info">
                  <span className="item-name">{album.name}</span>
                  <span className="item-artist">by {album.artists?.[0]?.name || 'Unknown Artist'}</span>
                  <span className="item-plays">{album.playcount} plays</span>
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
