/**
 * Zebulon Oracle Integration for ZWAP!
 * ©️ 2025 XOCLON HOLDINGS INC.™ - All Rights Reserved
 * 
 * This file contains proprietary intellectual property of XOCLON HOLDINGS INC.™
 * Unauthorized copying, reproduction, or distribution is strictly prohibited.
 */

class ZebulonOracle {
  constructor() {
    this.isConnected = false;
    this.oracleEndpoint = 'wss://zebulon-oracle.xoclon.online/ws';
    this.zedAIEndpoint = 'https://zed-ai.xoclon.online/api';
    this.sessionId = null;
    this.messageQueue = [];
    this.websocket = null;
    this.retryCount = 0;
    this.maxRetries = 3;

    this.initializeOracle();
  }

  async initializeOracle() {
    try {
      await this.connectToOracle();
      this.createInterface();
      console.log('🔮 Zebulon Oracle initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Zebulon Oracle:', error);
      this.handleConnectionError(error);
    }
  }

  async connectToOracle() {
    return new Promise((resolve, reject) => {
      try {
        this.websocket = new WebSocket(this.oracleEndpoint);

        this.websocket.onopen = () => {
          console.log('🌐 Connected to Zebulon Oracle');
          this.isConnected = true;
          this.retryCount = 0;
          this.sessionId = this.generateSessionId();
          this.sendAuthMessage();
          resolve();
        };

        this.websocket.onmessage = (event) => {
          this.handleOracleMessage(event.data);
        };

        this.websocket.onclose = (event) => {
          console.log('🔌 Oracle connection closed:', event.code);
          this.isConnected = false;
          this.handleReconnection();
        };

        this.websocket.onerror = (error) => {
          console.error('⚠️ Oracle connection error:', error);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  generateSessionId() {
    return 'zed_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  sendAuthMessage() {
    const authPayload = {
      type: 'auth',
      sessionId: this.sessionId,
      platform: 'ZWAP',
      timestamp: Date.now(),
      version: '1.0.0'
    };

    this.sendMessage(authPayload);
  }

  sendMessage(payload) {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(payload));
    } else {
      this.messageQueue.push(payload);
      console.warn('📦 Message queued - Oracle not connected');
    }
  }

  handleOracleMessage(rawData) {
    try {
      const message = JSON.parse(rawData);

      switch (message.type) {
        case 'auth_success':
          console.log('✅ Oracle authentication successful');
          this.processMessageQueue();
          break;

        case 'prediction':
          this.handlePrediction(message.data);
          break;

        case 'market_data':
          this.handleMarketData(message.data);
          break;

        case 'user_insight':
          this.handleUserInsight(message.data);
          break;

        case 'system_alert':
          this.handleSystemAlert(message.data);
          break;

        default:
          console.log('📨 Received oracle message:', message);
      }
    } catch (error) {
      console.error('❌ Error parsing oracle message:', error);
    }
  }

  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  }

  async queryZedAI(prompt, context = {}) {
    try {
      const payload = {
        prompt: prompt,
        context: {
          ...context,
          sessionId: this.sessionId,
          platform: 'ZWAP',
          userWallet: window.zwapWallet?.address() || null,
          timestamp: Date.now()
        }
      };

      const response = await fetch(`${this.zedAIEndpoint}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`ZedAI query failed: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('❌ ZedAI query error:', error);
      return {
        success: false,
        error: error.message,
        fallback: 'Oracle temporarily unavailable. Please try again later.'
      };
    }
  }

  handlePrediction(data) {
    console.log('🔮 Oracle Prediction:', data);
    this.displayPrediction(data);
  }

  handleMarketData(data) {
    console.log('📈 Market Data Update:', data);
    this.updateMarketUI(data);
  }

  handleUserInsight(data) {
    console.log('💡 User Insight:', data);
    this.showUserInsight(data);
  }

  handleSystemAlert(data) {
    console.log('🚨 System Alert:', data);
    this.displayAlert(data);
  }

  createInterface() {
    // Create Zebulon Oracle floating button
    const oracleButton = document.createElement('div');
    oracleButton.id = 'zebulon-oracle-button';
    oracleButton.innerHTML = `
      <div class="oracle-button-circle">
        <span class="oracle-symbol">🔮</span>
      </div>
    `;
    document.body.appendChild(oracleButton);

    // Create Oracle interface modal
    const oracleModal = document.createElement('div');
    oracleModal.id = 'zebulon-oracle-modal';
    oracleModal.innerHTML = `
      <div class="oracle-container">
        <div class="oracle-header">
          <span class="oracle-title">Zebulon Oracle</span>
          <div class="connection-status ${this.isConnected ? 'connected' : 'disconnected'}"></div>
          <button class="oracle-close" onclick="window.zebulonOracle.closeInterface()">×</button>
        </div>
        <div class="oracle-content">
          <div class="oracle-input-container">
            <input type="text" id="oracle-input" placeholder="Ask the Oracle about markets, trades, or predictions..." />
            <button id="oracle-send" onclick="window.zebulonOracle.sendQuery()">Query</button>
          </div>
          <div class="oracle-insights" id="oracle-insights">
            <div class="insight-placeholder">
              <p>🔮 The Oracle is ready to provide insights</p>
              <p>Ask about market predictions, optimal trading times, or strategic guidance.</p>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(oracleModal);

    // Add event listeners
    oracleButton.onclick = () => this.toggleInterface();

    const input = document.getElementById('oracle-input');
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendQuery();
    });

    // Add styles
    this.addStyles();
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #zebulon-oracle-button {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 60px;
        height: 60px;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        animation: oracleGlow 3s infinite alternate;
      }

      .oracle-button-circle {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #4A148C, #7B1FA2);
        border: 2px solid #E1BEE7;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(123, 31, 162, 0.4);
      }

      .oracle-symbol {
        font-size: 28px;
        filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));
      }

      #zebulon-oracle-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(123, 31, 162, 0.6);
      }

      #zebulon-oracle-modal {
        position: fixed;
        top: 20px;
        left: 20px;
        width: 400px;
        height: 500px;
        background: linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(45, 45, 45, 0.95));
        border: 2px solid #E1BEE7;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 1001;
        display: none;
        font-family: 'Orbitron', monospace;
        backdrop-filter: blur(10px);
      }

      .oracle-container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .oracle-header {
        background: linear-gradient(135deg, #7B1FA2, #4A148C);
        color: #fff;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 13px 13px 0 0;
      }

      .oracle-title {
        font-weight: bold;
        font-size: 16px;
      }

      .connection-status {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin: 0 10px;
      }

      .connection-status.connected {
        background: #4CAF50;
        box-shadow: 0 0 10px #4CAF50;
        animation: pulse 2s infinite;
      }

      .connection-status.disconnected {
        background: #F44336;
      }

      .oracle-close {
        background: none;
        border: none;
        color: #fff;
        font-size: 24px;
        cursor: pointer;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }

      .oracle-close:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .oracle-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 20px;
      }

      .oracle-input-container {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
      }

      #oracle-input {
        flex: 1;
        background: rgba(26, 26, 26, 0.8);
        border: 1px solid #E1BEE7;
        color: #E1BEE7;
        padding: 12px;
        border-radius: 8px;
        font-family: 'Orbitron', monospace;
      }

      #oracle-input::placeholder {
        color: rgba(225, 190, 231, 0.6);
      }

      #oracle-send {
        background: #7B1FA2;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
      }

      #oracle-send:hover {
        background: #4A148C;
      }

      .oracle-insights {
        flex: 1;
        background: rgba(123, 31, 162, 0.1);
        border: 1px solid rgba(225, 190, 231, 0.3);
        border-radius: 8px;
        padding: 15px;
        overflow-y: auto;
        color: #E1BEE7;
      }

      .insight-placeholder {
        text-align: center;
        color: rgba(225, 190, 231, 0.7);
        margin-top: 50px;
      }

      .oracle-response {
        margin-bottom: 15px;
        padding: 10px;
        background: rgba(26, 26, 26, 0.5);
        border-radius: 5px;
        border-left: 3px solid #7B1FA2;
      }

      @keyframes oracleGlow {
        0% { box-shadow: 0 4px 15px rgba(123, 31, 162, 0.4); }
        100% { box-shadow: 0 6px 25px rgba(123, 31, 162, 0.8); }
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
  }

  toggleInterface() {
    const modal = document.getElementById('zebulon-oracle-modal');
    const isVisible = modal.style.display === 'block';

    if (isVisible) {
      this.closeInterface();
    } else {
      modal.style.display = 'block';
      const input = document.getElementById('oracle-input');
      if (input) input.focus();
    }
  }

  closeInterface() {
    const modal = document.getElementById('zebulon-oracle-modal');
    modal.style.display = 'none';
  }

  async sendQuery() {
    const input = document.getElementById('oracle-input');
    const query = input.value.trim();

    if (!query) return;

    const insights = document.getElementById('oracle-insights');

    // Show loading state
    this.addInsight('🔮 Consulting the Oracle...', 'loading');

    // Clear input
    input.value = '';

    try {
      // Send to Zed AI via Oracle
      const oraclePayload = {
        type: 'zed_query',
        sessionId: this.sessionId,
        query: query,
        context: {
          currentPage: window.location.pathname,
          walletConnected: window.zwapWallet?.connected() || false,
          timestamp: Date.now()
        }
      };

      this.sendMessage(oraclePayload);

      // Also query Zed AI directly as backup
      const result = await this.queryZedAI(query);

      if (result.success) {
        this.addInsight(result.response, 'response');
      } else {
        this.addInsight(result.fallback || 'Oracle connection unstable. Please try again.', 'error');
      }

    } catch (error) {
      console.error('Query error:', error);
      this.addInsight('Failed to reach the Oracle. Please check your connection.', 'error');
    }
  }

  addInsight(message, type = 'response') {
    const insights = document.getElementById('oracle-insights');
    const placeholder = insights.querySelector('.insight-placeholder');

    if (placeholder) {
      placeholder.remove();
    }

    // Remove loading messages
    if (type !== 'loading') {
      const loadingMessages = insights.querySelectorAll('.oracle-response.loading');
      loadingMessages.forEach(msg => msg.remove());
    }

    const insight = document.createElement('div');
    insight.className = `oracle-response ${type}`;
    insight.innerHTML = `
      <div class="insight-timestamp">${new Date().toLocaleTimeString()}</div>
      <div class="insight-content">${message}</div>
    `;

    insights.appendChild(insight);
    insights.scrollTop = insights.scrollHeight;
  }

  displayPrediction(data) {
    this.addInsight(`📊 ${data.message}`, 'prediction');
  }

  updateMarketUI(data) {
    // Update any market-related UI elements
    console.log('Updating market UI with:', data);
  }

  showUserInsight(data) {
    this.addInsight(`💡 ${data.insight}`, 'insight');
  }

  displayAlert(data) {
    this.addInsight(`⚠️ ${data.message}`, 'alert');
  }

  handleReconnection() {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`🔄 Attempting to reconnect... (${this.retryCount}/${this.maxRetries})`);

      setTimeout(() => {
        this.connectToOracle();
      }, 5000 * this.retryCount);
    } else {
      console.error('❌ Max reconnection attempts reached');
      this.addInsight('Oracle connection lost. Please refresh the page.', 'error');
    }
  }

  handleConnectionError(error) {
    console.error('Oracle connection error:', error);
    // Fallback to offline mode or show error message
  }

  connectWebSocket() {
    try {
      // Use mock connection for now to avoid connection errors
      this.simulateMockConnection();
    } catch (error) {
      console.log('❌ Failed to initialize Zebulon Oracle:', error);
      this.simulateMockConnection();
    }
  }

  simulateMockConnection() {
    console.log('🔗 Using mock Oracle connection (development mode)');
    this.isConnected = true;
    this.reconnectAttempts = 0;

    // Simulate successful authentication
    setTimeout(() => {
      this.handleMessage({
        type: 'auth_response',
        success: true,
        sessionId: 'mock-session-' + Date.now()
      });
    }, 1000);
  }
}

// Initialize Zebulon Oracle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.zebulonOracle = new ZebulonOracle();
});