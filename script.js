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
showModal('CONNECT WALLET', '<p>WalletConnect integration coming soon!</p>');
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
startBtn.onclick = () => {
showModal('CHOOSE AN ACTION', `
<ul style="list-style:none; padding:0; text-align:left; max-width:300px; margin:auto;">
<li><strong>SWAP</strong> — Instantly exchange <span class="gold">$XHI</span> for other assets</li>
<li><strong>MOVE</strong> — Walk or dance to earn rewards</li>
<li><a href="play.html" style="color:#FFD700; text-decoration:none;"><strong>PLAY</strong></a> — Faucet games, earn daily <span class="gold">$XHI</span></li>
<li><strong>SHOP</strong> — Marketplace coming soon for <span class="gold">$XHI</span> holders</li>
</ul>
`);
};
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
