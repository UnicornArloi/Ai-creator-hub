const https = require('https')

const JIEKOU_API_KEY = 'sk_-GORE__SpgDqJ4U__jLnVTRTtupCL1QmoZk4UPB2RLg'

const data = JSON.stringify({
  model: 'gpt-image-1',
  prompt: 'A cyberpunk city with neon lights, poster style',
  n: 1,
  size: 'auto'
})

const options = {
  hostname: 'api.jiekou.ai',
  path: '/v1/images/generations',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + JIEKOU_API_KEY
  }
}

const req = https.request(options, res => {
  console.log('Status:', res.statusCode)
  let body = ''
  res.on('data', chunk => body += chunk)
  res.on('end', () => {
    console.log('Response:', body.substring(0, 500))
  })
})

req.on('error', e => console.log('Error:', e.message))
req.write(data)
req.end()
