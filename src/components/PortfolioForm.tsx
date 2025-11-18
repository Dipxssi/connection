import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import './PortfolioForm.css'

interface PortfolioFormProps {
  onSubmit: (portfolioUrl: string, linkedinUrl: string) => void
  showQR?: boolean
  shareUrl?: string
  portfolioUrl?: string
  linkedinUrl?: string
  onViewPortfolio?: () => void
}

function PortfolioForm({ 
  onSubmit, 
  showQR = false, 
  shareUrl = '', 
  portfolioUrl: initialPortfolio = '',
  linkedinUrl: initialLinkedin = '',
  onViewPortfolio
}: PortfolioFormProps) {
  const [portfolioUrl, setPortfolioUrl] = useState(initialPortfolio)
  const [linkedinUrl, setLinkedinUrl] = useState(initialLinkedin)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (portfolioUrl && linkedinUrl) {
      onSubmit(portfolioUrl, linkedinUrl)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    alert('Link copied to clipboard!')
  }

  if (showQR) {
    return (
      <div className="portfolio-form-container">
        <div className="form-card qr-card">
          <h1 className="app-title">Your QR Code is Ready!</h1>
          <p className="app-subtitle">Scan this QR code to view the portfolio with AI voice pitch</p>
          
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
              <button onClick={copyToClipboard} className="copy-button">
                Copy
              </button>
            </div>
          </div>

          <div className="qr-actions">
            <button onClick={onViewPortfolio} className="view-button">
              Preview Portfolio
            </button>
            <button 
              onClick={() => {
                setPortfolioUrl('')
                setLinkedinUrl('')
                window.location.href = window.location.pathname
              }} 
              className="new-connection-button"
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
        <p className="app-subtitle">Share your portfolio with AI-powered voice pitch</p>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="portfolio">Portfolio URL</label>
            <input
              id="portfolio"
              type="url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://yourportfolio.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn Profile URL</label>
            <input
              id="linkedin"
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              required
            />
          </div>
          
          <button type="submit" className="submit-button">
            Generate QR Code
          </button>
        </form>
      </div>
    </div>
  )
}

export default PortfolioForm

