# ZWAP! Build & Deployment Guide

## Project Structure (Organized)

```
zwap-preview/
├── 📁 src/                     # Source files
│   ├── js/                     # JavaScript modules
│   │   ├── script.js           # Main application logic
│   │   ├── zwapService.js      # DeFi swap functionality
│   │   ├── zebulon-oracle.js   # AI Oracle integration
│   │   ├── zed-copilot.js      # AI assistance system
│   │   ├── security.js         # Security framework
│   │   └── leaderboard.js      # Competitive systems
│   ├── css/                    # Stylesheets
│   │   └── style.css           # Main UI/UX framework
│   └── assets/                 # Images and media
│       ├── Zwap_logo_full.png  # Primary logo
│       ├── Zwap_bang_3d.PNG    # Navigation icon
│       └── [Game Assets].PNG   # Game interface icons
├── 📁 pages/                   # HTML pages
│   ├── Credit.html             # Credit building
│   ├── Swap.html               # Token exchange
│   ├── move.html               # Move-to-earn
│   ├── play.html               # Gaming hub
│   ├── leaderboard.html        # Rankings
│   └── docs.html               # Documentation
├── 📁 games/                   # Game modules
│   ├── cube.html               # 3D puzzle
│   ├── Trivia.html             # Knowledge game
│   ├── Build.html              # Creative building
│   └── spin.html               # Luck-based earning
├── 📁 config/                  # Configuration files
│   └── static-web-server.toml  # Server config
├── 📁 attached_assets/         # Additional resources
├── index.html                  # Main entry point
├── package.json                # Build configuration
├── .replit                     # Replit deployment
└── README.md                   # Project documentation
```

## Quick Start

### Development Server
```bash
npm run dev
# Serves on http://localhost:8080
```

### Build for Production
```bash
npm run build
# Creates dist/ folder with optimized assets
```

### Organize Existing Files
```bash
npm run organize
# Moves files to proper src/ structure
```

## Build Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run clean` | Remove build artifacts |
| `npm run test` | Run security validation |
| `npm run deploy` | Full build + deployment prep |
| `npm start` | Alias for dev server |

## Features Overview

### Core Modules
- **Wallet Integration**: MetaMask, WalletConnect, Coinbase, Trust
- **Move-to-Earn**: Fitness tracking with $ZWAP rewards
- **Play-to-Earn**: 4 interactive games with leaderboards
- **Swap Service**: Multi-asset DEX functionality
- **AI Co-pilot**: ZED AI assistance with Zebulon Oracle
- **Security Framework**: XSS/CSRF protection, integrity checks

### Mobile-First Design
- Responsive layout optimized for mobile devices
- Touch-friendly interfaces and animations
- Progressive Web App (PWA) capabilities
- Offline functionality where applicable

## Deployment Ready

The project is configured for multiple deployment targets:
- **Replit**: Native support with `.replit` configuration
- **Static Hosting**: Vercel, Netlify, GitHub Pages
- **CDN**: Optimized for content delivery networks
- **Traditional Web Servers**: Apache, Nginx compatible

## Security Features

- Content Security Policy (CSP) enforcement
- XSS and CSRF protection mechanisms
- Network request monitoring and validation
- Console tampering protection
- DOM manipulation security
- Integrity checks for critical functions

## AI Integration

- **Zebulon Oracle**: WebSocket-based market insights
- **ZED Co-pilot**: Interactive AI assistance
- **Real-time Analytics**: User behavior tracking
- **Smart Recommendations**: Personalized earning strategies

---

**©️ 2025 XOCLON HOLDINGS INC.™ — All Rights Reserved**
