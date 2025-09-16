import { ethers } from 'ethers';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { defineChain } from 'viem';

// Nero Chain definition
export const neroChain = defineChain({
  id: 689, // 0x2B1 in hex
  name: 'Nero Testnet',
  network: 'nero-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'NERO',
    symbol: 'NERO',
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_NERO_RPC_URL || 'https://rpc-testnet.nerochain.io'],
    },
    public: {
      http: [import.meta.env.VITE_NERO_RPC_URL || 'https://rpc-testnet.nerochain.io'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Nero Scan', 
      url: import.meta.env.VITE_NERO_EXPLORER_URL || 'https://testnet.neroscan.io' 
    },
  },
});

// Nero Chain contract addresses
export const NERO_CONTRACTS = {
  ENTRY_POINT: import.meta.env.VITE_ENTRY_POINT || '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
  SIMPLE_ACCOUNT_FACTORY: import.meta.env.VITE_SIMPLE_ACCOUNT_FACTORY || '0x9406Cc6185a346906296840746125a0E44976454',
  NFT_CONTRACT: import.meta.env.VITE_NFT_CONTRACT || '0x1234567890123456789012345678901234567890', // ArchitectDAO NFT contract
  MARKETPLACE_CONTRACT: import.meta.env.VITE_MARKETPLACE_CONTRACT || '0x0000000000000000000000000000000000000000', // ArchitectDAO Marketplace contract
};

// Nero Chain URLs
export const NERO_URLS = {
  BUNDLER: import.meta.env.VITE_BUNDLER_URL || 'https://bundler-testnet.nerochain.io',
  PAYMASTER: import.meta.env.VITE_PAYMASTER_URL || 'https://paymaster-testnet.nerochain.io',
};

export function createNeroProvider(): ethers.providers.JsonRpcProvider {
  return new ethers.providers.JsonRpcProvider(neroChain.rpcUrls.default.http[0]);
}

export function createNeroPublicClient() {
  return createPublicClient({
    chain: neroChain,
    transport: http(neroChain.rpcUrls.default.http[0]),
  });
}

export function createNeroWalletClient(provider: any) {
  return createWalletClient({
    chain: neroChain,
    transport: custom(provider),
  });
}