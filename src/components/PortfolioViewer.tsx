import { useState, useEffect, useRef } from 'react'
import './PortfolioViewer.css'

interface PortfolioViewerProps {
  portfolioUrl: string
  linkedinUrl: string
  pitchText: string
}

function PortfolioViewer({ portfolioUrl, linkedinUrl, pitchText }: PortfolioViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isPitching, setIsPitching] = useState(false)
  const [showConnectPopup, setShowConnectPopup] = useState(false)
  const [pitchStarted, setPitchStarted] = useState(false)
  const [error, setError] = useState('')
  const [iframeError, setIframeError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }
    fetchPortfolio()

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
      }
    }
  }, [portfolioUrl])

  const fetchPortfolio = async () => {
    setIsLoading(true)
    setError('')
    setIframeError(false)
    
    try {
      // Set a timeout to detect if iframe fails to load (CORS issue)
      loadTimeoutRef.current = setTimeout(() => {
        if (iframeRef.current) {
          try {
            // Try to access iframe content - will fail if CORS blocked
            const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
            if (!iframeDoc) {
              setIframeError(true)
              setIsLoading(false)
            }
          } catch (e) {
            // CORS error - iframe blocked
            setIframeError(true)
            setIsLoading(false)
          }
        }
      }, 5000) // 5 second timeout

      setIsLoading(false)
    } catch (err) {
      setError('Failed to load portfolio. Please check the URL.')
      setIsLoading(false)
    }
  }

  const handleIframeLoad = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current)
      loadTimeoutRef.current = null
    }
    setIsLoading(false)
    setIframeError(false)
  }

  const handleIframeError = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current)
      loadTimeoutRef.current = null
    }
    setIframeError(true)
    setIsLoading(false)
  }

  const handleStartPitch = () => {
    if (!pitchText || !pitchText.trim()) {
      console.error('No pitch text available')
      return
    }
    
    if (!synthRef.current) {
      console.error('Speech synthesis not available')
      return
    }

    setIsPitching(true)
    setPitchStarted(true)
    speakPitch(pitchText)
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

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event)
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
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error Loading Portfolio</h2>
          <p className="error-message">{error}</p>
          <button 
            onClick={() => window.location.href = window.location.pathname}
            className="error-button"
            aria-label="Return to home page"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (iframeError) {
    return (
      <div className="portfolio-viewer">
        <div className="error-container">
          <div className="error-icon">🔒</div>
          <h2>Portfolio Cannot Be Embedded</h2>
          <p className="error-message">
            This portfolio website has security restrictions that prevent it from being displayed in an iframe. 
            This is a common security feature called X-Frame-Options.
          </p>
          <div className="error-actions">
            <a 
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="error-button primary"
              aria-label="Open portfolio in new tab"
            >
              Open Portfolio in New Tab
            </a>
            <button 
              onClick={() => window.location.href = window.location.pathname}
              className="error-button"
              aria-label="Return to home page"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="portfolio-viewer">
      <div className="viewer-header">
        <h2>My Portfolio</h2>
        {!pitchStarted && !isPitching && (
          <button 
            onClick={handleStartPitch} 
            className="play-pitch-button"
            aria-label="Play portfolio pitch with voice"
          >
            🔊 Play Portfolio Pitch
          </button>
        )}
        {isPitching && (
          <div className="pitch-indicator" role="status" aria-live="polite">
            <span className="pulse" aria-hidden="true"></span>
            <span>Voice is pitching...</span>
            <button 
              onClick={stopPitch} 
              className="stop-button"
              aria-label="Stop and skip pitch"
            >
              Skip
            </button>
          </div>
        )}
      </div>
      
      {showConnectPopup && (
        <div 
          className="connect-popup-overlay" 
          onClick={() => setShowConnectPopup(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="connect-popup-title"
        >
          <div className="connect-popup" onClick={(e) => e.stopPropagation()}>
            <h3 id="connect-popup-title">Let's Connect!</h3>
            <p>I'd love to connect with you on LinkedIn</p>
            <a 
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="connect-button"
              aria-label="Connect on LinkedIn (opens in new tab)"
            >
              Connect on LinkedIn
            </a>
            <button 
              className="close-popup-button"
              onClick={() => setShowConnectPopup(false)}
              aria-label="Close popup and continue browsing"
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
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          aria-label="Portfolio website"
        />
      </div>
    </div>
  )
}

export default PortfolioViewer

