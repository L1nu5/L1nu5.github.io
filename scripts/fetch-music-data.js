const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const BASE_URL = 'https://api.stats.fm/api/v1/users/tm2zrwndrp4mc7bhl3ewe94bn';
const RANGES = ['weeks', 'months', 'lifetime'];

// API endpoint templates
const ENDPOINT_TEMPLATES = [
  { name: 'top-genres', path: '/top/genres' },
  { name: 'streams-stats', path: '/streams/stats' },
  { name: 'top-albums', path: '/top/albums' },
  { name: 'top-tracks', path: '/top/tracks' },
  { name: 'top-artists', path: '/top/artists' }
];

const DATA_DIR = path.join(__dirname, '..', 'data', 'music');

// Generate directory paths for each range
function getDirectoryPaths(range) {
  const rangeDir = path.join(DATA_DIR, range);
  return {
    latest: path.join(rangeDir, 'latest'),
    old: path.join(rangeDir, 'old'),
    public: path.join(__dirname, '..', 'portfolio', 'public', 'data', 'music', range, 'latest')
  };
}

// Generate API endpoints for a specific range
function generateEndpoints(range) {
  return ENDPOINT_TEMPLATES.map(template => ({
    name: template.name,
    url: `${BASE_URL}${template.path}?range=${range}`,
    filename: `${template.name}.json`
  }));
}

// Ensure directories exist for all ranges
function ensureDirectories() {
  RANGES.forEach(range => {
    const paths = getDirectoryPaths(range);
    [paths.latest, paths.old, paths.public].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    });
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
function copyOldToLatest(range) {
  console.log(`Copying old ${range} data to latest directory as fallback...`);
  
  const paths = getDirectoryPaths(range);
  const endpoints = generateEndpoints(range);
  
  if (!fs.existsSync(paths.old)) {
    console.log(`No old ${range} data directory found. Cannot use fallback.`);
    return false;
  }

  let copiedFiles = 0;
  endpoints.forEach(endpoint => {
    const oldFile = path.join(paths.old, endpoint.filename);
    const latestFile = path.join(paths.latest, endpoint.filename);
    
    if (fs.existsSync(oldFile)) {
      try {
        fs.copyFileSync(oldFile, latestFile);
        console.log(`Copied ${range}/${endpoint.filename} from old to latest`);
        copiedFiles++;
      } catch (error) {
        console.error(`Failed to copy ${range}/${endpoint.filename}: ${error.message}`);
      }
    } else {
      console.log(`Old file ${range}/${endpoint.filename} not found`);
    }
  });

  return copiedFiles > 0;
}

// Copy latest data to old (backup mechanism)
function copyLatestToOld(range) {
  console.log(`Backing up latest ${range} data to old directory...`);
  
  const paths = getDirectoryPaths(range);
  const endpoints = generateEndpoints(range);
  
  endpoints.forEach(endpoint => {
    const latestFile = path.join(paths.latest, endpoint.filename);
    const oldFile = path.join(paths.old, endpoint.filename);
    
    if (fs.existsSync(latestFile)) {
      try {
        fs.copyFileSync(latestFile, oldFile);
        console.log(`Backed up ${range}/${endpoint.filename} to old directory`);
      } catch (error) {
        console.error(`Failed to backup ${range}/${endpoint.filename}: ${error.message}`);
      }
    }
  });
}

// Copy data to public directory for React access
function copyToPublic(range) {
  console.log(`Copying ${range} data to public directory...`);
  
  const paths = getDirectoryPaths(range);
  const endpoints = generateEndpoints(range);
  
  endpoints.forEach(endpoint => {
    const latestFile = path.join(paths.latest, endpoint.filename);
    const publicFile = path.join(paths.public, endpoint.filename);
    
    if (fs.existsSync(latestFile)) {
      try {
        fs.copyFileSync(latestFile, publicFile);
        console.log(`Copied ${range}/${endpoint.filename} to public directory`);
      } catch (error) {
        console.error(`Failed to copy ${range}/${endpoint.filename} to public: ${error.message}`);
      }
    }
  });
}

// Fetch data from API for a specific range
async function fetchMusicDataForRange(bearerToken, range) {
  console.log(`\nFetching ${range} data...`);
  console.log('='.repeat(30));
  
  const endpoints = generateEndpoints(range);
  const paths = getDirectoryPaths(range);
  const results = [];
  let successCount = 0;
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Fetching ${range}/${endpoint.filename}...`);
      const data = await makeRequest(endpoint.url, bearerToken);
      
      // Save to latest directory
      const filePath = path.join(paths.latest, endpoint.filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      
      console.log(`✓ Successfully saved ${range}/${endpoint.filename}`);
      results.push({ endpoint: endpoint.filename, success: true });
      successCount++;
      
      // Add delay between requests to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`✗ Failed to fetch ${range}/${endpoint.filename}: ${error.message}`);
      results.push({ endpoint: endpoint.filename, success: false, error: error.message });
    }
  }
  
  return { results, successCount, totalCount: endpoints.length, range };
}

// Fetch data for all ranges
async function fetchAllMusicData(bearerToken) {
  console.log('Starting music data fetch for all ranges...');
  
  const allResults = [];
  let totalSuccess = 0;
  let totalRequests = 0;
  
  for (const range of RANGES) {
    const result = await fetchMusicDataForRange(bearerToken, range);
    allResults.push(result);
    totalSuccess += result.successCount;
    totalRequests += result.totalCount;
    
    if (result.successCount > 0) {
      // Backup successful fetches
      copyLatestToOld(range);
      // Copy to public directory
      copyToPublic(range);
    } else {
      // Use fallback data if available
      console.log(`\n✗ All ${range} API requests failed. Attempting to use fallback data...`);
      const fallbackSuccess = copyOldToLatest(range);
      if (fallbackSuccess) {
        console.log(`✓ ${range} fallback data copied successfully`);
        copyToPublic(range);
      } else {
        console.error(`✗ No ${range} fallback data available.`);
      }
    }
  }
  
  return { allResults, totalSuccess, totalRequests };
}

// Main function
async function main() {
  const bearerToken = process.env.STATS_FM_TOKEN;
  
  if (!bearerToken) {
    console.error('Error: STATS_FM_TOKEN environment variable is required');
    process.exit(1);
  }
  
  console.log('Stats.fm Multi-Range Data Fetcher');
  console.log('==================================');
  console.log(`Fetching data for ranges: ${RANGES.join(', ')}`);
  
  // Ensure directories exist
  ensureDirectories();
  
  try {
    // Attempt to fetch fresh data for all ranges
    const fetchResult = await fetchAllMusicData(bearerToken);
    
    console.log('\n' + '='.repeat(50));
    console.log('SUMMARY');
    console.log('='.repeat(50));
    
    fetchResult.allResults.forEach(result => {
      console.log(`${result.range}: ${result.successCount}/${result.totalCount} endpoints successful`);
    });
    
    console.log(`\nOverall: ${fetchResult.totalSuccess}/${fetchResult.totalRequests} requests successful`);
    
    if (fetchResult.totalSuccess > 0) {
      console.log('\n🎵 Music data fetch completed successfully!');
    } else {
      console.log('\n⚠️  All API requests failed, but fallback data may have been used.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error(`\nUnexpected error: ${error.message}`);
    
    // Try fallback for all ranges
    console.log('Attempting to use fallback data for all ranges...');
    let anyFallbackSuccess = false;
    
    for (const range of RANGES) {
      const fallbackSuccess = copyOldToLatest(range);
      if (fallbackSuccess) {
        console.log(`✓ ${range} fallback data used successfully`);
        copyToPublic(range);
        anyFallbackSuccess = true;
      } else {
        console.error(`✗ No ${range} fallback data available`);
      }
    }
    
    if (!anyFallbackSuccess) {
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

module.exports = { main, fetchAllMusicData, copyOldToLatest, RANGES };
