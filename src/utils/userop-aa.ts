import { ethers } from 'ethers';
import { Client, Presets } from 'userop';
import { NERO_CONTRACTS, NERO_URLS, neroChain } from './nerochain';

export interface AAConfig {
  rpcUrl: string;
  entryPoint: string;
  simpleAccountFactory: string;
  bundlerUrl: string;
  paymasterUrl: string;
}

export class NeroAAService {
  private config: AAConfig;
  
  constructor() {
    this.config = {
      rpcUrl: neroChain.rpcUrls.default.http[0],
      entryPoint: NERO_CONTRACTS.ENTRY_POINT,
      simpleAccountFactory: NERO_CONTRACTS.SIMPLE_ACCOUNT_FACTORY,
      bundlerUrl: NERO_URLS.BUNDLER,
      paymasterUrl: NERO_URLS.PAYMASTER,
    };
  }

  async createAAClient(signerOrProvider: ethers.Signer) {
    try {
      const client = await Client.init(this.config.rpcUrl, {
        overrideBundlerRpc: this.config.bundlerUrl,
        entryPoint: this.config.entryPoint,
      });

      const paymasterMiddleware = Presets.Middleware.neroPaymaster(
        this.config.paymasterUrl && import.meta.env.VITE_PAYMASTER_API_KEY ? {
          rpc: this.config.paymasterUrl,
          apikey: import.meta.env.VITE_PAYMASTER_API_KEY,
          type: "0"
        } : undefined
      );

      const simpleAccount = await Presets.Builder.SimpleAccount.init(
        signerOrProvider,
        this.config.rpcUrl,
        {
          overrideBundlerRpc: this.config.bundlerUrl,
          entryPoint: this.config.entryPoint,
          factory: this.config.simpleAccountFactory,
          paymasterMiddleware: paymasterMiddleware,
        }
      );

      return { simpleAccount, client };
    } catch (error) {
      console.error('Failed to create AA client:', error);
      throw error;
    }
  }

  

  async mintNFTWithAA(
    simpleAccount: any,
    client: any,
    to: string,
    tokenUri: string,
    royaltyPercentage: number = 500
  ): Promise<string> {
    try {
      console.log('Building UserOperation for NFT mint with AA...');
      console.log('Target NFT contract:', NERO_CONTRACTS.NFT_CONTRACT);
      console.log('Minting to:', to);
      console.log('Token URI:', tokenUri);
      console.log('Royalty percentage:', royaltyPercentage);

      // Encode mint function call with royalty
      const nftInterface = new ethers.utils.Interface([
        'function mint(address to, string memory _tokenURI, uint256 royaltyPercentage) public returns (uint256)',
      ]);
      
      const callData = nftInterface.encodeFunctionData('mint', [to, tokenUri, royaltyPercentage]);

      // Build UserOperation using the SimpleAccount
      const builder = simpleAccount.execute(NERO_CONTRACTS.NFT_CONTRACT, 0, callData);

      console.log('Sending UserOperation to bundler...');
      
      // Send UserOperation (paymaster middleware is already configured)
      const response = await client.sendUserOperation(builder);
      
      console.log('UserOperation sent, hash:', response.userOpHash);
      console.log('Waiting for transaction receipt...');
      
      // Wait for transaction
      const receipt = await response.wait();
      
      console.log('✅ NFT minted successfully with AA!', {
        transactionHash: receipt.transactionHash,
        userOpHash: response.userOpHash
      });
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('❌ Failed to mint NFT with AA:', error);
      throw error;
    }
  }


  async estimateUserOpGas(userOp: any): Promise<any> {
    try {
      const response = await fetch(this.config.bundlerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_estimateUserOperationGas',
          params: [userOp, this.config.entryPoint],
          id: 1,
        }),
      });
      
      const result = await response.json();
      return result.result;
    } catch (error) {
      console.error('Gas estimation error:', error);
      return {
        callGasLimit: '0x5208',
        verificationGasLimit: '0x15F90',
        preVerificationGas: '0x5208',
      };
    }
  }
}