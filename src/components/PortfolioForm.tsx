import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { validatePortfolioUrl, validateLinkedInUrl, sanitizeUrl } from '../utils/validation'
import './PortfolioForm.css'

interface PortfolioFormProps {
  onSubmit: (portfolioUrl: string, linkedinUrl: string, pitchText: string) => void
  showQR?: boolean
  shareUrl?: string
  portfolioUrl?: string
  linkedinUrl?: string
  pitchText?: string
  onViewPortfolio?: () => void
  onToast?: (message: string, type?: 'success' | 'error' | 'info') => void
}

function PortfolioForm({ 
  onSubmit, 
  showQR = false, 
  shareUrl = '', 
  portfolioUrl: initialPortfolio = '',
  linkedinUrl: initialLinkedin = '',
  pitchText: initialPitch = '',
  onViewPortfolio,
  onToast
}: PortfolioFormProps) {
  const [portfolioUrl, setPortfolioUrl] = useState(initialPortfolio)
  const [linkedinUrl, setLinkedinUrl] = useState(initialLinkedin)
  const [pitchText, setPitchText] = useState(initialPitch)
  const [portfolioError, setPortfolioError] = useState('')
  const [linkedinError, setLinkedinError] = useState('')
  const [pitchError, setPitchError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset errors
    setPortfolioError('')
    setLinkedinError('')
    setPitchError('')

    // Validate portfolio URL
    const portfolioValidation = validatePortfolioUrl(portfolioUrl)
    if (!portfolioValidation.isValid) {
      setPortfolioError(portfolioValidation.error || 'Invalid portfolio URL')
      return
    }

    // Validate LinkedIn URL
    const linkedinValidation = validateLinkedInUrl(linkedinUrl)
    if (!linkedinValidation.isValid) {
      setLinkedinError(linkedinValidation.error || 'Invalid LinkedIn URL')
      return
    }

    // Validate pitch text
    if (!pitchText || !pitchText.trim()) {
      setPitchError('Pitch text is required')
      return
    }

    if (pitchText.trim().length < 10) {
      setPitchError('Pitch text must be at least 10 characters')
      return
    }

    // Sanitize URLs
    const sanitizedPortfolio = sanitizeUrl(portfolioUrl)
    const sanitizedLinkedin = sanitizeUrl(linkedinUrl)

    if (!sanitizedPortfolio || !sanitizedLinkedin) {
      onToast?.('Invalid URL format. Please check your URLs.', 'error')
      return
    }

    onSubmit(sanitizedPortfolio, sanitizedLinkedin, pitchText.trim())
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      onToast?.('Link copied to clipboard!', 'success')
    } catch (err) {
      onToast?.('Failed to copy link. Please try again.', 'error')
    }
  }

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPortfolioUrl(value)
    if (portfolioError && value) {
      const validation = validatePortfolioUrl(value)
      if (validation.isValid) {
        setPortfolioError('')
      }
    }
  }

  const handleLinkedinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLinkedinUrl(value)
    if (linkedinError && value) {
      const validation = validateLinkedInUrl(value)
      if (validation.isValid) {
        setLinkedinError('')
      }
    }
  }

  const handlePitchChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setPitchText(value)
    if (pitchError && value.trim().length >= 10) {
      setPitchError('')
    }
  }

  if (showQR) {
    return (
      <div className="portfolio-form-container">
        <div className="form-card qr-card">
          <h1 className="app-title">Your QR Code is Ready!</h1>
          <p className="app-subtitle">Scan this QR code to view the portfolio with voice pitch</p>
          
          <div className="qr-container">
            <QRCodeSVG 
              value={shareUrl}
              size={300}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="share-url-container">
            <p className="share-label">Share this link:</p>
            <div className="url-display">
              <input 
                type="text" 
                value={shareUrl} 
                readOnly 
                className="url-input"
              />
              <button 
                onClick={copyToClipboard} 
                className="copy-button"
                aria-label="Copy shareable link to clipboard"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="qr-actions">
            <button 
              onClick={onViewPortfolio} 
              className="view-button"
              aria-label="Preview portfolio with voice pitch"
            >
              Preview Portfolio
            </button>
            <button 
              onClick={() => {
                setPortfolioUrl('')
                setLinkedinUrl('')
                setPitchText('')
                window.location.href = window.location.pathname
              }} 
              className="new-connection-button"
              aria-label="Create a new portfolio connection"
            >
              Create New Connection
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="portfolio-form-container">
      <div className="form-card">
        <h1 className="app-title">Connection</h1>
        <p className="app-subtitle">Share your portfolio with voice pitch</p>
        
        <form onSubmit={handleSubmit} className="form" noValidate>
          <div className="form-group">
            <label htmlFor="portfolio">Portfolio URL</label>
            <input
              id="portfolio"
              type="url"
              value={portfolioUrl}
              onChange={handlePortfolioChange}
              onBlur={() => {
                if (portfolioUrl) {
                  const validation = validatePortfolioUrl(portfolioUrl)
                  if (!validation.isValid) {
                    setPortfolioError(validation.error || 'Invalid URL')
                  }
                }
              }}
              placeholder="https://yourportfolio.com"
              required
              aria-invalid={!!portfolioError}
              aria-describedby={portfolioError ? 'portfolio-error' : undefined}
            />
            {portfolioError && (
              <span id="portfolio-error" className="form-error" role="alert">
                {portfolioError}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn Profile URL</label>
            <input
              id="linkedin"
              type="url"
              value={linkedinUrl}
              onChange={handleLinkedinChange}
              onBlur={() => {
                if (linkedinUrl) {
                  const validation = validateLinkedInUrl(linkedinUrl)
                  if (!validation.isValid) {
                    setLinkedinError(validation.error || 'Invalid URL')
                  }
                }
              }}
              placeholder="https://linkedin.com/in/yourprofile"
              required
              aria-invalid={!!linkedinError}
              aria-describedby={linkedinError ? 'linkedin-error' : undefined}
            />
            {linkedinError && (
              <span id="linkedin-error" className="form-error" role="alert">
                {linkedinError}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="pitch">Your Pitch Text</label>
            <textarea
              id="pitch"
              value={pitchText}
              onChange={handlePitchChange}
              placeholder="Write your custom pitch here... This is what the voice will say when someone views your portfolio."
              required
              rows={6}
              className="pitch-textarea"
              aria-invalid={!!pitchError}
              aria-describedby={pitchError ? 'pitch-error' : 'pitch-hint'}
            />
            {pitchError ? (
              <span id="pitch-error" className="form-error" role="alert">
                {pitchError}
              </span>
            ) : (
              <small id="pitch-hint" className="form-hint">
                This text will be spoken by the voice synthesizer (minimum 10 characters)
              </small>
            )}
          </div>
          
          <button type="submit" className="submit-button" aria-label="Generate QR code for sharing">
            Generate QR Code
          </button>
        </form>
      </div>
    </div>
  )
}

export default PortfolioForm

