// AI API Utility - Shared across all pages

const API_URL = import.meta.env.PROD 
  ? '/api/generate' 
  : 'http://localhost:3001/api/generate'

export async function generateAI(prompt, type) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, type })
    })

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    return data.result
  } catch (error) {
    console.error('AI Generation Error:', error)
    throw error
  }
}

export async function generateToken(name, symbol, supply) {
  const prompt = `创建一个名为${name}、符号为${symbol}、总供应量为${supply}的BEP-20代币合约。包含：代币名称、符号、小数位数、总供应量、转账功能。`
  return generateAI(prompt, 'token')
}

export async function generateBusinessPlan(projectName, description) {
  const prompt = `项目名称：${projectName}\n项目描述：${description}\n\n生成一份专业的商业计划书，包含：执行摘要、市场机会、产品功能、盈利模式、营销策略、路线图。`
  return generateAI(prompt, 'business_plan')
}

export async function generatePPT(projectName, type) {
  const prompt = `为"${projectName}"项目生成一份${type}风格的PPT大纲。列出每页标题和要点。`
  return generateAI(prompt, 'ppt')
}

export async function generatePoster(projectName, style) {
  const prompt = `为"${projectName}"项目设计一张${style}风格的海报。描述配色、布局、主要元素、文案。`
  return generateAI(prompt, 'poster')
}

export async function generateDocs(projectName, type) {
  const prompt = `为"${projectName}"项目生成一份${type}文档。结构清晰，内容详实。`
  return generateAI(prompt, 'docs')
}

export async function generateWebsite(projectName, description) {
  const prompt = `为"${projectName}"项目生成单页网站内容。项目描述：${description}\n\n生成：Hero区、特性介绍、团队信息、路线图、FAQ。`
  return generateAI(prompt, 'website')
}
