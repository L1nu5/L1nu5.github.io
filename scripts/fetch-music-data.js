const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const API_ENDPOINTS = [
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

const DATA_DIR = path.join(__dirname, '..', 'data', 'music');
const LATEST_DIR = path.join(DATA_DIR, 'latest');
const OLD_DIR = path.join(DATA_DIR, 'old');

// Ensure directories exist
function ensureDirectories() {
  [DATA_DIR, LATEST_DIR, OLD_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

// Make HTTP request with promise
function makeRequest(url, bearerToken) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'authorization': `Bearer ${bearerToken}`,
        'user-agent': 'Mozilla/5.0 (compatible; GitHub-Actions-Bot/1.0)'
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(new Error(`Failed to parse JSON: ${error.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Copy old data to latest (fallback mechanism)
function copyOldToLatest() {
  console.log('Copying old data to latest directory as fallback...');
  
  if (!fs.existsSync(OLD_DIR)) {
    console.log('No old data directory found. Cannot use fallback.');
    return false;
  }

  let copiedFiles = 0;
  API_ENDPOINTS.forEach(endpoint => {
    const oldFile = path.join(OLD_DIR, endpoint.filename);
    const latestFile = path.join(LATEST_DIR, endpoint.filename);
    
    if (fs.existsSync(oldFile)) {
      try {
        fs.copyFileSync(oldFile, latestFile);
        console.log(`Copied ${endpoint.filename} from old to latest`);
        copiedFiles++;
      } catch (error) {
        console.error(`Failed to copy ${endpoint.filename}: ${error.message}`);
      }
    } else {
      console.log(`Old file ${endpoint.filename} not found`);
    }
  });

  return copiedFiles > 0;
}

// Copy latest data to old (backup mechanism)
function copyLatestToOld() {
  console.log('Backing up latest data to old directory...');
  
  API_ENDPOINTS.forEach(endpoint => {
    const latestFile = path.join(LATEST_DIR, endpoint.filename);
    const oldFile = path.join(OLD_DIR, endpoint.filename);
    
    if (fs.existsSync(latestFile)) {
      try {
        fs.copyFileSync(latestFile, oldFile);
        console.log(`Backed up ${endpoint.filename} to old directory`);
      } catch (error) {
        console.error(`Failed to backup ${endpoint.filename}: ${error.message}`);
      }
    }
  });
}

// Fetch data from API
async function fetchMusicData(bearerToken) {
  console.log('Starting music data fetch...');
  
  const results = [];
  let successCount = 0;
  
  for (const endpoint of API_ENDPOINTS) {
    try {
      console.log(`Fetching ${endpoint.filename}...`);
      const data = await makeRequest(endpoint.url, bearerToken);
      
      // Save to latest directory
      const filePath = path.join(LATEST_DIR, endpoint.filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      
      console.log(`✓ Successfully saved ${endpoint.filename}`);
      results.push({ endpoint: endpoint.filename, success: true });
      successCount++;
      
      // Add delay between requests to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`✗ Failed to fetch ${endpoint.filename}: ${error.message}`);
      results.push({ endpoint: endpoint.filename, success: false, error: error.message });
    }
  }
  
  return { results, successCount, totalCount: API_ENDPOINTS.length };
}

// Main function
async function main() {
  const bearerToken = process.env.STATS_FM_TOKEN;
  
  if (!bearerToken) {
    console.error('Error: STATS_FM_TOKEN environment variable is required');
    process.exit(1);
  }
  
  console.log('Stats.fm Data Fetcher');
  console.log('====================');
  
  // Ensure directories exist
  ensureDirectories();
  
  try {
    // Attempt to fetch fresh data
    const fetchResult = await fetchMusicData(bearerToken);
    
    if (fetchResult.successCount > 0) {
      console.log(`\n✓ Successfully fetched ${fetchResult.successCount}/${fetchResult.totalCount} endpoints`);
      
      // If we got some fresh data, backup the successful fetches
      copyLatestToOld();
      
      if (fetchResult.successCount < fetchResult.totalCount) {
        console.log('\nSome requests failed. You may want to check the logs above.');
        process.exit(1);
      }
    } else {
      console.log('\n✗ All API requests failed. Attempting to use fallback data...');
      
      const fallbackSuccess = copyOldToLatest();
      if (fallbackSuccess) {
        console.log('✓ Fallback data copied successfully');
      } else {
        console.error('✗ No fallback data available. This is likely the first run or all previous runs failed.');
        process.exit(1);
      }
    }
    
    console.log('\n🎵 Music data fetch completed successfully!');
    
  } catch (error) {
    console.error(`\nUnexpected error: ${error.message}`);
    
    // Try fallback
    console.log('Attempting to use fallback data...');
    const fallbackSuccess = copyOldToLatest();
    if (fallbackSuccess) {
      console.log('✓ Fallback data used successfully');
    } else {
      console.error('✗ No fallback data available');
      process.exit(1);
    }
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { main, fetchMusicData, copyOldToLatest };
