/**
 * ZWAP! Main Application Script
 * ©️ 2025 XOCLON HOLDINGS INC.™ - All Rights Reserved
 * 
 * Unauthorized copying, reproduction, or distribution is strictly prohibited.
 */
document.addEventListener("DOMContentLoaded", () => {
// Make bang icon navigate to home page
const bang = document.getElementById('bang');
if (bang) {
bang.onclick = () => {
window.location.href = 'index.html';
};
}

// Connect wallet functionality
const connectBtn = document.getElementById('connectBtn');
if (connectBtn) {
connectBtn.onclick = () => {
showWalletModal();
};
}

// Home button functionality
const homeBtn = document.getElementById('homeBtn');
if (homeBtn) {
homeBtn.onclick = () => {
window.location.href = 'index.html';
};
}

// Learn button functionality
const learnBtn = document.getElementById('learnBtn');
if (learnBtn) {
learnBtn.onclick = () => {
showZPointsOverview();
};
}

// Earn button functionality
const earnBtn = document.getElementById('earnBtn');
if (earnBtn) {
earnBtn.onclick = () => {
window.location.href = 'move.html';
};
}

// Leaderboard button functionality
const leaderboardBtn = document.getElementById('leaderboardBtn');
if (leaderboardBtn) {
leaderboardBtn.onclick = () => {
window.location.href = 'leaderboard.html';
};
}

// Contact button functionality
const contactBtn = document.getElementById('contactBtn');
if (contactBtn) {
contactBtn.onclick = () => {
showContactModal();
};
}

// Initialize balances
updateBalances();
});

// Wallet connection system
let walletConnected = false;
let userAddress = '';

function showWalletModal() {
Swal.fire({
title: 'CONNECT WALLET',
html: `
<div style="display: flex; flex-direction: column; gap: 1rem;">
<button class="wallet-option large-btn" onclick="connectMetaMask()">
🦊 MetaMask
</button>
<button class="wallet-option large-btn" onclick="connectWalletConnect()">
🔗 WalletConnect
</button>
<button class="wallet-option large-btn" onclick="connectCoinbase()">
💰 Coinbase Wallet
</button>
<button class="wallet-option large-btn" onclick="connectTrust()">
🛡️ Trust Wallet
</button>
</div>
`,
background: '#111',
color: '#fff',
showCloseButton: true,
showConfirmButton: false,
customClass: {
popup: 'swal2-popup'
}
});
}

async function connectMetaMask() {
try {
if (typeof window.ethereum !== 'undefined') {
const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
if (accounts.length > 0) {
userAddress = accounts[0];
walletConnected = true;
updateWalletUI();
Swal.close();
showConnectionSuccess('MetaMask');
} else {
throw new Error('No accounts found');
}
} else {
throw new Error('MetaMask not installed');
}
} catch (error) {
console.error('MetaMask connection failed:', error);
Swal.fire({
title: 'CONNECTION FAILED',
text: 'MetaMask not found. Please install MetaMask browser extension.',
background: '#111',
color: '#fff',
icon: 'error'
});
}
}

async function connectWalletConnect() {
try {
// Simulate WalletConnect
await new Promise(resolve => setTimeout(resolve, 2000));
userAddress = '0x742d35Cc6634C0532925a3b8D1de65c07c1e4BA2';
walletConnected = true;
updateWalletUI();
Swal.close();
showConnectionSuccess('WalletConnect');
} catch (error) {
console.error('WalletConnect failed:', error);
}
}

async function connectCoinbase() {
try {
// Simulate Coinbase connection
await new Promise(resolve => setTimeout(resolve, 1500));
userAddress = '0x8ba1f109551bD432803012645Hac136c42c1e4BA2';
walletConnected = true;
updateWalletUI();
Swal.close();
showConnectionSuccess('Coinbase Wallet');
} catch (error) {
console.error('Coinbase connection failed:', error);
}
}

async function connectTrust() {
try {
// Simulate Trust Wallet connection
await new Promise(resolve => setTimeout(resolve, 1500));
userAddress = '0x9cb2f209651cD532925a4c8E2de75c08c2e5fBB3';
walletConnected = true;
updateWalletUI();
Swal.close();
showConnectionSuccess('Trust Wallet');
} catch (error) {
console.error('Trust Wallet connection failed:', error);
}
}

function updateWalletUI() {
const connectBtn = document.getElementById('connectBtn');
if (connectBtn && walletConnected) {
connectBtn.textContent = `${userAddress.substring(0, 6)}...${userAddress.substring(38)}`;
connectBtn.classList.add('connected');
connectBtn.onclick = () => showWalletInfo();
}
updateBalances();
}

function showConnectionSuccess(walletName) {
Swal.fire({
title: 'WALLET CONNECTED!',
html: `
<div style="text-align: center;">
<p style="color: #00FF00; font-weight: bold;">✅ Successfully connected to ${walletName}</p>
<p>Address: ${userAddress.substring(0, 6)}...${userAddress.substring(38)}</p>
<p style="color: #FFD700;">Welcome to ZWAP!</p>
</div>
`,
background: '#111',
color: '#fff',
timer: 3000,
showConfirmButton: false
});
}

function showWalletInfo() {
Swal.fire({
title: 'WALLET INFO',
html: `
<div style="text-align: left;">
<p><strong>Address:</strong><br/><span style="font-family: monospace;">${userAddress}</span></p>
<p><strong>XHI Balance:</strong> ${(Math.random() * 100).toFixed(4)} XHI</p>
<p><strong>Z Points:</strong> ${Math.floor(Math.random() * 1000)} ZPTS</p>
<button class="large-btn" onclick="disconnectWallet()" style="margin-top: 1rem; background: #FF4444;">
DISCONNECT WALLET
</button>
</div>
`,
background: '#111',
color: '#fff',
showCloseButton: true,
showConfirmButton: false
});
}

function disconnectWallet() {
walletConnected = false;
userAddress = '';
const connectBtn = document.getElementById('connectBtn');
if (connectBtn) {
connectBtn.textContent = 'CONNECT WALLET';
connectBtn.classList.remove('connected');
connectBtn.onclick = () => showWalletModal();
}
updateBalances();
Swal.close();
Swal.fire({
title: 'WALLET DISCONNECTED',
text: 'Your wallet has been disconnected successfully.',
background: '#111',
color: '#fff',
timer: 2000,
showConfirmButton: false
});
}

// Balance management
function updateBalances() {
const xhiBalance = document.getElementById('xhiBalance');
const zBalance = document.getElementById('zBalance');

if (walletConnected) {
const savedBalance = parseFloat(localStorage.getItem('zwapXhiBalance') || '0');
const savedZPoints = parseInt(localStorage.getItem('zwapZPoints') || '0');

if (xhiBalance) xhiBalance.textContent = savedBalance.toFixed(4);
if (zBalance) zBalance.textContent = savedZPoints.toString();
} else {
if (xhiBalance) xhiBalance.textContent = '0.00';
if (zBalance) zBalance.textContent = '0';
}
}

// Z Points system
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
localStorage.setItem('zwapShowLeaderboard', 'true');
window.location.href = 'leaderboard.html';
};
}
});
}

// Contact modal
function showContactModal() {
Swal.fire({
title: 'CONTACT SUPPORT',
html: `
<div style="text-align: left;">
<p><strong>📧 Email Support:</strong><br/>
<a href="mailto:support@xoclon.online" style="color: #00BFFF;">support@xoclon.online</a></p>

<p><strong>🌐 Website:</strong><br/>
<a href="https://xoclon.online" target="_blank" style="color: #00BFFF;">xoclon.online</a></p>

<p><strong>📱 Social Media:</strong><br/>
Follow us for updates and announcements</p>

<p><strong>🎮 Discord Community:</strong><br/>
Join our gaming community for tips and support</p>

<p><strong>⏰ Support Hours:</strong><br/>
Monday - Friday: 9 AM - 6 PM EST<br/>
Response time: Within 24 hours</p>
</div>
`,
background: '#111',
color: '#fff',
showCloseButton: true,
showConfirmButton: false,
customClass: {
popup: 'swal2-popup'
}
});
}

// Game functionality
function comingSoon() {
Swal.fire({
title: 'COMING SOON!',
text: 'This game is currently in development. Stay tuned for updates!',
background: '#111',
color: '#fff',
timer: 3000,
showConfirmButton: false
});
}

// Friends functionality for play.html
function inviteFriends() {
Swal.fire({
title: 'INVITE FRIENDS',
html: `
<div style="text-align: left;">
<p>Share your referral link with friends to earn bonus rewards!</p>
<div style="background: #000; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
<input type="text" value="https://zwap.app/play?ref=ABC123" 
style="width: 100%; background: transparent; border: none; color: #00BFFF; font-family: monospace;" readonly>
</div>
<button class="large-btn" onclick="copyReferralLink()">COPY LINK</button>
</div>
`,
background: '#111',
color: '#fff',
showCloseButton: true,
showConfirmButton: false
});
}

function createChallenge() {
Swal.fire({
title: 'CREATE CHALLENGE',
html: `
<div style="text-align: left;">
<p>Create a custom challenge for your friends!</p>
<div style="margin: 1rem 0;">
<label style="color: #00BFFF;">Challenge Type:</label>
<select style="width: 100%; padding: 0.5rem; background: #000; color: #fff; border: 1px solid #00BFFF; border-radius: 5px; margin-top: 0.5rem;">
<option>High Score Competition</option>
<option>Speed Run Challenge</option>
<option>Daily Streak Battle</option>
</select>
</div>
<button class="large-btn" onclick="launchChallenge()">CREATE CHALLENGE</button>
</div>
`,
background: '#111',
color: '#fff',
showCloseButton: true,
showConfirmButton: false
});
}

function joinChallenge() {
Swal.fire({
title: 'JOIN CHALLENGE',
html: `
<div style="text-align: left;">
<p>Enter a challenge code to join:</p>
<input type="text" placeholder="Enter challenge code..." 
style="width: 100%; padding: 0.8rem; background: #000; color: #fff; border: 1px solid #00BFFF; border-radius: 5px; margin: 1rem 0;">
<button class="large-btn" onclick="joinChallengeWithCode()">JOIN CHALLENGE</button>
</div>
`,
background: '#111',
color: '#fff',
showCloseButton: true,
showConfirmButton: false
});
}

function copyReferralLink() {
navigator.clipboard.writeText('https://zwap.app/play?ref=ABC123');
Swal.fire({
title: 'COPIED!',
text: 'Referral link copied to clipboard',
background: '#111',
color: '#fff',
timer: 2000,
showConfirmButton: false
});
}

function launchChallenge() {
Swal.fire({
title: 'CHALLENGE CREATED!',
text: 'Your challenge has been created. Share the code: ZWAP2025',
background: '#111',
color: '#fff',
timer: 3000,
showConfirmButton: false
});
}

function joinChallengeWithCode() {
Swal.fire({
title: 'CHALLENGE JOINED!',
text: 'You have successfully joined the challenge!',
background: '#111',
color: '#fff',
timer: 3000,
showConfirmButton: false
});
}

// Referral System
class ReferralSystem {
constructor() {
this.referralData = JSON.parse(localStorage.getItem('zwapReferralData') || '{}');
this.userStats = JSON.parse(localStorage.getItem('zwapUserStats') || '{}');
this.initializeReferralTracking();
}

initializeReferralTracking() {
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

saveReferralData() {
localStorage.setItem('zwapReferralData', JSON.stringify(this.referralData));
}
}

// Daily Streak System
class DailyStreakSystem {
constructor() {
this.streakData = JSON.parse(localStorage.getItem('zwapStreakData') || '{}');
this.checkDailyLogin();
}

checkDailyLogin() {
const today = new Date().toDateString();
const lastLogin = this.streakData.lastLogin;

if (lastLogin !== today) {
this.handleDailyLogin(today);
}
}

handleDailyLogin(today) {
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayString = yesterday.toDateString();

if (this.streakData.lastLogin === yesterdayString) {
this.streakData.currentStreak = (this.streakData.currentStreak || 0) + 1;
} else {
this.streakData.currentStreak = 1;
}

this.streakData.lastLogin = today;
this.streakData.totalDaysActive = (this.streakData.totalDaysActive || 0) + 1;

const zPointsEarned = this.calculateStreakBonus();
this.awardZPoints(zPointsEarned);

localStorage.setItem('zwapStreakData', JSON.stringify(this.streakData));
}

calculateStreakBonus() {
const streak = this.streakData.currentStreak;
if (streak >= 7) return 20;
if (streak >= 5) return 10;
if (streak >= 3) return 6;
if (streak >= 2) return 4;
return 2;
}

awardZPoints(amount) {
const currentZPoints = parseInt(localStorage.getItem('zwapZPoints') || '0');
localStorage.setItem('zwapZPoints', (currentZPoints + amount).toString());
updateBalances();
}
}

// Initialize systems
const referralSystem = new ReferralSystem();
const dailyStreakSystem = new DailyStreakSystem();

// Global error handler
window.addEventListener('error', function(e) {
console.error('JavaScript Error:', e.error);
});

// Export for other modules
window.zwapWallet = {
connected: () => walletConnected,
address: () => userAddress,
connect: showWalletModal,
disconnect: disconnectWallet
};

// Learn button functionality
const learnBtnElement = document.getElementById('learnBtn');
if (learnBtnElement) {
learnBtnElement.onclick = () => {
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

const leaderboardBtnElement = document.getElementById('leaderboardBtn');
if (leaderboardBtnElement) {
leaderboardBtnElement.onclick = () => {
// Check if user has seen Z Points overview before
const hasSeenZPointsOverview = localStorage.getItem('zwapZPointsOverviewSeen');
if (!hasSeenZPointsOverview) {
showZPointsOverview();
} else {
window.location.href = 'leaderboard.html';
}
};
}

const contactBtnElement = document.getElementById('contactBtn');
if (contactBtnElement) {
contactBtnElement.onclick = () => {
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