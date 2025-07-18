document.addEventListener("DOMContentLoaded", () => {
// Toggle dropdown menu under bang
const bang = document.getElementById('bang');
if (bang) {
bang.onclick = () => {
const menu = document.getElementById('bangMenu');
if (menu) {
menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
}
};
}

const homeBtn = document.getElementById('homeBtn');
if (homeBtn) {
homeBtn.onclick = () => {
window.location.href = 'index.html';
};
}

function showModal(title, htmlContent) {
Swal.fire({
title: title,
html: htmlContent,
background: 'transparent',
color: '#fff',
showCloseButton: true,
showConfirmButton: false,
customClass: { 
  popup: 'swal2-popup',
  title: 'swal2-title',
  htmlContainer: 'swal2-html-container',
  closeButton: 'swal2-close'
},
backdrop: true,
allowOutsideClick: true,
allowEscapeKey: true,
showClass: {
  popup: 'swal2-show'
}
});
}

// Global variables for wallet connection
let walletProvider = null;
let connectedAccount = null;

const connectBtn = document.getElementById('connectBtn');
if (connectBtn) {
connectBtn.onclick = async () => {
try {
await connectWallet();
} catch (error) {
console.error('Wallet connection error:', error);
showModal('WALLET CONNECTION ERROR', '<p>Failed to connect wallet. Please try again.</p>');
}
};
}

async function connectWallet() {
try {
// Show wallet selection modal
const result = await Swal.fire({
title: '<span style="font-family:\'Orbitron\'">SELECT WALLET</span>',
html: `
<div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
<button class="wallet-option" data-wallet="metamask" style="background: linear-gradient(145deg, #2a2a2a, #1a1a1a); border: 2px solid #4a4a4a; padding: 1rem; border-radius: 10px; color: white; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
<img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" style="width: 24px; height: 24px;">
MetaMask
</button>
<button class="wallet-option" data-wallet="walletconnect" style="background: linear-gradient(145deg, #2a2a2a, #1a1a1a); border: 2px solid #4a4a4a; padding: 1rem; border-radius: 10px; color: white; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
<img src="https://walletconnect.com/static/favicon-32x32.png" alt="WalletConnect" style="width: 24px; height: 24px;">
WalletConnect
</button>
<button class="wallet-option" data-wallet="coinbase" style="background: linear-gradient(145deg, #2a2a2a, #1a1a1a); border: 2px solid #4a4a4a; padding: 1rem; border-radius: 10px; color: white; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
<img src="https://www.coinbase.com/favicon.ico" alt="Coinbase" style="width: 24px; height: 24px;">
Coinbase Wallet
</button>
</div>
`,
background: '#111',
color: '#fff',
showCloseButton: true,
showConfirmButton: false,
customClass: { popup: 'swal2-popup' },
didOpen: () => {
// Add click handlers for wallet options
document.querySelectorAll('.wallet-option').forEach(btn => {
btn.addEventListener('click', async (e) => {
const walletType = e.target.dataset.wallet;
Swal.close();
await handleWalletConnection(walletType);
});
});
}
});
} catch (error) {
console.error('Error showing wallet selection:', error);
}
}

async function handleWalletConnection(walletType) {
try {
showModal('CONNECTING...', '<p>Connecting to your wallet...</p>');

let accounts = [];
let provider = null;

switch (walletType) {
case 'metamask':
if (typeof window.ethereum !== 'undefined') {
try {
accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
provider = window.ethereum;
connectedAccount = accounts[0];
walletProvider = provider;
} catch (error) {
throw new Error('MetaMask connection rejected or failed');
}
} else {
throw new Error('MetaMask not installed. Please install MetaMask extension.');
}
break;

case 'walletconnect':
try {
// Initialize WalletConnect provider
const WalletConnectProvider = window.WalletConnectProvider.default;
provider = new WalletConnectProvider({
infuraId: "your-infura-id", // You'll need to get a free Infura ID
chainId: 1,
rpc: {
1: "https://mainnet.infura.io/v3/your-infura-id",
137: "https://polygon-rpc.com/",
56: "https://bsc-dataseed.binance.org/"
}
});

await provider.enable();
accounts = provider.accounts;
connectedAccount = accounts[0];
walletProvider = provider;
} catch (error) {
throw new Error('WalletConnect connection failed');
}
break;

case 'coinbase':
if (typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet) {
try {
accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
provider = window.ethereum;
connectedAccount = accounts[0];
walletProvider = provider;
} catch (error) {
throw new Error('Coinbase Wallet connection rejected or failed');
}
} else {
throw new Error('Coinbase Wallet not detected. Please install Coinbase Wallet.');
}
break;

default:
throw new Error('Unknown wallet type');
}

if (accounts.length > 0) {
// Update connect button text
        const connectBtn = document.getElementById('connectBtn');
        if (connectBtn) {
          connectBtn.textContent = `${accounts[0].substring(0,6)}...${accounts[0].substring(38)}`;
          connectBtn.classList.add('connected');
        }

// Update balance display with mock data (replace with real blockchain calls)
updateBalances(1.2345, 150);

// Notify cube game if on game page
if (typeof window.ZwapCubeGame !== 'undefined') {
window.ZwapCubeGame.initializeWallet({
address: accounts[0],
balance: 1.2345,
isPremium: false,
walletType: walletType
});
}

showModal('WALLET CONNECTED', `
<div style="text-align: center;">
<p style="color: #00ff00; font-weight: bold;">✅ Successfully Connected!</p>
<p>Wallet: ${accounts[0].substring(0,8)}...${accounts[0].substring(36)}</p>
<p style="font-size: 0.9rem; color: #ccc;">Wallet Type: ${walletType.charAt(0).toUpperCase() + walletType.slice(1)}</p>
</div>
`);
} else {
throw new Error('No accounts found');
}

} catch (error) {
console.error('Wallet connection error:', error);
showModal('CONNECTION FAILED', `<p style="color: #ff6666;">${error.message}</p>`);
}
}

// Simulate balance updates (replace with real data in production)
function updateBalances(xhi = 0.00, zPoints = 0) {
  const xhiElement = document.getElementById('xhiBalance');
  const zElement = document.getElementById('zBalance');

  if (xhiElement) xhiElement.textContent = xhi.toFixed(2);
  if (zElement) zElement.textContent = zPoints.toLocaleString();
  
  // Check for referral bonuses when balances update
  if (typeof referralSystem !== 'undefined' && referralSystem) {
    referralSystem.awardReferralBonuses();
  }
}

// Referral System Implementation
class ReferralSystem {
  constructor() {
    this.referralData = JSON.parse(localStorage.getItem('zwapReferralData') || '{}');
    this.userStats = JSON.parse(localStorage.getItem('zwapUserStats') || '{}');
    this.initializeReferralTracking();
  }

  initializeReferralTracking() {
    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    
    if (referralCode && !this.referralData.usedReferralCode) {
      this.referralData.referredBy = referralCode;
      this.referralData.usedReferralCode = true;
      this.saveReferralData();
    }
  }

  generateReferralCode() {
    const connectBtn = document.getElementById('connectBtn');
    if (!connectBtn || connectBtn.textContent === 'CONNECT WALLET') return null;
    
    const walletAddress = this.extractWalletFromButton(connectBtn.textContent);
    if (!walletAddress) return null;
    
    // Generate referral code based on wallet address
    return walletAddress.substring(0, 8).toUpperCase();
  }

  extractWalletFromButton(buttonText) {
    const match = buttonText.match(/^([a-fA-F0-9]{6})\.\.\.([a-fA-F0-9]{4})$/);
    return match ? `0x${match[1]}${match[2]}` : null;
  }

  getUserEarnings() {
    return this.userStats.totalEarnings || 0;
  }

  getDaysActive() {
    const streakData = JSON.parse(localStorage.getItem('zwapStreakData') || '{}');
    return streakData.totalDaysActive || 0;
  }

  checkReferralBonusEligibility() {
    const earnings = this.getUserEarnings();
    const daysActive = this.getDaysActive();
    
    // Referrer bonus: +25 XHI when referred user earns 500 XHI
    const referrerBonusEligible = earnings >= 500 && !this.referralData.referrerBonusAwarded;
    
    // Invitee bonus: +25 XHI after completing 3 days of MOVE or Faucet play
    const inviteeBonusEligible = daysActive >= 3 && !this.referralData.inviteeBonusAwarded;
    
    return { referrerBonusEligible, inviteeBonusEligible };
  }

  awardReferralBonuses() {
    const { referrerBonusEligible, inviteeBonusEligible } = this.checkReferralBonusEligibility();
    
    if (inviteeBonusEligible && this.referralData.referredBy) {
      // Award invitee bonus
      this.referralData.inviteeBonusAwarded = true;
      this.userStats.totalEarnings = (this.userStats.totalEarnings || 0) + 25;
      this.saveReferralData();
      this.saveUserStats();
      
      showModal('REFERRAL BONUS EARNED!', `
        <p style="color: #00ff00; font-weight: bold;">🎉 You've earned +25 XHI!</p>
        <p>Bonus for completing 3 days of activity as a referred user.</p>
      `);
    }
    
    if (referrerBonusEligible && this.referralData.referredBy) {
      // This would notify the referrer (in a real implementation, this would be handled server-side)
      console.log('Referrer bonus should be awarded to:', this.referralData.referredBy);
    }
  }

  showReferralDashboard() {
    const referralCode = this.generateReferralCode();
    if (!referralCode) {
      showModal('CONNECT WALLET', '<p>Please connect your wallet to access referral features.</p>');
      return;
    }

    const referralLink = `${window.location.origin}?ref=${referralCode}`;
    const { referrerBonusEligible, inviteeBonusEligible } = this.checkReferralBonusEligibility();
    
    showModal('REFERRAL DASHBOARD', `
      <div style="text-align: left; line-height: 1.6;">
        <p><strong>Your Referral Code:</strong> <span style="color: #00BFFF; font-weight: bold;">${referralCode}</span></p>
        
        <p><strong>Referral Link:</strong></p>
        <div style="background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 5px; margin: 0.5rem 0; word-break: break-all; font-size: 0.9rem;">
          ${referralLink}
        </div>
        
        <button onclick="navigator.clipboard.writeText('${referralLink}')" style="background: #00BFFF; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; margin-bottom: 1rem;">
          📋 Copy Link
        </button>
        
        <div style="margin-top: 1.5rem;">
          <h3 style="color: #FFD700; margin-bottom: 1rem;">📊 Referral Status</h3>
          
          <p><strong>🎯 Referrer Bonus (25 XHI):</strong><br/>
          ${referrerBonusEligible ? '✅ Eligible! Bonus will be awarded when referred user earns 500 XHI.' : '⏳ Refer users who earn 500+ XHI to unlock this bonus.'}</p>
          
          <p><strong>🎁 Invitee Bonus (25 XHI):</strong><br/>
          ${this.referralData.referredBy ? 
            (inviteeBonusEligible ? '✅ Bonus earned!' : `⏳ ${3 - this.getDaysActive()} more days of activity needed.`) : 
            '❌ Not referred by anyone.'}</p>
          
          <p><strong>Total Earnings:</strong> <span class="gold">${this.getUserEarnings().toFixed(2)} XHI</span></p>
          <p><strong>Days Active:</strong> ${this.getDaysActive()}</p>
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(0,191,255,0.1); border-radius: 8px; border-left: 4px solid #00BFFF;">
          <h4 style="color: #00BFFF; margin-bottom: 0.5rem;">🛡️ Anti-Abuse Protection</h4>
          <p style="font-size: 0.9rem; color: #ccc;">
            • Bonuses only awarded for genuine engagement<br/>
            • Duplicate wallets from same device are blocked<br/>
            • Performance-based rewards prevent spam
          </p>
        </div>
      </div>
    `);
  }

  saveReferralData() {
    localStorage.setItem('zwapReferralData', JSON.stringify(this.referralData));
  }

  saveUserStats() {
    localStorage.setItem('zwapUserStats', JSON.stringify(this.userStats));
  }
}

// Initialize referral system after DOM load
let referralSystem = null;

// Daily Streak System for Referral Bonus Tracking
class DailyStreakSystem {
  constructor() {
    this.streakData = JSON.parse(localStorage.getItem('zwapStreakData') || '{}');
    this.checkDailyLogin();
  }

  checkDailyLogin() {
    const today = new Date().toDateString();
    const lastLogin = this.streakData.lastLogin;
    
    if (lastLogin !== today) {
      this.streakData.lastLogin = today;
      this.streakData.totalDaysActive = (this.streakData.totalDaysActive || 0) + 1;
      this.saveStreakData();
      
      // Check if this qualifies for referral bonus
      if (this.streakData.totalDaysActive >= 3 && referralSystem) {
        referralSystem.awardReferralBonuses();
      }
    }
  }

  saveStreakData() {
    localStorage.setItem('zwapStreakData', JSON.stringify(this.streakData));
  }
}

// Initialize referral and streak systems
referralSystem = new ReferralSystem();
const dailyStreakSystem = new DailyStreakSystem();

// Initialize balances
updateBalances();

const learnBtn = document.getElementById('learnBtn');
if (learnBtn) {
learnBtn.onclick = () => {
showLearnModal();
};
}

function showLearnModal() {
const learnContent = [
{
title: 'WHAT IS ZWAP?',
content: '<p><strong>ZWAP!</strong> represents the next generation of decentralized reward infrastructure, seamlessly integrating wellness optimization, creative expression, and gamified earning mechanisms.</p>'
},
{
title: 'STRATEGIC VISION',
content: '<p><strong>🎯 Strategic Vision:</strong><br/>We are pioneering a paradigm shift in incentive-based lifestyle optimization. Our platform leverages advanced blockchain architecture to transform everyday wellness activities into quantifiable value creation opportunities.</p>'
},
{
title: 'REVENUE GENERATION',
content: '<p><strong>💰 Revenue Generation Streams:</strong><br/>• Kinetic Energy Monetization (Movement-to-Earn Protocol)<br/>• Gamified Cognitive Engagement Rewards<br/>• Creative Content Monetization Framework<br/>• Credit Optimization Incentive Programs<br/>• Exclusive Marketplace Access Rights</p>'
},
{
title: 'BLOCKCHAIN TECHNOLOGY',
content: '<p><strong>🔗 Distributed Ledger Technology:</strong><br/>Our enterprise-grade blockchain infrastructure ensures complete transparency, immutable transaction records, and decentralized governance. Smart contract automation guarantees fair and immediate reward distribution across all ecosystem participants.</p>'
},
{
title: 'PLATFORM ANALYTICS',
content: '<p><strong>📊 Platform Analytics:</strong><br/>Real-time performance metrics, advanced earning optimization algorithms, and institutional-grade security protocols position ZWAP! as the premier choice for forward-thinking individuals seeking to maximize their lifestyle ROI.</p><p style="text-align: center; margin-top: 1.5rem;"><a href="#" style="color:#FFD700; font-weight: bold;">📄 Access Technical Documentation</a></p>'
}
];

showPaginatedModal(learnContent, 0);
}

function showPaginatedModal(content, currentIndex) {
const current = content[currentIndex];
const isLast = currentIndex === content.length - 1;

Swal.fire({
title: current.title,
html: `
<div style="text-align: left; line-height: 1.8;">
${current.content}
</div>
<div style="text-align: center; margin-top: 2rem;">
${!isLast ? '<button class="large-btn" onclick="nextPage()">NEXT →</button>' : ''}
</div>
`,
background: 'transparent',
color: '#fff',
showCloseButton: true,
showConfirmButton: false,
customClass: { 
popup: 'swal2-popup',
title: 'swal2-title',
htmlContainer: 'swal2-html-container',
closeButton: 'swal2-close'
},
backdrop: true,
allowOutsideClick: true,
allowEscapeKey: true,
showClass: {
popup: 'swal2-show'
},
didOpen: () => {
window.nextPage = () => {
if (currentIndex < content.length - 1) {
showPaginatedModal(content, currentIndex + 1);
}
};
}
});
}

const earnBtnElement = document.getElementById('earnBtn');
if (earnBtnElement) {
earnBtnElement.onclick = () => {
showModal('EARN <span class="gold">$XHI</span>', `
<p>Choose how you want to earn <span class="gold">$XHI</span> rewards:</p>
<div style="display:flex; justify-content:center; gap:1rem; margin-top:1rem;">
<button class="large-btn" onclick="window.location.href='move.html'">MOVE</button>
<button class="large-btn" onclick="window.location.href='play.html'">PLAY</button>
</div>
`);
};
}

const leaderboardBtn = document.getElementById('leaderboardBtn');
if (leaderboardBtn) {
leaderboardBtn.onclick = () => {
// Check if user has seen Z Points overview before
const hasSeenZPointsOverview = localStorage.getItem('zwapZPointsOverviewSeen');
if (!hasSeenZPointsOverview) {
showZPointsOverview();
} else {
window.location.href = 'leaderboard.html';
}
};
}

function showZPointsOverview() {
const zPointsContent = [
{
title: 'INTRODUCING Z POINTS',
content: '<p style="text-align: center; color: #B8B8B8; font-size: 1.3rem; font-weight: bold; margin-bottom: 1.5rem;">Your Gateway to Premium ZWAP! Benefits</p><p><strong style="color: #B8B8B8;">🎯 What are Z Points?</strong><br/>Z Points are your achievement currency within the ZWAP! ecosystem. Unlike <span class="gold">$XHI</span> tokens, Z Points represent your engagement level and unlock exclusive platform privileges.</p>'
},
{
title: 'PREMIUM BENEFITS',
content: '<p><strong style="color: #B8B8B8;">💎 Premium Membership Benefits:</strong><br/>• Remove faucet cooldowns for instant gameplay<br/>• Increase credit-building multipliers (earn credit faster)<br/>• Early access to marketplace discounts and premium features<br/>• Priority customer support and exclusive content</p>'
},
{
title: 'EARNING Z POINTS',
content: '<p><strong style="color: #B8B8B8;">🔄 How to Earn Z Points:</strong><br/>• Daily login streaks (Day 1: +2, Day 2: +4, Day 5: +10)<br/>• Completing games and challenges<br/>• Referring active users to the platform<br/>• Maintaining consistent engagement across MOVE and PLAY</p>'
},
{
title: 'LEADERBOARD SYSTEM',
content: '<p><strong style="color: #B8B8B8;">🏆 Leaderboard Integration:</strong><br/>Track your Z Points ranking against other users, view your achievement progress, and compete for additional rewards through our comprehensive leaderboard system.</p>'
}
];

showZPointsPaginatedModal(zPointsContent, 0);
}

function showZPointsPaginatedModal(content, currentIndex) {
const current = content[currentIndex];
const isLast = currentIndex === content.length - 1;

Swal.fire({
title: current.title,
html: `
<div style="text-align: left; line-height: 1.8;">
${current.content}
</div>
<div style="text-align: center; margin-top: 2rem;">
${!isLast ? '<button class="large-btn" onclick="nextZPointsPage()">NEXT →</button>' : '<button class="large-btn" onclick="proceedToLeaderboard()">VIEW LEADERBOARD</button>'}
</div>
`,
background: 'transparent',
color: '#fff',
showCloseButton: true,
showConfirmButton: false,
customClass: { 
popup: 'swal2-popup',
title: 'swal2-title',
htmlContainer: 'swal2-html-container',
closeButton: 'swal2-close'
},
backdrop: true,
allowOutsideClick: true,
allowEscapeKey: true,
showClass: {
popup: 'swal2-show'
},
didOpen: () => {
window.nextZPointsPage = () => {
if (currentIndex < content.length - 1) {
showZPointsPaginatedModal(content, currentIndex + 1);
}
};
window.proceedToLeaderboard = () => {
localStorage.setItem('zwapZPointsOverviewSeen', 'true');
Swal.close();
window.location.href = 'leaderboard.html';
};
}
});
}



const contactBtn = document.getElementById('contactBtn');
if (contactBtn) {
contactBtn.onclick = () => {
showModal('ENTERPRISE RELATIONS', `
<div style="text-align: left;">
<p style="margin-bottom: 1.5rem; text-align: center; color: #CCCCCC;">
Connect with our executive team for strategic partnerships, institutional inquiries, and enterprise-level integration opportunities.
</p>

<form style="margin-bottom: 2rem;">
<input type="email" placeholder="Corporate Email Address" style="width:100%;padding:0.8rem;margin-bottom:1rem;border-radius:8px;">
<textarea placeholder="Describe your enterprise requirements and partnership objectives..." rows="4" style="width:100%;padding:0.8rem;margin-bottom:1rem;border-radius:8px;resize:vertical;"></textarea>
<button type="submit" style="width:100%;padding:0.8rem;background:#00BFFF;color:white;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">SUBMIT INQUIRY</button>
</form>

<div style="text-align: center;">
<p style="margin-bottom: 1rem; color: #CCCCCC; font-weight: bold;">Professional Network Channels:</p>
<div style="display: flex; justify-content: center; gap: 2rem; align-items: center;">
<a href="https://x.com/xoclonholdings" target="_blank" style="color:#00BFFF; text-decoration:none; font-weight:bold;">
🔗 Corporate Updates
</a>
<a href="https://github.com/xoclonholdings" target="_blank" style="color:#00BFFF; text-decoration:none; font-weight:bold;">
💻 Technical Repository
</a>
<a href="https://t.me/xhi_coin" target="_blank" style="color:#00BFFF; text-decoration:none; font-weight:bold;">
📱 Executive Communications
</a>
</div>
</div>
</div>
`);
};
}

// Track which buttons have shown info
const buttonStates = {};

// Action button descriptions
const actionInfo = {
  moveBtn: {
    title: 'MOVE TO EARN',
    content: `
    <div style="text-align: left; line-height: 1.6;">
    <p><strong>Transform your daily movement into <span class="gold">$XHI</span> rewards!</strong></p>

    <p><strong>🚶‍♀️ Walk-to-Earn:</strong><br/>
    Connect your fitness tracker or use your phone's built-in step counter to earn rewards for every step you take. Whether you're walking to work, hiking trails, or just moving around your home - every step counts!</p>

    <p><strong>💃 Dance-to-Earn:</strong><br/>
    Join our dance challenges and earn <span class="gold">$XHI</span> by showcasing your moves! From structured routines to freestyle sessions, get your groove on and get rewarded.</p>

    <p><strong>🏃‍♂️ Fitness Activities:</strong><br/>
    Running, cycling, yoga, swimming - track any fitness activity and earn proportional rewards based on duration and intensity.</p>

    <p style="color: #FFD700; font-weight: bold; text-align: center; margin-top: 1rem;">
    Start moving today and watch your <span class="gold">$XHI</span> balance grow!
    </p>
    </div>
    `
  },
  playBtn: {
    title: 'PLAY TO EARN',
    content: `
    <div style="text-align: left; line-height: 1.6;">
    <p><strong>Dive into our gaming ecosystem and earn <span class="gold">$XHI</span> while having fun!</strong></p>

    <p><strong>🎮 Available Games:</strong></p>
    <ul style="margin-left: 1rem;">
    <li><strong>Cube:</strong> Test your spatial reasoning with our 3D puzzle cube game</li>
    <li><strong>Trivia:</strong> Challenge your knowledge across various topics</li>
    <li><strong>Build:</strong> Create and construct in our virtual building environment</li>
    <li><strong>Spin:</strong> Try your luck with our reward wheel</li>
    </ul>

    <p><strong>💰 Earning Mechanics:</strong><br/>
    Each game offers daily earning opportunities with skill-based and luck-based rewards. Complete challenges, achieve high scores, and participate in tournaments to maximize your <span class="gold">$XHI</span> earnings.</p>

    <p><strong>🎯 Fair Play:</strong><br/>
    All games use blockchain verification to ensure fair play and transparent reward distribution.</p>

    <p style="color: #FFD700; font-weight: bold; text-align: center; margin-top: 1rem;">
    Connect your wallet and start earning up to 0.015 <span class="gold">$XHI</span> per game session!
    </p>
    </div>
    `
  },
  swapBtn: {
    title: 'DECENTRALIZED SWAP',
    content: `
    <div style="text-align: left; line-height: 1.6;">
    <p><strong>Exchange your <span class="gold">$XHI</span> tokens with our secure, decentralized swap platform!</strong></p>

    <p><strong>🔄 Supported Trading Pairs:</strong><br/>
    Swap <span class="gold">$XHI</span> with POL, BTC, ETH, USDT, and SOL. Real-time pricing ensures you always get fair market rates for these premium cryptocurrency pairs.</p>

    <p><strong>⚡ Lightning Fast:</strong><br/>
    Our optimized smart contracts provide near-instant swaps with minimal gas fees. No lengthy waiting periods or complex procedures.</p>

    <p><strong>🔐 Secure & Trustless:</strong><br/>
    Built on proven blockchain technology with audited smart contracts. Your funds never leave your control during the swap process.</p>

    <p><strong>📊 Advanced Features:</strong><br/>
    • Real-time price charts and market data<br/>
    • Slippage protection and MEV resistance<br/>
    • Limit orders and price alerts<br/>
    • Liquidity mining opportunities</p>

    <div style="text-align: right; margin-top: 2rem;">
    <button onclick="window.location.href='Swap.html'" style="background: linear-gradient(145deg, #00BFFF, #0099CC); border: none; color: white; padding: 0.8rem 1.5rem; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 1rem;">
    SWAP →
    </button>
    </div>
    </div>
    `
  },
  shopBtn: {
    title: 'EXCLUSIVE MARKETPLACE',
    content: `
    <div style="text-align: left; line-height: 1.6;">
    <p><strong>Spend your <span class="gold">$XHI</span> tokens in our exclusive marketplace!</strong></p>

    <p><strong>🛍️ Coming Soon:</strong><br/>
    Our marketplace will feature exclusive items, NFTs, and digital goods available only to <span class="gold">$XHI</span> holders.</p>

    <p><strong>🎨 Planned Categories:</strong></p>
    <ul style="margin-left: 1rem;">
    <li><strong>Digital Art & NFTs:</strong> Exclusive artwork and collectibles</li>
    <li><strong>Gaming Assets:</strong> Special items, skins, and power-ups</li>
    <li><strong>Wellness Products:</strong> Fitness gear, supplements, and health tools</li>
    <li><strong>Virtual Real Estate:</strong> Digital land and metaverse properties</li>
    <li><strong>Creator Tools:</strong> Software, templates, and creative resources</li>
    </ul>

    <p><strong>💎 Member Benefits:</strong><br/>
    <span class="gold">$XHI</span> holders will receive exclusive discounts, early access to limited editions, and special member-only items.</p>

    <p><strong>🤝 Creator Economy:</strong><br/>
    Artists and creators can list their work and earn <span class="gold">$XHI</span> through sales, with low platform fees supporting the creative community.</p>

    <p style="color: #FFD700; font-weight: bold; text-align: center; margin-top: 1rem;">
    Start earning <span class="gold">$XHI</span> now to be ready for marketplace launch!
    </p>
    </div>
    `
  }
};

// Handle action button clicks
document.querySelectorAll('.action-btn').forEach(btn => {
  // Skip EARN button as it has its own dedicated handler
  if (btn.id === 'earnBtn') return;

  btn.onclick = (e) => {
    e.preventDefault();
    const btnId = btn.id;
    const page = btn.dataset.page;

    if (!buttonStates[btnId]) {
      // First tap - show info
      buttonStates[btnId] = true;
      btn.classList.add('info-shown');

      const info = actionInfo[btnId];
      showModal(info.title, info.content);

      // Reset state after 5 seconds
      setTimeout(() => {
        buttonStates[btnId] = false;
        btn.classList.remove('info-shown');
      }, 5000);

    } else {
      // Second tap - navigate to page
      if (btnId === 'shopBtn') {
        shopComingSoon();
      } else if (page && page !== '#') {
        window.location.href = page;
      }
    }
  };
});

window.shopComingSoon = function() {
Swal.fire({
title: 'COMING SOON',
text: 'Shop marketplace coming soon for $XHI holders!',
background: '#111',
color: '#fff',
showCloseButton: true,
showConfirmButton: false,
});
}

const miniPopups = {
swapCol: 'Swap your <span class="gold">$XHI</span> for other assets easily.',
moveCol: 'Move includes Walk-for-<span class="gold">$XHI</span> and Dance-for-<span class="gold">$XHI</span> opportunities.',
playCol: 'Play faucet games to earn daily <span class="gold">$XHI</span> rewards.',
shopCol: 'Shop marketplace coming soon for <span class="gold">$XHI</span> holders.'
};

Object.keys(miniPopups).forEach(id => {
const el = document.getElementById(id);
if (el) {
el.onclick = () => {
showModal(id.replace('Col','').toUpperCase(), `<p>${miniPopups[id]}</p>`);
};
}
});
});