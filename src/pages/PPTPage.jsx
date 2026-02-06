import React, { useState, useEffect } from 'react'
import { generatePPT } from '../utils/aiApi'
import PptxGenJS from 'pptxgenjs'

export default function PPTPage() {
  const [connected, setConnected] = useState(false)
  const [addr, setAddr] = useState('')
  const [topic, setTopic] = useState('')
  const [type, setType] = useState('Pitch Deck')
  const [pages, setPages] = useState(12)
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [error, setError] = useState('')

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

  const generate = async () => {
    if (!connected) {
      connect()
      return
    }
    if (!topic) {
      alert('Please enter presentation topic')
      return
    }

    setGenerating(true)
    setError('')
    setGeneratedContent('')

    try {
      const content = await generatePPT(topic, type)
      setGeneratedContent(content)
    } catch (err) {
      setError('Failed to generate: ' + err.message)
    } finally {
      setGenerating(false)
    }
  }

  const downloadPPTX = () => {
    if (!generatedContent) return

    const pptx = new PptxGenJS()
    
    const titleSlide = pptx.addSlide()
    titleSlide.addText(topic || 'Project Name', { x: 1, y: 2, w: '80%', h: 1, fontSize: 44, bold: true, align: 'center', color: '363636' })
    titleSlide.addText(type, { x: 1, y: 3.5, w: '80%', h: 0.5, fontSize: 18, align: 'center', color: '888888' })
    titleSlide.background = { color: 'FFFFFF' }

    const lines = generatedContent.split('\n').filter(line => line.trim())
    let currentSlide = pptx.addSlide()
    currentSlide.background = { color: 'FFFFFF' }
    
    lines.forEach((line, index) => {
      if (line.match(/^Slide \d+:/i) || line.match(/^\d+\./) || line.toUpperCase().startsWith('SLIDE')) {
        currentSlide = pptx.addSlide()
        currentSlide.background = { color: 'FFFFFF' }
        currentSlide.addText(line.replace(/^(Slide \d+:|\d+\.\s*)/i, '').trim(), { 
          x: 0.5, y: 0.5, w: '90%', h: 0.8, fontSize: 24, bold: true, color: 'ff00ff' 
        })
      } else if (line.trim()) {
        const bullets = line.split(/[•\-\*]/).filter(b => b.trim())
        if (bullets.length > 1) {
          bullets.forEach(b => {
            currentSlide.addText('• ' + b.trim(), { x: 0.7, y: 'auto', w: '85%', h: 0.5, fontSize: 16, color: '363636', bullet: { type: 'bullet' } })
          })
        } else {
          currentSlide.addText(line.trim(), { x: 0.7, y: 'auto', w: '85%', h: 0.6, fontSize: 18, color: '363636' })
        }
      }
    })

    pptx.writeFile({ fileName: `${topic || 'Presentation'}.pptx` })
  }

  return (
    React.createElement('div', {style: {minHeight: '100vh', background: '#050508', color: 'white', position: 'relative'}},
      React.createElement('div', {style: {position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'url(bg.jpg) center/cover fixed', zIndex: 0}}),
      React.createElement('div', {style: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.85)', zIndex: 1}}),
      React.createElement('div', {style: {position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto', padding: '0 40px'}},
        React.createElement('header', {style: {display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px 0'}},
          React.createElement('div', {style: {fontSize: '1.2rem', fontWeight: 500, letterSpacing: '1px'}}, 'AI Creator Hub'),
          React.createElement('button', {
            onClick: () => window.location.hash = '',
            style: {padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.85rem'}
          }, 'Home')
        ),
        React.createElement('h1', {style: {fontSize: '2.5rem', fontWeight: 600, marginBottom: '8px', letterSpacing: '-0.5px'}}, 'Create PPT'),
        React.createElement('p', {style: {color: '#888', marginBottom: '30px', fontSize: '1.11rem'}}, 'AI-powered PPTX presentation generation'),
        
        React.createElement('div', {style: {display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px'}},
          React.createElement('div', {style: {display: 'flex', alignItems: 'center', gap: '12px'}},
            React.createElement('div', {style: {width: '10px', height: '10px', background: connected ? '#00ff88' : '#ff4444', borderRadius: '50%'}}),
            React.createElement('div', null,
              React.createElement('div', {style: {fontSize: '0.95rem', color: connected ? '#00ff88' : 'white'}}, connected ? addr.slice(0, 6) + '...' + addr.slice(-4) : 'No Wallet'),
              React.createElement('div', {style: {fontSize: '0.85rem', color: '#888'}}, connected ? '' : 'Connect wallet first')
            )
          ),
          React.createElement('button', {
            onClick: connected ? disconnect : connect,
            style: {padding: '12px 24px', fontSize: '0.9rem', fontWeight: 500, borderRadius: '8px', background: connected ? 'transparent' : 'linear-gradient(135deg, #ff00ff, #00ffff)', color: connected ? 'white' : '#050508', border: connected ? '1px solid rgba(255,255,255,0.2)' : 'none'}
          }, connected ? 'Disconnect' : 'Connect Wallet')
        ),

        React.createElement('div', {style: {background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '40px', marginBottom: '40px'}},
          React.createElement('div', {style: {marginBottom: '30px'}},
            React.createElement('div', {style: {marginBottom: '20px'}},
              React.createElement('label', {style: {display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px'}}, 'Presentation Topic'),
              React.createElement('input', {
                type: 'text',
                placeholder: 'e.g. DeFi Yield Platform',
                value: topic,
                onChange: e => setTopic(e.target.value),
                style: {width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px'}
              })
            ),
            React.createElement('div', {style: {marginBottom: '20px'}},
              React.createElement('label', {style: {display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px'}}, 'PPT Type'),
              React.createElement('select', {
                value: type,
                onChange: e => setType(e.target.value),
                style: {width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px'}
              },
                React.createElement('option', {value: 'Pitch Deck'}, 'Pitch Deck'),
                React.createElement('option', {value: 'Whitepaper Summary'}, 'Whitepaper Summary'),
                React.createElement('option', {value: 'Product Demo'}, 'Product Demo')
              )
            ),
            React.createElement('div', {style: {marginBottom: '20px'}},
              React.createElement('div', {style: {display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}},
                React.createElement('span', {style: {fontSize: '0.9rem', color: '#888'}}, 'Number of Slides: ' + pages)
              ),
              React.createElement('input', {
                type: 'range',
                min: '5',
                max: '30',
                value: pages,
                onChange: e => setPages(Number(e.target.value)),
                style: {width: '100%', height: '4px', WebkitAppearance: 'none', background: 'rgba(255,255,255,0.1)', borderRadius: '2px'}
              })
            )
          ),
          React.createElement('button', {
            onClick: generate,
            disabled: generating,
            style: {display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 32px', fontSize: '1rem', fontWeight: 500, border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #ff00ff, #00ffff)', color: '#050508', opacity: generating ? 0.5 : 1}
          }, generating ? 'Generating...' : 'Generate PPT'),
          generatedContent && React.createElement('button', {
            onClick: downloadPPTX,
            style: {padding: '16px 32px', fontSize: '1rem', fontWeight: 500, borderRadius: '8px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', marginLeft: '12px'}
          }, 'Download PPTX'),
          error && React.createElement('div', {style: {marginTop: '20px', padding: '16px', background: 'rgba(255,0,0,0.1)', borderRadius: '8px', color: '#ff4444'}}, error)
        ),

        generatedContent && React.createElement('div', {style: {background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', marginBottom: '40px'}},
          React.createElement('h3', {style: {fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px'}}, '// PPT Content Preview'),
          React.createElement('pre', {style: {background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '20px', overflow: 'auto', maxHeight: '400px', fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap'}}, generatedContent)
        ),

        React.createElement('div', {style: {display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', padding: '40px 0', borderTop: '1px solid rgba(255,255,255,0.1)'}},
          React.createElement('div', {style: {textAlign: 'center'}},
            React.createElement('div', {style: {fontSize: '1.8rem', marginBottom: '10px'}}, '⚡'),
            React.createElement('div', {style: {fontSize: '1rem', fontWeight: 500, marginBottom: '6px'}}, 'AI Generated'),
            React.createElement('div', {style: {fontSize: '0.9rem', color: '#888'}}, 'Professional slides in seconds')
          ),
          React.createElement('div', {style: {textAlign: 'center'}},
            React.createElement('div', {style: {fontSize: '1.8rem', marginBottom: '10px'}}, '🎨'),
            React.createElement('div', {style: {fontSize: '1rem', fontWeight: 500, marginBottom: '6px'}}, 'Beautiful Design'),
            React.createElement('div', {style: {fontSize: '0.9rem', color: '#888'}}, 'Modern and clean layout')
          ),
          React.createElement('div', {style: {textAlign: 'center'}},
            React.createElement('div', {style: {fontSize: '1.8rem', marginBottom: '10px'}}, '📊'),
            React.createElement('div', {style: {fontSize: '1rem', fontWeight: 500, marginBottom: '6px'}}, 'Editable'),
            React.createElement('div', {style: {fontSize: '0.9rem', color: '#888'}}, 'Customize in PowerPoint')
          )
        ),

        React.createElement('footer', {style: {padding: '30px 0', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center'}},
          React.createElement('p', {style: {color: '#888', fontSize: '0.85rem'}}, 'AI Creator Hub © 2024')
        )
      )
    )
  )
}
