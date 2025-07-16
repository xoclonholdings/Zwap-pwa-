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
showModal('ABOUT US', '<p>ZWAP! is your ecosystem for wellness, creativity, and gaming.<br/><a href="#" style="color:#FFD700;">Download Whitepaper 📄</a></p>');
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
showModal('CONTACT US', `
<form>
<input type="email" placeholder="Your Email" style="width:100%;padding:0.5rem;margin-bottom:0.5rem;">
<textarea placeholder="Message" style="width:100%;padding:0.5rem;margin-bottom:0.5rem;"></textarea>
</form>
<p>
<a href="https://x.com/xoclonholdings" target="_blank" style="color:#00BFFF;margin-right:10px;">X</a>
<a href="https://github.com/xoclonholdings" target="_blank" style="color:#00BFFF;margin-right:10px;">GitHub</a>
<a href="https://t.me/xhi_coin" target="_blank" style="color:#00BFFF;">Telegram</a>
</p>
`);
};
}

// Track which buttons have shown info
const buttonStates = {};

// Action button descriptions
const actionInfo = {
  moveBtn: {
    title: 'MOVE TO EARN',
    content: 'Walk or dance to earn <span class="gold">$XHI</span> rewards through movement-based activities.'
  },
  playBtn: {
    title: 'PLAY TO EARN',
    content: 'Play faucet games to earn daily <span class="gold">$XHI</span> rewards. Choose from Cube, Trivia, Build, and Spin games.'
  },
  swapBtn: {
    title: 'SWAP TOKENS',
    content: 'Instantly exchange <span class="gold">$XHI</span> for other assets in our decentralized swap platform.'
  },
  shopBtn: {
    title: 'SHOP MARKETPLACE',
    content: 'Shop marketplace coming soon for <span class="gold">$XHI</span> holders. Buy exclusive items and NFTs.'
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
      showModal(info.title, `<p>${info.content}</p><p style="margin-top:1rem; color:#FFD700; font-size:0.9rem;">Tap ${btn.textContent} again to continue</p>`);

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