// Poster Image Generation API
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/poster', async (req, res) => {
  const { prompt, style } = req.body

  if (!process.env.SILICONFLOW_API_KEY && !process.env.OPENAI_API_KEY) {
    // 返回模拟数据（开发测试用）
    return res.json({
      success: true,
      image: null,
      message: 'Poster generated from prompt: ' + prompt + ' (' + style + ' style)',
      prompt: prompt + ', ' + style + ' style, high quality, detailed'
    })
  }

  // 使用OpenAI DALL-E 3
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: `Create a high-quality poster image: ${prompt}. Style: ${style}. Make it professional and visually striking.`,
          n: 1,
          size: '1024x1024'
        })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message)
      }

      res.json({
        success: true,
        image: data.data[0].url,
        revised_prompt: data.data[0].revised_prompt
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
    return
  }

  // 使用硅基流动
  try {
    const response = await fetch('https://api.siliconflow.cn/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`
      },
      body: JSON.stringify({
        model: 'stabilityai/stable-diffusion-xl-base-1.0',
        prompt: `${prompt}, ${style} style, high quality, professional poster`,
        n: 1,
        size: '1024x1024'
      })
    })

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error.message)
    }

    res.json({
      success: true,
      image: data.data?.[0]?.url || data.images?.[0]?.url
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 Poster API Server running on http://localhost:${PORT}`)
  console.log(`📡 POST /api/poster {prompt, style}`)
})
