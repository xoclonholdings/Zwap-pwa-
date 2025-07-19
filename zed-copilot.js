
/**
 * ZED AI Co-pilot for ZWAP!
 * ©️ 2025 XOCLON HOLDINGS INC.™ - All Rights Reserved
 * 
 * This file contains proprietary intellectual property of XOCLON HOLDINGS INC.™
 * Unauthorized copying, reproduction, or distribution is strictly prohibited.
 */
class ZEDCopilot {
  constructor() {
    this.isActive = false;
    this.isListening = false;
    this.currentConversation = [];
    this.knowledgeBase = this.initializeKnowledgeBase();
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.animationId = null;
    this.createInterface();
    this.initializeAudioVisualizer();
  }

  initializeKnowledgeBase() {
    return {
      wallet: {
        keywords: ['wallet', 'connect', 'metamask', 'trust', 'coinbase'],
        responses: [
          "I can help you connect your wallet! Click the 'CONNECT WALLET' button in the top-left corner.",
          "For wallet issues, try refreshing the page and reconnecting. I support MetaMask, WalletConnect, and Coinbase Wallet.",
          "Your wallet connection is secure and encrypted. I never store your private keys."
        ]
      },
      earning: {
        keywords: ['earn', 'xhi', 'rewards', 'money', 'tokens'],
        responses: [
          "You can earn $XHI through MOVE (walking/dancing) and PLAY (games). Each game session can earn up to 0.015 $XHI!",
          "The faucet games reset daily. Complete challenges for bonus rewards!",
          "Z Points unlock premium features like removing cooldowns and increasing multipliers."
        ]
      },
      games: {
        keywords: ['games', 'play', 'cube', 'trivia', 'spin', 'build'],
        responses: [
          "Try the Cube game - it's available now! Trivia, BlockCraft, and Spin are coming soon.",
          "Each game has daily earning limits to ensure fair distribution of $XHI rewards.",
          "Challenge your friends using the invite system for extra Z Points!"
        ]
      },
      move: {
        keywords: ['move', 'walk', 'dance', 'fitness', 'steps'],
        responses: [
          "MOVE features Walk-to-Earn and Dance-to-Earn! Connect your fitness tracker to start earning.",
          "Every step counts towards your $XHI rewards. Dance challenges offer bonus multipliers!",
          "Maintain daily streaks for increasing Z Points bonuses."
        ]
      },
      zpoints: {
        keywords: ['z points', 'zpts', 'leaderboard', 'ranking', 'premium'],
        responses: [
          "Z Points unlock premium features! Earn them through daily logins, games, and referrals.",
          "Check the leaderboard to see your ranking. Top players get exclusive rewards!",
          "Premium members get no cooldowns, bonus multipliers, and early marketplace access."
        ]
      },
      technical: {
        keywords: ['error', 'bug', 'not working', 'broken', 'help'],
        responses: [
          "Try refreshing the page first. If issues persist, check your internet connection.",
          "Make sure your wallet is properly connected and you're on a supported network.",
          "For technical support, visit our contact section for direct assistance."
        ]
      }
    };
  }

  createInterface() {
    // Create floating ZED button
    const zedButton = document.createElement('div');
    zedButton.id = 'zed-button';
    zedButton.innerHTML = `
      <div class="zed-avatar">
        <div class="zed-eye"></div>
        <div class="knight-rider-scanner"></div>
      </div>
    `;
    document.body.appendChild(zedButton);

    // Create ZED modal interface
    const zedModal = document.createElement('div');
    zedModal.id = 'zed-modal';
    zedModal.innerHTML = `
      <div class="zed-container">
        <div class="zed-header">
          <div class="zed-title">
            <span class="zed-logo">ZED</span>
            <span class="zed-subtitle">AI Co-pilot</span>
          </div>
          <button class="zed-close" onclick="window.zedCopilot.closeInterface()">×</button>
        </div>
        <div class="zed-visualizer">
          <canvas id="zed-canvas" width="300" height="60"></canvas>
        </div>
        <div class="zed-chat" id="zed-chat">
          <div class="zed-message zed-assistant">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
              Hi! I'm ZED, your ZWAP! co-pilot. I can help you with wallets, earning $XHI, games, and more. What can I assist you with today?
            </div>
          </div>
        </div>
        <div class="zed-input-container">
          <input type="text" id="zed-input" placeholder="Ask ZED anything about ZWAP!..." />
          <button id="zed-send" onclick="window.zedCopilot.sendMessage()">Send</button>
          <button id="zed-voice" onclick="window.zedCopilot.toggleVoiceInput()">🎤</button>
        </div>
        <div class="zed-quick-actions">
          <button onclick="window.zedCopilot.quickAction('wallet')">Connect Wallet</button>
          <button onclick="window.zedCopilot.quickAction('earn')">How to Earn</button>
          <button onclick="window.zedCopilot.quickAction('games')">Game Help</button>
        </div>
      </div>
    `;
    document.body.appendChild(zedModal);

    // Add event listeners
    zedButton.onclick = () => this.toggleInterface();
    
    const input = document.getElementById('zed-input');
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    // Add styles
    this.addStyles();
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #zed-button {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #000, #1a1a1a);
        border: 2px solid #FFD700;
        border-radius: 50%;
        cursor: pointer;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        transition: all 0.3s ease;
      }

      #zed-button:hover {
        transform: scale(1.1);
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
      }

      .zed-avatar {
        position: relative;
        width: 40px;
        height: 40px;
      }

      .zed-eye {
        position: absolute;
        top: 15px;
        left: 50%;
        transform: translateX(-50%);
        width: 8px;
        height: 8px;
        background: #FF0000;
        border-radius: 50%;
        box-shadow: 0 0 10px #FF0000;
        animation: zed-pulse 2s infinite;
      }

      .knight-rider-scanner {
        position: absolute;
        bottom: 8px;
        left: 5px;
        right: 5px;
        height: 3px;
        background: linear-gradient(90deg, transparent, #FF0000, transparent);
        animation: knight-rider-scan 1.5s infinite;
      }

      @keyframes zed-pulse {
        0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
        50% { opacity: 0.5; transform: translateX(-50%) scale(1.2); }
      }

      @keyframes knight-rider-scan {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      #zed-modal {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 350px;
        height: 500px;
        background: transparent;
        z-index: 10001;
        display: none;
        pointer-events: none;
      }

      .zed-container {
        background: linear-gradient(135deg, #000, #1a1a1a);
        border: 2px solid #FFD700;
        border-radius: 15px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        font-family: 'Orbitron', monospace;
        color: #fff;
        overflow: hidden;
        pointer-events: all;
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.3), 0 0 60px rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(15px);
      }

      .zed-header {
        padding: 1rem;
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #000;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .zed-logo {
        font-size: 1.5rem;
        font-weight: bold;
        letter-spacing: 2px;
      }

      .zed-subtitle {
        font-size: 0.8rem;
        opacity: 0.8;
      }

      .zed-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #000;
        cursor: pointer;
        font-weight: bold;
      }

      .zed-visualizer {
        padding: 1rem;
        background: #000;
        border-bottom: 1px solid #333;
      }

      #zed-canvas {
        width: 100%;
        height: 60px;
        background: #000;
      }

      .zed-chat {
        flex: 1;
        padding: 1rem;
        overflow-y: auto;
        max-height: 200px;
        min-height: 200px;
      }

      .zed-message {
        display: flex;
        margin-bottom: 1rem;
        gap: 0.5rem;
      }

      .zed-message.zed-user {
        flex-direction: row-reverse;
      }

      .message-avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        background: #333;
      }

      .zed-user .message-avatar {
        background: #FFD700;
        color: #000;
      }

      .message-content {
        background: #333;
        padding: 0.8rem;
        border-radius: 10px;
        max-width: 80%;
        line-height: 1.4;
      }

      .zed-user .message-content {
        background: #FFD700;
        color: #000;
      }

      .zed-input-container {
        padding: 1rem;
        background: #1a1a1a;
        display: flex;
        gap: 0.5rem;
        border-top: 1px solid #333;
      }

      #zed-input {
        flex: 1;
        background: #000;
        border: 1px solid #FFD700;
        color: #fff;
        padding: 0.8rem;
        border-radius: 5px;
        font-family: 'Orbitron', monospace;
      }

      #zed-send, #zed-voice {
        background: #FFD700;
        color: #000;
        border: none;
        padding: 0.8rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        font-family: 'Orbitron', monospace;
      }

      #zed-voice {
        background: #FF0000;
        color: #fff;
        min-width: 50px;
      }

      #zed-voice.listening {
        background: #00FF00;
        animation: pulse 1s infinite;
      }

      .zed-quick-actions {
        padding: 1rem;
        background: #1a1a1a;
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        border-top: 1px solid #333;
      }

      .zed-quick-actions button {
        background: #333;
        color: #FFD700;
        border: 1px solid #FFD700;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.8rem;
        font-family: 'Orbitron', monospace;
        transition: all 0.3s ease;
      }

      .zed-quick-actions button:hover {
        background: #FFD700;
        color: #000;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      @media (max-width: 768px) {
        #zed-modal {
          top: 10px;
          right: 10px;
          width: 300px;
          height: 450px;
        }
        
        .zed-quick-actions {
          flex-direction: column;
        }
        
        .zed-quick-actions button {
          text-align: center;
        }
      }

      @media (max-width: 480px) {
        #zed-modal {
          top: 10px;
          right: 10px;
          left: 10px;
          width: auto;
          height: 400px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  initializeAudioVisualizer() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.startVisualization();
    } catch (error) {
      console.warn('Audio visualization not available:', error);
    }
  }

  startVisualization() {
    const canvas = document.getElementById('zed-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const animate = () => {
      if (this.analyser) {
        this.analyser.getByteFreencyData(this.dataArray);
      }

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);

      // Knight Rider style scanner
      const time = Date.now() * 0.005;
      const scannerPos = (Math.sin(time) + 1) * 0.5 * width;
      
      // Create gradient for scanner beam
      const gradient = ctx.createLinearGradient(scannerPos - 50, 0, scannerPos + 50, 0);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, '#FF0000');
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(scannerPos - 50, height * 0.4, 100, height * 0.2);

      // Add audio visualization bars if available
      if (this.dataArray) {
        const barWidth = width / this.dataArray.length;
        for (let i = 0; i < this.dataArray.length; i++) {
          const barHeight = (this.dataArray[i] / 255) * height * 0.3;
          const hue = (i / this.dataArray.length) * 60; // Red to yellow
          ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
          ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
        }
      }

      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  toggleInterface() {
    const modal = document.getElementById('zed-modal');
    if (this.isActive) {
      this.closeInterface();
    } else {
      modal.style.display = 'block';
      this.isActive = true;
      // Small delay to ensure modal is rendered before focusing
      setTimeout(() => {
        const input = document.getElementById('zed-input');
        if (input) input.focus();
      }, 100);
    }
  }

  closeInterface() {
    const modal = document.getElementById('zed-modal');
    modal.style.display = 'none';
    this.isActive = false;
    if (this.isListening) {
      this.toggleVoiceInput();
    }
  }

  sendMessage() {
    const input = document.getElementById('zed-input');
    const message = input.value.trim();
    if (!message) return;

    this.addMessage(message, 'user');
    input.value = '';

    // Process message and respond
    setTimeout(() => {
      const response = this.processMessage(message);
      this.addMessage(response, 'assistant');
    }, 500);
  }

  addMessage(content, sender) {
    const chat = document.getElementById('zed-chat');
    const messageDiv = document.createElement('div');
    messageDiv.className = `zed-message zed-${sender}`;
    
    const avatar = sender === 'user' ? '👤' : '🤖';
    messageDiv.innerHTML = `
      <div class="message-avatar">${avatar}</div>
      <div class="message-content">${content}</div>
    `;
    
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;
  }

  processMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check each knowledge base category
    for (const [category, data] of Object.entries(this.knowledgeBase)) {
      for (const keyword of data.keywords) {
        if (lowerMessage.includes(keyword)) {
          const responses = data.responses;
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
    }

    // Default responses for unmatched queries
    const defaultResponses = [
      "I'm here to help with ZWAP! Try asking about wallets, earning $XHI, games, or Z Points.",
      "That's an interesting question! I specialize in ZWAP! features. What would you like to know about earning or playing?",
      "Let me help you with that! I can assist with wallet connections, game strategies, and earning tips.",
      "I'm your ZWAP! co-pilot! Ask me about MOVE features, PLAY games, or how to maximize your $XHI earnings."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  quickAction(action) {
    switch (action) {
      case 'wallet':
        this.addMessage('How do I connect my wallet?', 'user');
        setTimeout(() => {
          this.addMessage(this.knowledgeBase.wallet.responses[0], 'assistant');
        }, 500);
        break;
      case 'earn':
        this.addMessage('How can I earn $XHI?', 'user');
        setTimeout(() => {
          this.addMessage(this.knowledgeBase.earning.responses[0], 'assistant');
        }, 500);
        break;
      case 'games':
        this.addMessage('Tell me about the games', 'user');
        setTimeout(() => {
          this.addMessage(this.knowledgeBase.games.responses[0], 'assistant');
        }, 500);
        break;
    }
  }

  toggleVoiceInput() {
    const voiceBtn = document.getElementById('zed-voice');
    
    if (!this.isListening) {
      // Start listening
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
          this.isListening = true;
          voiceBtn.classList.add('listening');
          voiceBtn.textContent = '🔴';
        };

        this.recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          document.getElementById('zed-input').value = transcript;
        };

        this.recognition.onend = () => {
          this.isListening = false;
          voiceBtn.classList.remove('listening');
          voiceBtn.textContent = '🎤';
        };

        this.recognition.start();
      } else {
        this.addMessage('Voice input not supported in your browser.', 'assistant');
      }
    } else {
      // Stop listening
      if (this.recognition) {
        this.recognition.stop();
      }
    }
  }
}

// Initialize ZED when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.zedCopilot = new ZEDCopilot();
});
