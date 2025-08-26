import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { Web3ContextType } from '@/types';
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
        if (!clientId) {
          console.error("VITE_WEB3AUTH_CLIENT_ID is not set. Web3Auth cannot be initialized.");
          setIsLoading(false);
          return;
        }

        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x" + neroChain.id.toString(16),
          rpcTarget: neroChain.rpcUrls.default.http[0],
          displayName: neroChain.name,
          blockExplorer: neroChain.blockExplorers?.default.url || "",
          ticker: neroChain.nativeCurrency.symbol,
          tickerName: neroChain.nativeCurrency.name,
        };

        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        });

        const web3authInstance = new Web3Auth({
          clientId: clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider,
          chainConfig: chainConfig,
          uiConfig: {
            appName: "ArchitectDAO",
            loginMethodsOrder: ["google", "email_passwordless"],
            mode: "dark",
          }
        });

        await web3authInstance.initModal({ modalConfig: {} });
        setWeb3auth(web3authInstance);

        if (web3authInstance.connected) {
          const ethersProvider = new ethers.providers.Web3Provider(web3authInstance.provider as IProvider);
          setProvider(ethersProvider);
          const signer = ethersProvider.getSigner();
          const address = await signer.getAddress();
          setUserAddress(address);
          
          const neroAA = new NeroAAService();
          const { simpleAccount } = await neroAA.createAAClient(signer);
          const safeAddr = await simpleAccount.getSender();

          setAAService(neroAA);
          setSafeAddress(safeAddr);
          
          const contractSvc = new ContractService(ethersProvider);
          setContractService(contractSvc);
        }
      } catch (error) {
        console.error("Web3Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initWeb3Auth();
  }, []);

  const login = useCallback(async () => {
    if (!web3auth) {
      console.error("Web3Auth not initialized yet.");
      return;
    }
    try {
      setIsLoggingIn(true);
      const web3authProvider = await web3auth.connect();
      if (web3authProvider) {
        const ethersProvider = new ethers.providers.Web3Provider(web3authProvider);
        const signer = ethersProvider.getSigner();
        const address = await signer.getAddress();
        
        setProvider(ethersProvider);
        setUserAddress(address);
        
        const neroAA = new NeroAAService();
        const { simpleAccount } = await neroAA.createAAClient(signer);
        const safeAddr = await simpleAccount.getSender();

        setAAService(neroAA);
        setSafeAddress(safeAddr);
        
        const contractSvc = new ContractService(ethersProvider);
        setContractService(contractSvc);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  }, [web3auth]);

  const logout = useCallback(async () => {
    if (!web3auth) {
      console.error("Web3Auth not initialized yet.");
      return;
    }
    
    try {
      await web3auth.logout();
      setProvider(null);
      setSafeAddress('');
      setUserAddress('');
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [web3auth]);

  const executeGaslessMint = useCallback(async (metadataUri: string) => {
    if (!provider || !safeAddress || !userAddress || !aaService || !contractService) {
      console.error("Required services not available. Please login first.");
      return null;
    }
    
    try {
      if (aaService) {
        try {
          const signer = provider.getSigner();
          const { simpleAccount, client } = await aaService.createAAClient(signer);
          
          const txHash = await aaService.mintNFTWithAA(
            simpleAccount,
            client,
            userAddress,
            metadataUri,
            500
          );
          
          return { 
            success: true, 
            hash: txHash,
            safeAddress: safeAddress,
            gasless: true
          };
        } catch (aaError) {
          console.error('AA mint failed, trying direct contract call...', aaError);
        }
      }
      
      const result = await contractService.mintNFT(userAddress, metadataUri, 500);
      if (result.success) {
        return {
          success: true,
          hash: result.hash,
          tokenId: result.tokenId,
          gasless: false
        };
      }
      
      throw new Error("All minting methods failed.");

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
