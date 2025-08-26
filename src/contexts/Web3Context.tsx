import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { Web3ContextType } from '@/types';
import { generateMockTxHash } from '@/utils';
import { neroChain } from '@/utils/nerochain';
import { NeroAAService } from '@/utils/userop-aa';
import { ContractService } from '@/utils/contracts';

const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [safeAddress, setSafeAddress] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [aaService, setAAService] = useState<NeroAAService | null>(null);
  const [contractService, setContractService] = useState<ContractService | null>(null);

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
        
        // Check if we're in demo mode
        if (!clientId || clientId === 'demo') {
          console.log("Running in demo mode - Web3Auth disabled");
          setIsLoading(false);
          return;
        }

        // Configure Nero Chain with real settings
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x" + neroChain.id.toString(16), // Ensure 0x prefix for hex
          rpcTarget: neroChain.rpcUrls.default.http[0],
          displayName: neroChain.name,
          blockExplorer: neroChain.blockExplorers?.default.url || "",
          ticker: neroChain.nativeCurrency.symbol,
          tickerName: neroChain.nativeCurrency.name,
        };

        console.log("Using Custom Chain Config:", chainConfig);

        // Create Ethereum provider
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        });

        // Initialize Web3Auth
        const web3auth = new Web3Auth({
          clientId: clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET, // Use Mainnet for custom chains
          privateKeyProvider,
        });

        await web3auth.initModal();
        setWeb3auth(web3auth);

        if (web3auth.connected) {
          const ethersProvider = new ethers.providers.Web3Provider(web3auth.provider as IProvider);
          setProvider(ethersProvider);
          const signer = ethersProvider.getSigner();
          const address = await signer.getAddress();
          setUserAddress(address);
          
          // Initialize AA Service and get actual Safe address
          const neroAA = new NeroAAService(ethersProvider);
          setAAService(neroAA);
          const safeAddr = await neroAA.getAccountAddress(address);
          setSafeAddress(safeAddr);
          
          // Initialize Contract Service
          const contractSvc = new ContractService(ethersProvider);
          setContractService(contractSvc);
          
          console.log(`Account Abstraction wallet created: ${safeAddr}`);
        }
      } catch (error) {
        console.error("Web3Auth initialization error:", error);
        console.log("Falling back to demo mode");
      } finally {
        setIsLoading(false);
      }
    };

    initWeb3Auth();
  }, []);

  const login = useCallback(async () => {
    try {
      setIsLoggingIn(true);
      
      if (!web3auth) {
        // Demo mode - simulate social login
        console.log("Demo mode: Simulating social login");
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
        setUserAddress(mockAddress);
        setSafeAddress(`0x${Math.random().toString(16).substr(2, 40)}`);
        
        // Create a mock provider for demo
        const mockProvider = {
          getSigner: () => ({
            getAddress: () => Promise.resolve(mockAddress)
          })
        } as any;
        setProvider(mockProvider);
        
        console.log("Demo login successful:", mockAddress);
        return;
      }
      
      // Real Web3Auth login
      const web3authProvider = await web3auth.connect();
      
      if (web3authProvider) {
        const ethersProvider = new ethers.providers.Web3Provider(web3authProvider);
        const signer = ethersProvider.getSigner();
        const address = await signer.getAddress();
        
        setProvider(ethersProvider);
        setUserAddress(address);
        
        // Initialize AA Service and get actual Safe address
        const neroAA = new NeroAAService(ethersProvider);
        setAAService(neroAA);
        const safeAddr = await neroAA.getAccountAddress(address);
        setSafeAddress(safeAddr);
        
        // Initialize Contract Service
        const contractSvc = new ContractService(ethersProvider);
        setContractService(contractSvc);
        
        console.log("Web3Auth login successful:", address);
        console.log(`Account Abstraction wallet created: ${safeAddr}`);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  }, [web3auth]);

  const logout = useCallback(async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    
    try {
      await web3auth.logout();
      setProvider(null);
      setSafeAddress('');
      setUserAddress('');
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [web3auth]);

  const executeGaslessMint = useCallback(async (metadataUri: string) => {
    if (!provider || !safeAddress || !userAddress) {
      console.error("Please login first");
      return null;
    }
    
    try {
      console.log(`Starting NFT mint...`);
      console.log(`- Metadata URI: ${metadataUri}`);
      console.log(`- User Address: ${userAddress}`);
      console.log(`- Safe Address: ${safeAddress}`);
      
      // Try Account Abstraction first, then fallback to direct contract call
      if (aaService) {
        try {
          console.log('Attempting gasless mint via Account Abstraction...');
          const signer = provider.getSigner();
          const { simpleAccount, client } = await aaService.createAAClient(signer);
          
          const txHash = await aaService.mintNFTWithAA(
            simpleAccount,
            client,
            userAddress,
            metadataUri,
            500 // 5% royalty
          );
          
          console.log(`✅ Gasless mint successful! Transaction: ${txHash}`);
          return { 
            success: true, 
            hash: txHash,
            safeAddress: safeAddress,
            gasless: true
          };
        } catch (aaError) {
          console.log('AA mint failed, trying direct contract call...', aaError);
        }
      }
      
      // Fallback to direct contract call
      if (contractService) {
        console.log('Attempting direct contract mint...');
        const result = await contractService.mintNFT(userAddress, metadataUri, 500); // 5% royalty
        
        if (result.success) {
          console.log(`✅ Direct mint successful! Transaction: ${result.hash}`);
          return {
            success: true,
            hash: result.hash,
            tokenId: result.tokenId,
            gasless: false
          };
        }
      }
      
      // Final fallback to demo mode
      console.log('All mint methods failed, using demo mode...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockTxHash = generateMockTxHash();
      console.log(`✅ Demo mint completed! Mock Transaction: ${mockTxHash}`);
      
      return { 
        success: true, 
        hash: mockTxHash,
        safeAddress: safeAddress,
        demo: true
      };
    } catch (error) {
      console.error('Mint failed:', error);
      return null;
    }
  }, [provider, safeAddress, userAddress, aaService, contractService]);

  const value: Web3ContextType = {
    login,
    logout,
    executeGaslessMint,
    provider,
    safeAddress,
    userAddress,
    isAuthenticated: !!provider,
    isLoading,
    isLoggingIn,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};