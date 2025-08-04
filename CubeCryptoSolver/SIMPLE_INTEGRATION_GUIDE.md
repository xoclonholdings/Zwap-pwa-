# Simple ZWAP Integration Guide

## What You Need
1. Your ZWAP app project folder
2. This cube game project
3. 5 minutes to copy files

## Step 1: Build the Cube Game
```bash
# In this cube game folder, run:
npm run build
```

## Step 2: Copy to Your ZWAP App
Copy the `dist` folder contents to your ZWAP app:
```
your-zwap-app/
  public/
    cube-game/          <- Copy everything from dist/ here
      index.html
      assets/
      ...
```

## Step 3: Add One File to Your ZWAP App
Create this file in your ZWAP app:

**src/pages/CubeGame.tsx**
```typescript
import React, { useEffect } from 'react';

const CubeGame = () => {
  const [walletConnected, setWalletConnected] = React.useState(false);
  
  // Replace this with your actual wallet data
  const mockWalletData = {
    address: "0x742d35Cc6634C0532925a3b8D1de65c07c1e4BA2",
    balance: 1.2345,
    isPremium: false,
    walletType: "metamask"
  };

  useEffect(() => {
    // Initialize cube game when iframe loads
    const iframe = document.getElementById('cube-game-iframe') as HTMLIFrameElement;
    
    iframe.onload = () => {
      setTimeout(() => {
        if (walletConnected) {
          // @ts-ignore
          iframe.contentWindow.ZwapCubeGame?.initializeWallet(mockWalletData);
        }
      }, 1000);
    };
  }, [walletConnected]);

  return (
    <div style={{ width: '100%', height: '100vh', background: 'black' }}>
      <div style={{ padding: '20px', background: '#111', color: 'white' }}>
        <button 
          onClick={() => setWalletConnected(!walletConnected)}
          style={{
            padding: '10px 20px',
            background: walletConnected ? '#ff0000' : '#00ff00',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {walletConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
        </button>
        <span style={{ marginLeft: '20px' }}>
          Status: {walletConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      
      <iframe
        id="cube-game-iframe"
        src="/cube-game/index.html"
        style={{
          width: '100%',
          height: 'calc(100% - 80px)',
          border: 'none'
        }}
        title="XHI Cube Game"
      />
    </div>
  );
};

export default CubeGame;
```

## Step 4: Add Route to Your ZWAP App
Add this route wherever you define routes:
```typescript
import CubeGame from './pages/CubeGame';

// Add this to your routes:
<Route path="/cube-game" component={CubeGame} />
```

## Step 5: Test It
1. Go to `http://localhost:3000/cube-game` in your ZWAP app
2. Click "Connect Wallet" button
3. The cube game should become active
4. Click "Disconnect Wallet" to test disabled state

## That's It!
- The cube game will show "WALLET REQUIRED" when disconnected
- When connected, all controls become active
- The mock wallet data can be replaced with your real wallet integration later

## Next Steps (Optional)
Once this works, you can:
1. Replace the mock wallet data with your real wallet
2. Style the container to match your app
3. Add navigation links to reach the cube game