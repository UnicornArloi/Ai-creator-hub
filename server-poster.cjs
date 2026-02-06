// Poster Image API - Generate poster using AI text + placeholder approach
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/poster', async (req, res) => {
  const { prompt, style } = req.body

  // 返回生成信息，前端用Canvas绘制
  res.json({
    success: true,
    prompt: prompt,
    style: style,
    message: 'Poster generated successfully',
    tips: 'Use this prompt with your preferred image generator: ' + prompt + ', ' + style + ' style'
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 Poster Server running on http://localhost:${PORT}`)
  console.log(`📡 POST /api/poster {prompt, style}`)
})
