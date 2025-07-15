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
connectBtn.onclick = () => {
// Basic wallet connect simulation
if (typeof window.ethereum !== 'undefined') {
window.ethereum.request({ method: 'eth_requestAccounts' })
.then(accounts => {
showModal('WALLET CONNECTED', `<p>Connected to wallet: ${accounts[0].substring(0,6)}...${accounts[0].substring(38)}</p>`);
})
.catch(error => {
console.log('Wallet connection error:', error);
showModal('WALLET CONNECTION', '<p>Please install MetaMask or another Web3 wallet to connect.</p>');
});
} else {
showModal('WALLET CONNECTION', '<p>Please install MetaMask or another Web3 wallet to connect.</p>');
}
};
}

const creditBtn = document.getElementById('creditBtn');
if (creditBtn) {
creditBtn.onclick = () => {
window.location.href = 'Credit.html';
};
}

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
<p>Play faucet games or move to earn <span class="gold">$XHI</span> rewards.</p>
<div style="display:flex; justify-content:center; gap:1rem; margin-top:1rem;">
<button class="large-btn">MOVE</button>
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

const startBtn = document.getElementById('startButton');
if (startBtn) {
startBtn.onclick = (e) => {
e.preventDefault();
console.log('Start button clicked'); // Debug log
showModal('CHOOSE AN ACTION', `
<div style="display:flex; flex-direction:column; gap:1rem; max-width:300px; margin:auto;">
<button class="large-btn" onclick="window.location.href='move.html'">MOVE</button>
<button class="large-btn" onclick="window.location.href='play.html'">PLAY</button>
<button class="large-btn" onclick="window.location.href='Swap.html'">SWAP</button>
<button class="large-btn" onclick="shopComingSoon()">SHOP</button>
</div>
`);
};
}

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
