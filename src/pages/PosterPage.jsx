import React, { useState, useEffect, useRef } from 'react'

export default function PosterPage() {
  const [connected, setConnected] = useState(false)
  const [addr, setAddr] = useState('')
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('Cyberpunk')
  const [generating, setGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const canvasRef = useRef(null)

  const styles = ['Cyberpunk', 'Minimal', 'Gradient', 'Cute', 'Realistic', 'Anime']
  const JIEKOU_API_KEY = 'sk_-GORE__SpgDqJ4U__jLnVTRTtupCL1QmoZk4UPB2RLg'

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) {
          setAddr(accounts[0])
          setConnected(true)
        }
      })
    }
  }, [])

  const connect = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts.length > 0) {
          setAddr(accounts[0])
          setConnected(true)
        }
      } catch (e) {
        alert('Please install MetaMask')
      }
    } else {
      alert('Please install MetaMask')
    }
  }

  const disconnect = () => {
    setConnected(false)
    setAddr('')
  }

  const generatePoster = async () => {
    if (!connected) {
      connect()
      return
    }
    if (!prompt.trim()) {
      alert('Please enter a prompt')
      return
    }

    setGenerating(true)
    setError('')
    setGeneratedImage('')
    setStatus('Generating image with GPT-1... (30-60s)')

    try {
      const fullPrompt = prompt + ', ' + style + ' style, poster, high quality'

      const response = await fetch('https://api.jiekou.ai/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + JIEKOU_API_KEY
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt: fullPrompt,
          n: 1,
          size: 'auto'
        })
      })

      const data = await response.json()

      if (data.code) {
        throw new Error(data.message || 'API Error')
      }

      if (data.data && data.data[0]) {
        const imageData = data.data[0]
        if (imageData.b64_json) {
          setGeneratedImage('data:image/png;base64,' + imageData.b64_json)
          setStatus('')
        } else if (imageData.url) {
          setGeneratedImage(imageData.url)
          setStatus('')
        } else {
          throw new Error('No image data in response')
        }
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      setStatus('API failed, using Canvas...')
      setTimeout(() => {
        drawPosterCanvas(prompt, style)
        setStatus('')
      }, 1500)
    } finally {
      setGenerating(false)
    }
  }

  const drawPosterCanvas = (text, styleName) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = 800
    const height = 600

    canvas.width = width
    canvas.height = height

    let bgGradient
    let textColor = '#ffffff'

    if (styleName === 'Cyberpunk') {
      bgGradient = ctx.createLinearGradient(0, 0, width, height)
      bgGradient.addColorStop(0, '#0f0f1a')
      bgGradient.addColorStop(1, '#1a1a2e')
    } else if (styleName === 'Minimal') {
      bgGradient = ctx.createLinearGradient(0, 0, width, height)
      bgGradient.addColorStop(0, '#ffffff')
      bgGradient.addColorStop(1, '#f5f5f5')
      textColor = '#333333'
    } else if (styleName === 'Gradient') {
      bgGradient = ctx.createLinearGradient(0, 0, width, height)
      bgGradient.addColorStop(0, '#667eea')
      bgGradient.addColorStop(1, '#764ba2')
    } else if (styleName === 'Cute') {
      bgGradient = ctx.createLinearGradient(0, 0, width, height)
      bgGradient.addColorStop(0, '#ff9a9e')
      bgGradient.addColorStop(1, '#fecfef')
    } else {
      bgGradient = ctx.createLinearGradient(0, 0, width, height)
      bgGradient.addColorStop(0, '#0f0f1a')
      bgGradient.addColorStop(1, '#1a1a2e')
    }

    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, width, height)

    ctx.globalAlpha = 0.1
    for (let i = 0; i < 25; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 60, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1

    const icons = {'Cyberpunk': '🌆', 'Minimal': '✨', 'Gradient': '🌈', 'Cute': '💖', 'Realistic': '📸', 'Anime': '🎨'}
    ctx.font = '100px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(icons[styleName] || '🎨', width / 2, 160)

    ctx.font = 'bold 28px Arial'
    ctx.fillStyle = textColor
    const words = text.split(' ')
    let lines = []
    let currentLine = ''

    words.forEach(word => {
      const testLine = currentLine + ' ' + word
      if (ctx.measureText(testLine).width < 700) {
        currentLine = testLine
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    })
    lines.push(currentLine)

    let y = 240
    lines.slice(0, 8).forEach(line => {
      ctx.fillText(line.trim(), width / 2, y)
      y += 42
    })

    ctx.font = 'bold 24px Arial'
    ctx.fillStyle = '#ff00ff'
    ctx.fillText(styleName.toUpperCase() + ' STYLE', width / 2, 480)

    ctx.font = '16px Arial'
    ctx.globalAlpha = 0.6
    ctx.fillStyle = textColor
    ctx.fillText('AI Generated - jiekou.ai', width / 2, 560)
    ctx.globalAlpha = 1

    setGeneratedImage(canvas.toDataURL('image/png'))
  }

  const downloadPoster = () => {
    if (!generatedImage) return
    const link = document.createElement('a')
    link.download = 'poster_' + style + '_' + Date.now() + '.png'
    link.href = generatedImage
    link.click()
  }

  return (
    React.createElement('div', {style: {minHeight: '100vh', background: '#050508', color: 'white', position: 'relative'}},
      React.createElement('div', {style: {position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'url(bg.jpg) center/cover fixed', zIndex: 0}}),
      React.createElement('div', {style: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.85)', zIndex: 1}}),
      React.createElement('div', {style: {position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', padding: '0 40px'}},
        React.createElement('header', {style: {display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px 0'}},
          React.createElement('div', {style: {fontSize: '1.2rem', fontWeight: 500, letterSpacing: '1px'}}, 'AI Creator Hub'),
          React.createElement('div', {style: {display: 'flex', gap: '12px', alignItems: 'center'}},
            React.createElement('button', {
              onClick: () => window.location.hash = '',
              style: {padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.85rem'}
            }, 'Home'),
            React.createElement('div', {style: {display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px'}},
              React.createElement('div', {style: {width: '8px', height: '8px', background: connected ? '#00ff88' : '#ff4444', borderRadius: '50%'}}),
              React.createElement('span', {style: {fontSize: '0.85rem', color: '#888'}}, connected ? addr.slice(0, 6) + '...' + addr.slice(-4) : 'Not Connected')
            ),
            React.createElement('button', {
              onClick: connected ? disconnect : connect,
              style: {padding: '8px 16px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', border: 'none', borderRadius: '6px', background: connected ? 'transparent' : 'linear-gradient(135deg, #ff00ff, #00ffff)', color: connected ? 'white' : '#050508', border: connected ? '1px solid rgba(255,255,255,0.2)' : 'none'}
            }, connected ? 'Disconnect' : 'Connect')
          )
        ),
        React.createElement('h1', {style: {fontSize: '2.5rem', fontWeight: 600, marginBottom: '8px', letterSpacing: '-0.5px'}}, 'Poster Design'),
        React.createElement('p', {style: {color: '#888', marginBottom: '50px', fontSize: '1.11rem'}}, 'AI-powered poster (jiekou.ai GPT-1, 30-60s)'),
        React.createElement('div', {style: {display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px'}},
          React.createElement('div', {style: {background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px'}},
            React.createElement('div', {style: {marginBottom: '20px'}},
              React.createElement('label', {style: {display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px'}}, 'Prompt'),
              React.createElement('textarea', {
                placeholder: 'Describe your poster... e.g., A cyberpunk city with neon lights',
                value: prompt,
                onChange: e => setPrompt(e.target.value),
                style: {width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px', minHeight: '150px', resize: 'vertical', fontFamily: 'inherit'}
              })
            ),
            React.createElement('div', {style: {marginBottom: '20px'}},
              React.createElement('label', {style: {display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px'}}, 'Style'),
              React.createElement('select', {
                value: style,
                onChange: e => setStyle(e.target.value),
                style: {width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px'}
              }, styles.map(s => React.createElement('option', {key: s, value: s}, s)))
            ),
            React.createElement('div', null,
              React.createElement('button', {
                onClick: generatePoster,
                disabled: generating,
                style: {padding: '14px 28px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', border: 'none', borderRadius: '8px', marginRight: '12px', background: 'linear-gradient(135deg, #ff00ff, #00ffff)', color: '#050508', opacity: generating ? 0.5 : 1}
              }, generating ? 'Generating...' : 'Generate Poster'),
              generatedImage && React.createElement('button', {
                onClick: downloadPoster,
                style: {padding: '14px 28px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', border: 'none', borderRadius: '8px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)'}
              }, 'Download')
            ),
            status && React.createElement('div', {style: {marginTop: '20px', padding: '16px', background: 'rgba(0,255,136,0.1)', borderRadius: '8px', color: '#00ff88'}}, status),
            error && React.createElement('div', {style: {marginTop: '20px', padding: '16px', background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)', borderRadius: '8px', color: '#ff4444'}}, error)
          ),
          React.createElement('div', {style: {background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', position: 'sticky', top: '80px'}},
            React.createElement('div', {style: {fontSize: '0.85rem', color: '#888', marginBottom: '20px', letterSpacing: '1px'}}, 'PREVIEW'),
            React.createElement('div', {style: {display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '20px'}},
              generatedImage ? 
                React.createElement('img', {src: generatedImage, alt: 'Generated Poster', style: {maxWidth: '100%', borderRadius: '8px'}}) :
                React.createElement('canvas', {ref: canvasRef, style: {maxWidth: '100%', borderRadius: '8px'}})
            )
          )
        ),
        React.createElement('footer', {style: {padding: '30px 0', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', marginTop: '50px'}},
          React.createElement('p', {style: {color: '#888', fontSize: '0.85rem'}}, 'AI Creator Hub - 2024')
        )
      )
    )
  )
}
