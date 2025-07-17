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
connectBtn.style.background = 'linear-gradient(145deg, #00ff00, #00cc00)';
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
}

// Initialize balances
updateBalances();

const learnBtn = document.getElementById('learnBtn');
if (learnBtn) {
learnBtn.onclick = () => {
showModal('ENTERPRISE ECOSYSTEM OVERVIEW', `
<div style="text-align: left; line-height: 1.8;">
<p><strong>ZWAP!</strong> represents the next generation of decentralized reward infrastructure, seamlessly integrating wellness optimization, creative expression, and gamified earning mechanisms.</p>

<p><strong>🎯 Strategic Vision:</strong><br/>
We are pioneering a paradigm shift in incentive-based lifestyle optimization. Our platform leverages advanced blockchain architecture to transform everyday wellness activities into quantifiable value creation opportunities.</p>

<p><strong>💰 Revenue Generation Streams:</strong><br/>
• Kinetic Energy Monetization (Movement-to-Earn Protocol)<br/>
• Gamified Cognitive Engagement Rewards<br/>
• Creative Content Monetization Framework<br/>
• Credit Optimization Incentive Programs<br/>
• Exclusive Marketplace Access Rights</p>

<p><strong>🔗 Distributed Ledger Technology:</strong><br/>
Our enterprise-grade blockchain infrastructure ensures complete transparency, immutable transaction records, and decentralized governance. Smart contract automation guarantees fair and immediate reward distribution across all ecosystem participants.</p>

<p><strong>📊 Platform Analytics:</strong><br/>
Real-time performance metrics, advanced earning optimization algorithms, and institutional-grade security protocols position ZWAP! as the premier choice for forward-thinking individuals seeking to maximize their lifestyle ROI.</p>

<p style="text-align: center; margin-top: 1.5rem;">
<a href="#" style="color:#FFD700; font-weight: bold;">📄 Access Technical Documentation</a>
</p>
</div>
`);
};
}

const earnBtn = document.getElementById('earnBtn');
if (earnBtn) {
earnBtn.onclick = () => {
showModal('EARN <span class="gold">$XHI</span>', `
<p>Choose how you want to earn <span class="gold">$XHI</span> rewards:</p>
<div style="display:flex; justify-content:center; gap:1rem; margin-top:1rem;">
<button class="large-btn" onclick="window.location.href='move.html'">MOVE</button>
<button class="large-btn" onclick="window.location.href='play.html'">PLAY</button>
</div>
`);
};
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