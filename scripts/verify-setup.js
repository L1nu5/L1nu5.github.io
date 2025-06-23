#!/usr/bin/env node

/**
 * Verification script to check if the music data automation setup is working correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🎵 Music Data Automation Setup Verification\n');

// Check if required directories exist for all ranges
const ranges = ['weeks', 'months', 'lifetime'];
const requiredDirs = [];

ranges.forEach(range => {
  requiredDirs.push(`data/music/${range}/latest`);
  requiredDirs.push(`data/music/${range}/old`);
  requiredDirs.push(`portfolio/public/data/music/${range}/latest`);
});

console.log('📁 Checking directory structure...');
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir} exists`);
  } else {
    console.log(`❌ ${dir} missing`);
  }
});

// Check if required files exist
const requiredFiles = [
  'scripts/fetch-music-data.js',
  '.github/workflows/deploy-gh-pages.yml'
];

console.log('\n📄 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Check if music data files exist for all ranges
const musicFiles = [
  'top-genres.json',
  'streams-stats.json', 
  'top-albums.json',
  'top-tracks.json',
  'top-artists.json'
];

console.log('\n🎶 Checking music data files...');
ranges.forEach(range => {
  console.log(`\n📅 ${range.toUpperCase()} Range:`);
  
  musicFiles.forEach(file => {
    const latestPath = `data/music/${range}/latest/${file}`;
    const oldPath = `data/music/${range}/old/${file}`;
    const publicPath = `portfolio/public/data/music/${range}/latest/${file}`;
    
    console.log(`\n  ${file}:`);
    
    if (fs.existsSync(latestPath)) {
      const stats = fs.statSync(latestPath);
      const size = (stats.size / 1024).toFixed(2);
      console.log(`    ✅ Latest: ${size} KB (${stats.mtime.toISOString()})`);
    } else {
      console.log(`    ❌ Latest: missing`);
    }
    
    if (fs.existsSync(oldPath)) {
      const stats = fs.statSync(oldPath);
      const size = (stats.size / 1024).toFixed(2);
      console.log(`    ✅ Backup: ${size} KB (${stats.mtime.toISOString()})`);
    } else {
      console.log(`    ❌ Backup: missing`);
    }
    
    if (fs.existsSync(publicPath)) {
      const stats = fs.statSync(publicPath);
      const size = (stats.size / 1024).toFixed(2);
      console.log(`    ✅ Public: ${size} KB (${stats.mtime.toISOString()})`);
    } else {
      console.log(`    ❌ Public: missing`);
    }
  });
});

// Check environment variable
console.log('\n🔑 Checking environment...');
if (process.env.STATS_FM_TOKEN) {
  console.log('✅ STATS_FM_TOKEN environment variable is set');
  if (process.env.STATS_FM_TOKEN.startsWith('Bearer ')) {
    console.log('✅ Token has correct Bearer prefix');
  } else {
    console.log('⚠️  Token should start with "Bearer "');
  }
} else {
  console.log('❌ STATS_FM_TOKEN environment variable not set');
  console.log('   Set it with: export STATS_FM_TOKEN="Bearer your_token_here"');
}

// Check GitHub workflow
console.log('\n⚙️  Checking GitHub workflow...');
if (fs.existsSync('.github/workflows/deploy-gh-pages.yml')) {
  const workflow = fs.readFileSync('.github/workflows/deploy-gh-pages.yml', 'utf8');
  
  if (workflow.includes('STATS_FM_TOKEN')) {
    console.log('✅ Workflow uses STATS_FM_TOKEN secret');
  } else {
    console.log('❌ Workflow missing STATS_FM_TOKEN secret');
  }
  
  if (workflow.includes('fetch-music-data.js')) {
    console.log('✅ Workflow runs music data fetch script');
  } else {
    console.log('❌ Workflow missing music data fetch step');
  }
  
  if (workflow.includes('schedule:')) {
    console.log('✅ Workflow has scheduled runs');
  } else {
    console.log('❌ Workflow missing schedule trigger');
  }
} else {
  console.log('❌ GitHub workflow file missing');
}

// Test data validity
console.log('\n🧪 Testing data validity...');
musicFiles.forEach(file => {
  const filePath = `data/music/latest/${file}`;
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`✅ ${file}: Valid JSON`);
      
      // Basic structure checks
      if (file === 'top-tracks.json' && data.items && Array.isArray(data.items)) {
        console.log(`   📊 Contains ${data.items.length} tracks`);
      } else if (file === 'streams-stats.json' && typeof data.count === 'number') {
        console.log(`   📊 ${data.count} total streams`);
      } else if (file === 'top-artists.json' && data.items && Array.isArray(data.items)) {
        console.log(`   📊 Contains ${data.items.length} artists`);
      } else if (file === 'top-albums.json' && data.items && Array.isArray(data.items)) {
        console.log(`   📊 Contains ${data.items.length} albums`);
      } else if (file === 'top-genres.json' && data.items && Array.isArray(data.items)) {
        console.log(`   📊 Contains ${data.items.length} genres`);
      }
    } catch (error) {
      console.log(`❌ ${file}: Invalid JSON - ${error.message}`);
    }
  }
});

console.log('\n🎯 Summary:');
console.log('If all checks pass, your music data automation is ready!');
console.log('If there are issues, refer to MUSIC_DATA_AUTOMATION_GUIDE.md for troubleshooting.');

// Check if we can run the fetch script
console.log('\n🚀 Quick test recommendation:');
if (process.env.STATS_FM_TOKEN) {
  console.log('Run: node scripts/fetch-music-data.js');
  console.log('This will test the API connection and update your data.');
} else {
  console.log('Set STATS_FM_TOKEN environment variable first, then run:');
  console.log('node scripts/fetch-music-data.js');
}
