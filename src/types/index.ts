import { ethers } from 'ethers';
import { ContractService } from '@/utils/contracts';

export interface NFTAsset {
  id: string;
  name: string;
  description: string;
  creator: string;
  owner: string;
  price: string | number;
  image?: string;
  imageUrl?: string;
  fileType: string;
  createdAt?: string;
  tokenId?: string;
  contractAddress?: string;
  previewFileUrl?: string;
}

export interface User {
  address: string;
  safeAddress: string;
  email?: string;
  displayName?: string;
  avatar?: string;
  createdNFTs: NFTAsset[];
  ownedNFTs: NFTAsset[];
}

export interface Transaction {
  id: string;
  type: 'mint' | 'purchase' | 'sale';
  nftId: number;
  from: string;
  to: string;
  amount: string;
  timestamp: string;
  txHash: string;
}

export interface Web3ContextType {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  executeGaslessMint: (metadataUri: string) => Promise<{ success: boolean; hash: string; tokenId?: string } | null>;
  contractService: ContractService | null;
  provider: ethers.providers.Web3Provider | null;
  safeAddress: string;
  userAddress: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingIn: boolean;
}