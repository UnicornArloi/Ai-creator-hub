// SiliconFlow AI API - Local test server
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')

const app = express()
app.use(cors())
app.use(express.json())

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

function getSystemPrompt(type) {
  const prompts = {
    token: '你是一个智能合约专家。用户会提供代币名称、符号等信息，你需要生成一个BEP-20代币合约代码。直接输出代码，不需要解释。',
    business_plan: '你是一个商业策划专家。用户会提供项目信息，你需要生成一份专业的商业计划书。格式清晰。',
    ppt: '你是一个PPT策划专家。根据项目信息，生成PPT大纲。列出每页标题和要点。',
    poster: '你是一个平面设计师。生成海报设计描述。包括配色、布局，文案建议。',
    docs: '你是一个技术文档专家。生成专业的白皮书或技术文档。结构清晰。',
    website: '你是一个网站策划专家。生成单页网站内容。'
  }
  return prompts[type] || prompts.business_plan
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 SiliconFlow AI Server running on http://localhost:${PORT}`)
  console.log(`📡 POST /api/generate {prompt, type}`)
})
