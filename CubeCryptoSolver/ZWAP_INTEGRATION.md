# ZWAP Integration Guide

## Overview

The XHI Cube Game is designed to be integrated as a subpage within the ZWAP PWA ecosystem. This document outlines the integration requirements and API.

## Integration Architecture

### Parent App Requirements
- The cube game expects wallet connection to be handled by the parent ZWAP app
- Game functionality is completely disabled without wallet connection
- Parent app must inject wallet state using the provided API

### Integration API

The cube game exposes a global API via `window.ZwapCubeGame`:

```typescript
interface ZwapWalletData {
  address: string;
  balance: number;
  isPremium: boolean;
  walletType: string;
}

window.ZwapCubeGame = {
  initializeWallet: (walletData: ZwapWalletData) => void;
  disconnectWallet: () => void;
  getGameState: () => any;
};
```

## Implementation Steps

### 1. Initialize Wallet Connection

When the cube game page loads in the ZWAP app:

```javascript
// Check if user has connected wallet
if (userWallet.connected) {
  window.ZwapCubeGame.initializeWallet({
    address: userWallet.address,
    balance: userWallet.xhiBalance,
    isPremium: userWallet.isPremium,
    walletType: userWallet.type
  });
}
```

### 2. Handle Wallet Disconnection

When user disconnects wallet in parent app:

```javascript
// Disconnect wallet in cube game
window.ZwapCubeGame.disconnectWallet();
```

### 3. Monitor Game State

Parent app can monitor game state:

```javascript
const gameState = window.ZwapCubeGame.getGameState();
console.log("Game state:", gameState);
```

## Game Behavior

### Without Wallet Connection
- PLAY button shows "WALLET REQUIRED" and is disabled
- Joystick is disabled and shows grayed out state
- Clicking controls shows "Wallet not connected" message

### With Wallet Connection
- PLAY button shows "PLAY" and is enabled
- Joystick becomes active during gameplay
- All game functionality is available

## Error Handling

The game includes comprehensive error handling:
- Clear messaging when wallet connection is required
- Visual feedback for disabled states
- Console logging for debugging integration issues

## Testing

To test the integration:

1. Load the cube game page
2. Verify controls are disabled
3. Initialize wallet using the API
4. Verify controls become active
5. Test wallet disconnection

## File Structure

Key integration files:
- `client/src/lib/zwap-integration.ts` - Main integration API
- `client/src/lib/stores/useWallet.tsx` - Wallet state management
- `client/src/components/cube/GameUI.tsx` - UI components with wallet checks