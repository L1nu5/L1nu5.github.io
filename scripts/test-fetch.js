const { fetchMusicData, copyOldToLatest } = require('./fetch-music-data');

// Simple test script to verify the setup
async function testFetch() {
  console.log('Testing Stats.fm Data Fetcher');
  console.log('============================');
  
  const testToken = process.env.STATS_FM_TOKEN;
  
  if (!testToken) {
    console.log('❌ No STATS_FM_TOKEN found in environment variables');
    console.log('Set it with: export STATS_FM_TOKEN="your_token_here"');
    return;
  }
  
  console.log('✅ STATS_FM_TOKEN found');
  console.log('Token preview:', testToken.substring(0, 20) + '...');
  
  try {
    console.log('\n🔄 Testing API fetch...');
    const result = await fetchMusicData(testToken);
    
    if (result.successCount > 0) {
      console.log(`✅ Successfully fetched ${result.successCount}/${result.totalCount} endpoints`);
      console.log('\nResults:');
      result.results.forEach(r => {
        console.log(`  ${r.success ? '✅' : '❌'} ${r.endpoint}`);
        if (!r.success) {
          console.log(`    Error: ${r.error}`);
        }
      });
    } else {
      console.log('❌ All API requests failed');
      console.log('\nTesting fallback mechanism...');
      const fallbackSuccess = copyOldToLatest();
      if (fallbackSuccess) {
        console.log('✅ Fallback data available');
      } else {
        console.log('❌ No fallback data available');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

if (require.main === module) {
  testFetch();
}
