
// Leaderboard system for ZWAP! games
class ZwapLeaderboard {
  constructor() {
    this.leaderboardData = this.loadLeaderboardData();
    this.currentUser = null;
    this.init();
  }

  init() {
    this.setupTabSwitching();
    this.renderAllLeaderboards();
    this.updateUserStats();
    
    // Update leaderboards every 30 seconds
    setInterval(() => {
      this.refreshLeaderboards();
    }, 30000);
  }

  setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.leaderboard-section');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all tabs and sections
        tabButtons.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        // Add active class to clicked tab and corresponding section
        btn.classList.add('active');
        const targetSection = document.getElementById(btn.dataset.tab);
        if (targetSection) {
          targetSection.classList.add('active');
        }
      });
    });
  }

  // Load leaderboard data (mock data for now)
  loadLeaderboardData() {
    const saved = localStorage.getItem('zwapLeaderboard');
    if (saved) {
      return JSON.parse(saved);
    }

    // Generate mock leaderboard data
    return {
      overall: this.generateMockData('overall'),
      cube: this.generateMockData('cube'),
      trivia: this.generateMockData('trivia'),
      blockcraft: this.generateMockData('blockcraft'),
      spin: this.generateMockData('spin')
    };
  }

  generateMockData(gameType) {
    const names = [
      'CryptoPro', 'BlockMaster', 'XHIKing', 'GameChamp', 'EarnBot',
      'CubeWizard', 'TriviaGuru', 'BuilderX', 'SpinLord', 'WalletHero',
      'ChainGamer', 'TokenEarn', 'PlayToWin', 'CryptoAce', 'ZwapStar',
      'PixelMiner', 'ScoreHunter', 'RewardSeeker', 'GameMaster', 'EarnPro'
    ];

    const mockPlayers = [];
    for (let i = 0; i < 20; i++) {
      const wallet = this.generateMockWallet();
      const baseScore = Math.floor(Math.random() * 10000) + 1000;
      const earnings = (baseScore * 0.0001 + Math.random() * 0.01).toFixed(4);
      
      mockPlayers.push({
        wallet: wallet,
        name: names[i] || `Player${i + 1}`,
        score: baseScore,
        earnings: parseFloat(earnings),
        gamesPlayed: Math.floor(Math.random() * 100) + 10,
        lastActive: Date.now() - Math.random() * 86400000 * 7 // Within last week
      });
    }

    // Sort by score descending
    return mockPlayers.sort((a, b) => b.score - a.score);
  }

  generateMockWallet() {
    const chars = '0123456789abcdef';
    let wallet = '0x';
    for (let i = 0; i < 40; i++) {
      wallet += chars[Math.floor(Math.random() * chars.length)];
    }
    return wallet;
  }

  renderAllLeaderboards() {
    this.renderLeaderboard('overall', 'overallLeaderboard');
    this.renderLeaderboard('cube', 'cubeLeaderboard');
    this.renderLeaderboard('trivia', 'triviaLeaderboard');
    this.renderLeaderboard('blockcraft', 'blockcraftLeaderboard');
    this.renderLeaderboard('spin', 'spinLeaderboard');
  }

  renderLeaderboard(gameType, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = this.leaderboardData[gameType] || [];
    
    container.innerHTML = data.slice(0, 10).map((player, index) => {
      const rank = index + 1;
      const rankClass = rank === 1 ? 'first' : rank === 2 ? 'second' : rank === 3 ? 'third' : '';
      
      return `
        <div class="leaderboard-entry">
          <div class="rank ${rankClass}">${rank}</div>
          <div class="player-info">
            <div class="player-avatar">${player.name.charAt(0)}</div>
            <div>
              <div class="player-name">${player.name}</div>
              <div class="player-wallet">${player.wallet.substring(0, 8)}...${player.wallet.substring(38)}</div>
            </div>
          </div>
          <div class="score-value">${player.score.toLocaleString()}</div>
          <div class="earnings-value">${player.earnings.toFixed(4)} XHI</div>
        </div>
      `;
    }).join('');
  }

  updateUserStats() {
    // Get current user data (from wallet connection)
    const connectBtn = document.getElementById('connectBtn');
    if (!connectBtn || connectBtn.textContent === 'CONNECT WALLET') {
      // User not connected
      document.getElementById('userRank').textContent = '--';
      document.getElementById('userEarnings').textContent = '0.0000 XHI';
      document.getElementById('userBestScore').textContent = '0';
      document.getElementById('userGamesPlayed').textContent = '0';
      return;
    }

    // Get user data from localStorage or generate mock data
    const userData = this.getCurrentUserData();
    
    document.getElementById('userRank').textContent = userData.rank || '--';
    document.getElementById('userEarnings').textContent = `${userData.totalEarnings.toFixed(4)} XHI`;
    document.getElementById('userBestScore').textContent = userData.bestScore.toLocaleString();
    document.getElementById('userGamesPlayed').textContent = userData.gamesPlayed.toLocaleString();
  }

  getCurrentUserData() {
    const saved = localStorage.getItem('zwapUserStats');
    if (saved) {
      return JSON.parse(saved);
    }

    // Default user stats
    return {
      rank: null,
      totalEarnings: 0,
      bestScore: 0,
      gamesPlayed: 0,
      scores: {
        cube: 0,
        trivia: 0,
        blockcraft: 0,
        spin: 0
      }
    };
  }

  // Update user score after game completion
  updateUserScore(gameType, score, earnings) {
    const userData = this.getCurrentUserData();
    
    // Update user stats
    userData.totalEarnings += earnings;
    userData.gamesPlayed += 1;
    userData.scores[gameType] = Math.max(userData.scores[gameType] || 0, score);
    userData.bestScore = Math.max(userData.bestScore, score);

    // Save user data
    localStorage.setItem('zwapUserStats', JSON.stringify(userData));

    // Add to leaderboard if score is high enough
    this.addToLeaderboard(gameType, score, earnings);
    
    // Update UI
    this.updateUserStats();
    this.renderAllLeaderboards();
  }

  addToLeaderboard(gameType, score, earnings) {
    const connectBtn = document.getElementById('connectBtn');
    if (!connectBtn || connectBtn.textContent === 'CONNECT WALLET') return;

    const walletAddress = this.extractWalletFromButton(connectBtn.textContent);
    if (!walletAddress) return;

    const playerData = {
      wallet: walletAddress,
      name: `Player${Math.floor(Math.random() * 1000)}`, // In real app, this would come from user profile
      score: score,
      earnings: earnings,
      gamesPlayed: 1,
      lastActive: Date.now()
    };

    // Add to specific game leaderboard
    if (!this.leaderboardData[gameType]) {
      this.leaderboardData[gameType] = [];
    }

    // Find existing entry or add new one
    const existingIndex = this.leaderboardData[gameType].findIndex(p => p.wallet === walletAddress);
    if (existingIndex >= 0) {
      const existing = this.leaderboardData[gameType][existingIndex];
      existing.score = Math.max(existing.score, score);
      existing.earnings += earnings;
      existing.gamesPlayed += 1;
      existing.lastActive = Date.now();
    } else {
      this.leaderboardData[gameType].push(playerData);
    }

    // Sort and trim to top 50
    this.leaderboardData[gameType].sort((a, b) => b.score - a.score);
    this.leaderboardData[gameType] = this.leaderboardData[gameType].slice(0, 50);

    // Update overall leaderboard
    this.updateOverallLeaderboard();

    // Save to localStorage
    localStorage.setItem('zwapLeaderboard', JSON.stringify(this.leaderboardData));
  }

  updateOverallLeaderboard() {
    const overall = {};
    
    // Aggregate scores from all games
    ['cube', 'trivia', 'blockcraft', 'spin'].forEach(gameType => {
      if (this.leaderboardData[gameType]) {
        this.leaderboardData[gameType].forEach(player => {
          if (!overall[player.wallet]) {
            overall[player.wallet] = {
              wallet: player.wallet,
              name: player.name,
              score: 0,
              earnings: 0,
              gamesPlayed: 0,
              lastActive: player.lastActive
            };
          }
          overall[player.wallet].score += player.score;
          overall[player.wallet].earnings += player.earnings;
          overall[player.wallet].gamesPlayed += player.gamesPlayed;
          overall[player.wallet].lastActive = Math.max(overall[player.wallet].lastActive, player.lastActive);
        });
      }
    });

    // Convert to array and sort
    this.leaderboardData.overall = Object.values(overall)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
  }

  extractWalletFromButton(buttonText) {
    const match = buttonText.match(/^([0-9a-fA-F]{6})\.\.\.([0-9a-fA-F]{4})$/);
    if (match) {
      return `0x${match[1]}${'0'.repeat(30)}${match[2]}`;
    }
    return null;
  }

  refreshLeaderboards() {
    // In a real app, this would fetch from the server
    this.renderAllLeaderboards();
    this.updateUserStats();
  }

  // Method to be called from games when they complete
  recordGameResult(gameType, score, earnings) {
    this.updateUserScore(gameType, score, earnings);
  }
}

// Initialize leaderboard when page loads
document.addEventListener('DOMContentLoaded', () => {
  window.zwapLeaderboard = new ZwapLeaderboard();
});

// Export for use in games
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ZwapLeaderboard;
}
