import { useState, useEffect, useRef } from 'react'
import './PortfolioViewer.css'

interface PortfolioViewerProps {
  portfolioUrl: string
  linkedinUrl: string
}

function PortfolioViewer({ portfolioUrl, linkedinUrl }: PortfolioViewerProps) {
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPitching, setIsPitching] = useState(false)
  const [showConnectPopup, setShowConnectPopup] = useState(false)
  const [pitchText, setPitchText] = useState('')
  const [error, setError] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    synthRef.current = window.speechSynthesis
    fetchPortfolio()
  }, [portfolioUrl])

  const fetchPortfolio = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      // Try to fetch the portfolio content
      // For now, we'll use an iframe to display it
      // In a real app, you might want to use a CORS proxy or backend
      setPortfolioData({ url: portfolioUrl })
      setIsLoading(false)
      
      // Start pitch immediately - no delay
      generateAndPitch()
    } catch (err) {
      setError('Failed to load portfolio. Please check the URL.')
      setIsLoading(false)
    }
  }

  const generatePitch = (data: any): string => {
    // Generate a personalized pitch based on portfolio
    // In a real app, you'd use an AI API here (like OpenAI, Anthropic, etc.)
    let portfolioDomain = 'my portfolio'
    try {
      portfolioDomain = new URL(portfolioUrl).hostname.replace('www.', '')
    } catch (e) {
      // If URL parsing fails, use default
    }
    
    const pitch = `
      Hello! Welcome to my portfolio at ${portfolioDomain}. I'm thrilled to have you here!
      
      This portfolio represents my journey, showcasing the projects I'm most passionate about, 
      the skills I've developed, and the impact I've made. Each piece tells a story of 
      problem-solving, creativity, and dedication.
      
      As you explore the content below, you'll see examples of my work that demonstrate 
      my technical expertise and creative approach. I believe in building solutions that 
      not only work well but also make a meaningful difference.
      
      I'd love to connect and learn more about you too! After you've had a chance to 
      review my work, please check out my LinkedIn profile to continue our conversation.
      
      Thank you for taking the time to explore my portfolio. Let's connect!
    `
    return pitch.trim()
  }

  const generateAndPitch = () => {
    const pitch = generatePitch(portfolioData)
    setPitchText(pitch)
    setIsPitching(true)
    speakPitch(pitch)
  }

  const speakPitch = (text: string) => {
    if (!synthRef.current) return

    // Cancel any ongoing speech
    synthRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1.1
    utterance.volume = 1

    utterance.onend = () => {
      setIsPitching(false)
      setTimeout(() => {
        setShowConnectPopup(true)
      }, 1000)
    }

    utterance.onerror = () => {
      setIsPitching(false)
      // If speech fails, still show popup
      setTimeout(() => {
        setShowConnectPopup(true)
      }, 1000)
    }

    synthRef.current.speak(utterance)
  }

  const stopPitch = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsPitching(false)
      setShowConnectPopup(true)
    }
  }

  if (isLoading) {
    return (
      <div className="portfolio-viewer">
        <div className="loading">Loading portfolio...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="portfolio-viewer">
        <div className="error">{error}</div>
      </div>
    )
  }

  return (
    <div className="portfolio-viewer">
      <div className="viewer-header">
        <h2>My Portfolio</h2>
        {isPitching && (
          <div className="pitch-indicator">
            <span className="pulse"></span>
            <span>AI is pitching...</span>
            <button onClick={stopPitch} className="stop-button">Skip</button>
          </div>
        )}
      </div>
      
      {showConnectPopup && (
        <div className="connect-popup-overlay" onClick={() => setShowConnectPopup(false)}>
          <div className="connect-popup" onClick={(e) => e.stopPropagation()}>
            <h3>Let's Connect!</h3>
            <p>I'd love to connect with you on LinkedIn</p>
            <a 
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="connect-button"
            >
              Connect on LinkedIn
            </a>
            <button 
              className="close-popup-button"
              onClick={() => setShowConnectPopup(false)}
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}

      <div className="portfolio-container">
        <iframe
          ref={iframeRef}
          src={portfolioUrl}
          className="portfolio-iframe"
          title="Portfolio"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  )
}

export default PortfolioViewer

