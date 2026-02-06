// Combined API Server - All AI Generation Endpoints
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')

const app = express()
app.use(cors())
app.use(express.json())

// Text Generation Endpoint (SiliconFlow Qwen)
app.post('/api/generate', async (req, res) => {
  const { prompt, type } = req.body

  if (!process.env.SILICONFLOW_API_KEY) {
    return res.status(500).json({ 
      error: 'API Key not configured',
      message: 'Please set SILICONFLOW_API_KEY in .env file'
    })
  }

  try {
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-72B-Instruct',
        messages: [
          { role: 'system', content: getSystemPrompt(type) },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    })

    const data = await response.json()
    
    if (data.error) {
      return res.status(400).json({ error: data.error.message })
    }

    res.json({ 
      result: data.choices?.[0]?.message?.content,
      usage: data.usage
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Poster Image Generation Endpoint (Leonardo.ai)
app.post('/api/poster', async (req, res) => {
  const { prompt, style } = req.body

  if (!process.env.LEONARDO_API_KEY) {
    return res.status(500).json({ 
      error: 'API Key not configured',
      message: 'Please set LEONARDO_API_KEY in .env file'
    })
  }

  const leoPrompt = `${prompt}, ${style} style, high quality, professional poster`

  try {
    // Step 1: Create generation
    const createResponse = await fetch('https://cloud.leonardo.ai/api/v1/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LEONARDO_API_KEY}`,
        'X-Require-Auth': 'true'
      },
      body: JSON.stringify({
        prompt: leoPrompt,
        negative_prompt: 'low quality, blurry, text, watermark, ugly',
        width: 1024,
        height: 1024,
        num_images: 1
      })
    })

    const createData = await createResponse.json()

    if (createData.error) {
      return res.status(400).json({ error: createData.error.message })
    }

    const generationId = createData.generationId

    // Step 2: Poll for result
    let attempts = 0
    let imageUrl = null

    while (attempts < 30 && !imageUrl) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const statusResponse = await fetch(`https://cloud.leonardo.ai/api/v1/generations/${generationId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.LEONARDO_API_KEY}`,
          'X-Require-Auth': 'true'
        }
      })

      const statusData = await statusResponse.json()

      if (statusData.generations_by_pk?.status === 'COMPLETE') {
        imageUrl = statusData.generations_by_pk.generated_images?.[0]?.url
        break
      } else if (statusData.generations_by_pk?.status === 'FAILED') {
        return res.status(400).json({ error: 'Image generation failed' })
      }

      attempts++
    }

    if (imageUrl) {
      res.json({
        success: true,
        image: imageUrl,
        prompt: leoPrompt
      })
    } else {
      res.status(400).json({ error: 'Generation timeout' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

function getSystemPrompt(type) {
  const prompts = {
    token: `你是一个智能合约专家。用户会提供代币名称、符号等信息，你需要生成一个BEP-20代币合约代码。直接输出代码，不需要解释。`,

    business_plan: `你是一个商业策划专家。用户会提供项目信息，你需要生成一份专业的商业计划书。格式清晰，包含：执行摘要、市场机会、产品功能、盈利模式、路线图。`,

    ppt: `你是一个PPT策划专家。根据用户提供的项目信息，生成PPT大纲。列出每页标题和要点，简洁明了。`,

    poster: `你是一个平面设计师。用户会提供项目名称和风格，生成海报设计描述。包括配色、布局，文案建议。`,

    docs: `你是一个技术文档专家。用户会提供项目信息，生成专业的白皮书或技术文档。结构清晰，内容详实。`,

    website: `你是一个网站策划专家。根据项目信息，生成单页网站内容。包括：Hero区、特性介绍、团队信息、路线图等。`
  }
  return prompts[type] || prompts.business_plan
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 AI Server running on http://localhost:${PORT}`)
  console.log(`📡 POST /api/generate {prompt, type}`)
  console.log(`📡 POST /api/poster {prompt, style}`)
  console.log(`\n⚠️  Required env vars:`)
  console.log(`   - SILICONFLOW_API_KEY (for text generation)`)
  console.log(`   - LEONARDO_API_KEY (for image generation)`)
})
