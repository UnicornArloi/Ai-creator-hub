#!/usr/bin/env node
/**
 * Test jiekou.ai API with timeout handling
 */

const API_KEY = 'sk_-GORE__SpgDqJ4U__jLnVTRTtupCL1QmoZk4UPB2RLg'

async function testAPI() {
  console.log('🧪 Testing jiekou.ai API...')
  console.log('=' .repeat(50))
  
  const startTime = Date.now()
  let timeout = false
  
  // 30 second timeout
  const timeoutId = setTimeout(() => {
    timeout = true
    console.log('⏰ TIMEOUT: Request took longer than 30 seconds')
  }, 30000)
  
  try {
    console.log('📡 Sending request...')
    
    const response = await fetch('https://api.jikkou.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: 'cyberpunk city poster neon lights',
        n: 1,
        size: 'auto'
      })
    })
    
    clearTimeout(timeoutId)
    const duration = Date.now() - startTime
    
    console.log(`✅ Response received in ${duration}ms`)
    console.log(`📊 Status: ${response.status} ${response.statusText}`)
    console.log(`📋 Headers:`, Object.fromEntries(response.headers.entries()))
    
    const text = await response.text()
    console.log(`📝 Response length: ${text.length} chars`)
    console.log(`📄 Response preview: ${text.substring(0, 300)}...`)
    
    try {
      const json = JSON.parse(text)
      console.log('\n🔍 Parsed JSON:')
      console.log(JSON.stringify(json, null, 2))
      
      if (json.code) {
        console.log(`\n❌ API Error: ${json.code} - ${json.message || 'Unknown error'}`)
      } else if (json.data && json.data[0]) {
        const imgData = json.data[0]
        if (imgData.b64_json) {
          console.log(`\n✅ SUCCESS: b64_json found! Length: ${imgData.b64_json.length}`)
          console.log(`🖼️ First 100 chars: ${imgData.b64_json.substring(0, 100)}...`)
        }
        if (imgData.url) {
          console.log(`\n✅ SUCCESS: URL found: ${imgData.url}`)
        }
      } else {
        console.log('\n⚠️ No image data in response')
      }
    } catch(e) {
      console.log('\n❌ JSON Parse Error:', e.message)
    }
    
  } catch (err) {
    clearTimeout(timeoutId)
    const duration = Date.now() - startTime
    console.log(`\n❌ Fetch Error after ${duration}ms:`)
    console.log(`   ${err.name}: ${err.message}`)
    console.log(`   ${err.stack}`)
  }
  
  console.log('\n' + '=' .repeat(50))
  console.log('🏁 Test complete')
}

// Run test
testAPI()
