import { ethers } from 'ethers';

export interface UserOperation {
  sender: string;
  nonce: string;
  initCode: string;
  callData: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  paymasterAndData: string;
  signature: string;
}

export class PaymasterService {
  private paymasterUrl: string;
  private entryPointAddress: string;
  private apiKey: string;

  constructor(paymasterUrl?: string, entryPointAddress = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789') {
    this.paymasterUrl = paymasterUrl || import.meta.env.VITE_PAYMASTER_URL || 'https://paymaster-testnet.nerochain.io';
    this.entryPointAddress = entryPointAddress;
    this.apiKey = import.meta.env.VITE_PAYMASTER_API_KEY || '027c815400534721b151563a54354413';
  }

  async getPaymasterAndData(userOp: Partial<UserOperation>): Promise<string> {
    try {
      console.log('Requesting paymaster sponsorship from:', this.paymasterUrl);
      
      const response = await fetch(`${this.paymasterUrl}/api/v1/sponsorship`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          method: 'pm_sponsorUserOperation',
          params: [userOp, this.entryPointAddress],
        }),
      });

      if (!response.ok) {
        throw new Error(`Paymaster request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(`Paymaster error: ${result.error.message || result.error}`);
      }

      const paymasterAndData = result.result?.paymasterAndData || result.paymasterAndData || '0x';
      console.log('Paymaster sponsorship received:', paymasterAndData.substring(0, 20) + '...');
      
      return paymasterAndData;
    } catch (error) {
      console.error('Paymaster sponsorship failed:', error);
      
      // Fallback to demo mode
      console.log('Falling back to demo paymaster mode');
      const mockPaymaster = '0x1234567890123456789012345678901234567890';
      const mockValidUntil = Math.floor(Date.now() / 1000) + 3600;
      const mockValidAfter = Math.floor(Date.now() / 1000);
      
      const paymasterData = ethers.utils.defaultAbiCoder.encode(
        ['uint48', 'uint48'],
        [mockValidUntil, mockValidAfter]
      );
      
      const mockSignature = '0x' + '00'.repeat(64);
      return mockPaymaster + paymasterData.slice(2) + mockSignature.slice(2);
    }
  }

  async estimateUserOpGas(userOp: Partial<UserOperation>, _provider?: ethers.providers.Provider): Promise<{
    callGasLimit: string;
    verificationGasLimit: string;
    preVerificationGas: string;
  }> {
    try {
      const bundlerUrl = import.meta.env.VITE_BUNDLER_URL || 'https://bundler-testnet.nerochain.io';
      console.log('Estimating gas using bundler:', bundlerUrl);
      
      const response = await fetch(bundlerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_estimateUserOperationGas',
          params: [userOp, this.entryPointAddress],
          id: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`Bundler request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(`Gas estimation error: ${result.error.message || result.error}`);
      }

      const gasEstimates = result.result || {};
      console.log('Gas estimates received:', gasEstimates);
      
      return {
        callGasLimit: gasEstimates.callGasLimit || '0x5208',
        verificationGasLimit: gasEstimates.verificationGasLimit || '0x15F90',
        preVerificationGas: gasEstimates.preVerificationGas || '0x5208',
      };
    } catch (error) {
      console.error('Gas estimation failed:', error);
      console.log('Using fallback gas estimates');
      
      // Fallback estimates for Nero Chain
      return {
        callGasLimit: '0x7530',     // 30000 - higher for contract calls
        verificationGasLimit: '0x186A0', // 100000 - AA verification
        preVerificationGas: '0x5208',    // 21000 - pre-verification
      };
    }
  }

  async checkPaymasterStatus(): Promise<{ active: boolean; balance?: string; error?: string }> {
    try {
      const response = await fetch(`${this.paymasterUrl}/api/v1/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        return { active: false, error: `Status check failed: ${response.status}` };
      }

      const result = await response.json();
      
      return {
        active: result.active || false,
        balance: result.balance,
      };
    } catch (error) {
      console.error('Paymaster status check failed:', error);
      return { active: false, error: 'Connection failed' };
    }
  }
}