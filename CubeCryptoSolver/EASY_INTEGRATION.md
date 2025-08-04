# Super Simple ZWAP Integration (5 Minutes)

## What You'll Do
Copy 2 files to your ZWAP app and you're done!

## Step 1: Copy the Game Files
Copy these files from this cube game project to your ZWAP app:

```
FROM this cube game project:
- client/src/App.tsx
- client/src/ (entire folder)
- client/public/ (entire folder)
- All CSS and component files

TO your ZWAP app:
- src/components/CubeGame/ (create this folder)
```

## Step 2: Create a Simple Page
Create this file in your ZWAP app:

**src/pages/CubeGamePage.tsx**
```typescript
import React from 'react';
import CubeGame from '../components/CubeGame/App'; // Point to copied App.tsx

const CubeGamePage = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      background: 'black' 
    }}>
      <CubeGame />
    </div>
  );
};

export default CubeGamePage;
```

## Step 3: Add Route
Add this to your ZWAP app's router:
```typescript
import CubeGamePage from './pages/CubeGamePage';

// Add this route:
<Route path="/cube-game" element={<CubeGamePage />} />
```

## Step 4: Connect Your Wallet
In your ZWAP app, when the user connects their wallet, call:
```typescript
// When wallet connects:
if (window.ZwapCubeGame) {
  window.ZwapCubeGame.initializeWallet({
    address: "0x742d35Cc6634C0532925a3b8D1de65c07c1e4BA2",
    balance: 1.2345,
    isPremium: false,
    walletType: "metamask"
  });
}
```

## That's It!
- Game works immediately
- Shows "WALLET REQUIRED" until you connect
- Becomes fully functional after wallet connection
- No build process needed - just copy files!

## Test It
1. Go to `/cube-game` in your ZWAP app
2. Game should load (disabled state)
3. Connect wallet in your ZWAP app
4. Game becomes active

## Files You Need to Copy
```
client/src/App.tsx                    -> src/components/CubeGame/App.tsx
client/src/components/                -> src/components/CubeGame/components/
client/src/lib/                       -> src/components/CubeGame/lib/
client/src/styles/                    -> src/components/CubeGame/styles/
client/src/hooks/                     -> src/components/CubeGame/hooks/
client/src/pages/                     -> src/components/CubeGame/pages/
client/public/                        -> public/
```

No npm build, no complex setup - just copy and use!