/**
 * ZED AI Co-pilot for ZWAP!
 * ©️ 2025 XOCLON HOLDINGS INC.™ - All Rights Reserved
 * 
 * This file contains proprietary intellectual property of XOCLON HOLDINGS INC.™
 * Unauthorized copying, reproduction, or distribution is strictly prohibited.
 */
class ZincCopilot {
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
    // Create floating Zinc button
    const zincButton = document.createElement('div');
    zincButton.id = 'zinc-button';
    zincButton.innerHTML = '<div class="zinc-button-circle"><img src="zinc-logo.png" alt="Zinc" class="zinc-button-symbol" /></div>';
    document.body.appendChild(zincButton);

    // Create Zinc modal interface
    const zincModal = document.createElement('div');
    zincModal.id = 'zinc-modal';
    zincModal.innerHTML = `
      <div class="zinc-container">
        <div class="zinc-header">
          <div class="zinc-title">
            <span class="zinc-logo">
              <div class="zinc-circle">
                <img src="zinc-logo.png" alt="Zinc" class="zinc-symbol" />
              </div>
            </span>
            <span class="zinc-subtitle">AI Co-pilot</span>
          </div>
          <button class="zinc-close" onclick="window.zincCopilot.closeInterface()">×</button>
        </div>
        <div class="zinc-visualizer">
          <canvas id="zinc-canvas" width="300" height="60"></canvas>
        </div>
        <div class="zinc-chat" id="zinc-chat">
          <div class="zinc-message zinc-assistant">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
              Hi! I'm ZED, your ZWAP! co-pilot. I can help you with wallets, earning $XHI, games, and more. What can I assist you with today?
            </div>
          </div>
        </div>
        <div class="zinc-input-container">
          <input type="text" id="zinc-input" placeholder="Ask ZED anything about ZWAP!..." />
          <button id="zinc-send" onclick="window.zincCopilot.sendMessage()">Send</button>
          <button id="zinc-voice" onclick="window.zincCopilot.toggleVoiceInput()">🎤</button>
        </div>
        <div class="zinc-quick-actions">
          <button onclick="window.zincCopilot.quickAction('wallet')">Connect Wallet</button>
          <button onclick="window.zincCopilot.quickAction('earn')">How to Earn</button>
          <button onclick="window.zincCopilot.quickAction('games')">Game Help</button>
        </div>
      </div>
    `;
    document.body.appendChild(zincModal);

    // Add event listeners
    zincButton.onclick = () => this.toggleInterface();

    const input = document.getElementById('zinc-input');
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    // Add styles
    this.addStyles();
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #zinc-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: transparent;
        border: none;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
        z-index: 1000;
        transition: all 0.3s ease;
        animation: pulse 2s infinite;
      }

      .zinc-button-circle {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #FFD700, #FFA500);
        border: 2px solid #FFD700;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }

      .zinc-button-symbol {
        width: 35px;
        height: 35px;
        object-fit: contain;
        filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
      }

      #zinc-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
      }

      #zinc-modal {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 350px;
        height: 500px;
        background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
        border: 2px solid #FFD700;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 1001;
        display: none;
        overflow: hidden;
        font-family: 'Orbitron', monospace;
      }

      .zinc-container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .zinc-header {
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #000;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .zinc-title {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .zinc-logo {
        display: flex;
        align-items: center;
      }

      .zinc-circle {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #FFD700, #FFA500);
        border: 2px solid #000;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }

      .zinc-symbol {
        width: 24px;
        height: 24px;
        object-fit: contain;
        filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));
      }

      .zinc-subtitle {
        font-size: 12px;
        opacity: 0.8;
        font-weight: bold;
      }

      .zinc-close {
        background: none;
        border: none;
        color: #000;
        font-size: 24px;
        cursor: pointer;
        font-weight: bold;
      }

      .zinc-visualizer {
        height: 60px;
        background: #000;
        border-bottom: 1px solid #FFD700;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .zinc-chat {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        background: #1a1a1a;
      }

      .zinc-message {
        margin-bottom: 15px;
        display: flex;
        gap: 10px;
        align-items: flex-start;
      }

      .zinc-user {
        justify-content: flex-end;
      }

      .zinc-user .message-content {
        background: #FFD700;
        color: #000;
      }

      .zinc-assistant .message-content {
        background: #333;
        color: #FFD700;
      }

      .message-avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        flex-shrink: 0;
      }

      .zinc-avatar {
        width: 30px;
        height: 30px;
        background: linear-gradient(135deg, #FFD700, #FFA500);
        border: 1px solid #FFD700;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .zinc-avatar-symbol {
        width: 18px;
        height: 18px;
        object-fit: contain;
        filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.3));
      }

      .message-content {
        max-width: 250px;
        padding: 10px 15px;
        border-radius: 10px;
        font-size: 14px;
        line-height: 1.4;
      }

      .zinc-input-container {
        display: flex;
        padding: 15px;
        gap: 5px;
        background: #2d2d2d;
        border-top: 1px solid #FFD700;
      }

      #zinc-input {
        flex: 1;
        background: #1a1a1a;
        border: 1px solid #FFD700;
        color: #FFD700;
        padding: 8px 12px;
        border-radius: 5px;
        font-family: 'Orbitron', monospace;
        font-size: 12px;
      }

      #zinc-send, #zinc-voice {
        background: #FFD700;
        color: #000;
        border: none;
        padding: 8px 12px;
        border-radius: 5px;
        cursor: pointer;
        font-family: 'Orbitron', monospace;
        font-size: 12px;
        font-weight: bold;
      }

      #zinc-voice.listening {
        background: #ff4444;
        animation: pulse 1s infinite;
      }

      .zinc-quick-actions {
        display: flex;
        gap: 5px;
        padding: 10px 15px;
        background: #2d2d2d;
        flex-wrap: wrap;
      }

      .zinc-quick-actions button {
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

      .zinc-quick-actions button:hover {
        background: #FFD700;
        color: #000;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      @media (max-width: 768px) {
        #zinc-modal {
          top: 10px;
          right: 10px;
          width: 300px;
          height: 450px;
        }

        .zinc-quick-actions {
          flex-direction: column;
        }

        .zinc-quick-actions button {
          text-align: center;
        }
      }

      @media (max-width: 480px) {
        #zinc-modal {
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
    const canvas = document.getElementById('zinc-canvas');
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
    const modal = document.getElementById('zinc-modal');
    if (this.isActive) {
      this.closeInterface();
    } else {
      modal.style.display = 'block';
      this.isActive = true;
      // Small delay to ensure modal is rendered before focusing
      setTimeout(() => {
        const input = document.getElementById('zinc-input');
        if (input) input.focus();
      }, 100);
    }
  }

  closeInterface() {
    const modal = document.getElementById('zinc-modal');
    modal.style.display = 'none';
    this.isActive = false;
    if (this.isListening) {
      this.toggleVoiceInput();
    }
  }

  sendMessage() {
    const input = document.getElementById('zinc-input');
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
    const chat = document.getElementById('zinc-chat');
    const messageDiv = document.createElement('div');
    messageDiv.className = `zinc-message zinc-${sender}`;

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
    const voiceBtn = document.getElementById('zinc-voice');

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
          document.getElementById('zinc-input').value = transcript;
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

// Initialize Zinc when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.zincCopilot = new ZincCopilot();
});