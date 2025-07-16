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
title: `<span style="font-family:'Orbitron'">${title}</span>`,
html: htmlContent,
background: '#111',
color: '#fff',
showCloseButton: true,
showConfirmButton: false,
customClass: { popup: 'swal2-popup' }
});
}

const connectBtn = document.getElementById('connectBtn');
if (connectBtn) {
connectBtn.onclick = async () => {
try {
// Basic wallet connect simulation
if (typeof window.ethereum !== 'undefined') {
try {
const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
showModal('WALLET CONNECTED', `<p>Connected to wallet: ${accounts[0].substring(0,6)}...${accounts[0].substring(38)}</p>`);
} catch (error) {
console.error('Wallet connection error:', error);
if (error.code === 4001) {
showModal('WALLET CONNECTION', '<p>Connection rejected by user.</p>');
} else {
showModal('WALLET CONNECTION', '<p>Failed to connect wallet. Please try again.</p>');
}
}
} else {
showModal('WALLET CONNECTION', '<p>Please install MetaMask or another Web3 wallet to connect.</p>');
}
} catch (error) {
console.error('Unexpected error:', error);
showModal('ERROR', '<p>An unexpected error occurred. Please refresh and try again.</p>');
}
};
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
<a href="#" style="color:#00BFFF;margin-right:10px;">X</a>
<a href="#" style="color:#00BFFF;margin-right:10px;">GitHub</a>
<a href="#" style="color:#00BFFF;">Telegram</a>
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