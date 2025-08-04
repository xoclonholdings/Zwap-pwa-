# Quick Start - Add Cube Game to ZWAP App

## Option 1: Copy Source Files (Recommended)
1. Copy the entire `client/src/` folder to your ZWAP app
2. Copy the `client/public/` folder contents to your ZWAP app's public folder
3. Install these dependencies in your ZWAP app:
```bash
npm install @react-three/fiber @react-three/drei three zustand
```

## Option 2: Use as Component
Create this component in your ZWAP app:

**CubeGameEmbed.tsx**
```typescript
import React, { useEffect, useState } from 'react';

interface CubeGameEmbedProps {
  wallet?: {
    address: string;
    balance: number;
    isPremium: boolean;
    walletType: string;
  };
}

const CubeGameEmbed: React.FC<CubeGameEmbedProps> = ({ wallet }) => {
  const [gameReady, setGameReady] = useState(false);

  useEffect(() => {
    // Initialize game when wallet changes
    if (gameReady && wallet) {
      // @ts-ignore
      window.ZwapCubeGame?.initializeWallet(wallet);
    } else if (gameReady && !wallet) {
      // @ts-ignore
      window.ZwapCubeGame?.disconnectWallet();
    }
  }, [wallet, gameReady]);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <iframe
        src="/cube-game/index.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          background: 'black'
        }}
        onLoad={() => {
          setGameReady(true);
          // Give iframe time to load
          setTimeout(() => {
            if (wallet) {
              // @ts-ignore
              window.ZwapCubeGame?.initializeWallet(wallet);
            }
          }, 1000);
        }}
      />
    </div>
  );
};

export default CubeGameEmbed;
```

## Usage in Your ZWAP App
```typescript
import CubeGameEmbed from './components/CubeGameEmbed';

const CubeGamePage = () => {
  const { wallet, isConnected } = useWallet(); // Your wallet hook

  return (
    <CubeGameEmbed 
      wallet={isConnected ? {
        address: wallet.address,
        balance: wallet.xhiBalance,
        isPremium: wallet.isPremium,
        walletType: wallet.type
      } : undefined}
    />
  );
};
```

## The Game Will:
- Show "WALLET REQUIRED" when no wallet provided
- Activate all controls when wallet is connected
- Display user's address and balance
- Apply premium multipliers automatically
- Handle disconnection gracefully

## Need Help?
The game is self-contained and works immediately. Just provide wallet data and it handles everything else!