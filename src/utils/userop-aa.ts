import { ethers } from 'ethers';
import { Client, Presets } from 'userop';
import { NERO_CONTRACTS, NERO_URLS } from './nerochain';

export interface AAConfig {
  entryPoint: string;
  simpleAccountFactory: string;
  bundlerUrl: string;
  paymasterUrl: string;
}

export class NeroAAService {
  private config: AAConfig;
  private provider: ethers.providers.Provider;
  
  constructor(provider: ethers.providers.Provider) {
    this.provider = provider;
    this.config = {
      entryPoint: NERO_CONTRACTS.ENTRY_POINT,
      simpleAccountFactory: NERO_CONTRACTS.SIMPLE_ACCOUNT_FACTORY,
      bundlerUrl: NERO_URLS.BUNDLER,
      paymasterUrl: NERO_URLS.PAYMASTER,
    };
    console.log('NeroAAService initialized with config:', this.config);
  }

  async createAAClient(signerOrProvider: ethers.Signer) {
    try {
      console.log('Creating AA client with Nero Chain configuration...');
      
      // Create Client first
      const client = await Client.init(this.config.bundlerUrl, {
        entryPoint: this.config.entryPoint,
      });

      // Create paymaster middleware using Nero paymaster
      const paymasterMiddleware = Presets.Middleware.neroPaymaster(
        this.config.paymasterUrl && import.meta.env.VITE_PAYMASTER_API_KEY ? {
          rpc: this.config.paymasterUrl,
          apikey: import.meta.env.VITE_PAYMASTER_API_KEY,
          type: "0" // Free gas sponsorship type
        } : undefined
      );

      console.log('Paymaster middleware configured:', {
        hasPaymaster: !!paymasterMiddleware,
        paymasterUrl: this.config.paymasterUrl,
        hasApiKey: !!import.meta.env.VITE_PAYMASTER_API_KEY
      });

      // Create SimpleAccount with paymaster middleware
      const simpleAccount = await Presets.Builder.SimpleAccount.init(
        signerOrProvider,
        this.config.bundlerUrl,
        {
          entryPoint: this.config.entryPoint,
          factory: this.config.simpleAccountFactory,
          paymasterMiddleware: paymasterMiddleware,
        }
      );

      console.log('AA client created successfully');
      return { simpleAccount, client };
    } catch (error) {
      console.error('Failed to create AA client:', error);
      throw error;
    }
  }

  async getAccountAddress(owner: string): Promise<string> {
    try {
      // Calculate the counterfactual address
      const initCode = ethers.utils.hexConcat([
        this.config.simpleAccountFactory,
        '0x5fbfb9cf', // createAccount selector
        ethers.utils.defaultAbiCoder.encode(['address', 'uint256'], [owner, 0])
      ]);

      // Get the address using eth_call simulation
      const result = await this.provider.call({
        to: this.config.entryPoint,
        data: ethers.utils.hexConcat([
          '0x5fbfb9cf', // getSenderAddress selector
          initCode.slice(2)
        ])
      });

      return ethers.utils.getAddress('0x' + result.slice(-40));
    } catch (error) {
      console.error('Failed to get account address:', error);
      // Fallback: generate deterministic address
      return ethers.utils.getAddress(
        ethers.utils.keccak256(
          ethers.utils.defaultAbiCoder.encode(
            ['address', 'address', 'uint256'],
            [this.config.simpleAccountFactory, owner, 0]
          )
        ).slice(0, 42)
      );
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