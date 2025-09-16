// URL parameter processing utility - extended to support full external NFT data format
export interface ExternalNFTData {
  // Original NFT Information
  originalTokenId: string;
  originalContract: string;
  ipfsCID: string;
  
  // Display Information
  name: string;
  description: string;
  
  // Metadata
  category: string;
  creator: string;
  originalPlatform: string;
  blockchain: string;
  
  // Asset Information
  modelFile?: string;
  modelSize?: string;
  ipfsUrl?: string;
  
  // Rights Information
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  
  // Transaction Information
  giftType: 'free' | 'paid';
  price: string;
  
  // Timestamp and Transfer ID
  timestamp?: number;
  transferId?: string;
}

export interface URLParserResult {
  hasExternalNFT: boolean;
  action?: string;
  source?: string;
  nftData?: ExternalNFTData;
  error?: string;
}

// Parse NFT data from URL parameters - enhanced version
export function parseNFTDataFromURL(): URLParserResult {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    
    const action = urlParams.get('action');
    const source = urlParams.get('source');
    const dataParam = urlParams.get('data');

    // Check for required parameters
    if (!action || !source || !dataParam) {
      return { hasExternalNFT: false };
    }

    // Validate parameter values
    if (action !== 'mint' || source !== 'nfc-dx-platform') {
      return { hasExternalNFT: false };
    }

    // Parse JSON data
    let nftData: ExternalNFTData;
    try {
      const rawData = JSON.parse(decodeURIComponent(dataParam));
      console.log('Received NFT data from external platform:', rawData);
      
      // Transform data format, ensuring all required fields are present
      nftData = {
        originalTokenId: rawData.originalTokenId || '1',
        originalContract: rawData.originalContract || '',
        ipfsCID: rawData.ipfsCID || '',
        name: rawData.name || 'Untitled NFT',
        description: rawData.description || '',
        category: rawData.category || 'Architecture',
        creator: rawData.creator || 'Unknown Creator',
        originalPlatform: rawData.originalPlatform || source,
        blockchain: rawData.blockchain || 'Nero Chain',
        modelFile: rawData.modelFile,
        modelSize: rawData.modelSize,
        ipfsUrl: rawData.ipfsUrl,
        attributes: rawData.attributes || [],
        giftType: rawData.giftType || 'free',
        price: rawData.price || '0',
        timestamp: rawData.timestamp,
        transferId: rawData.transferId
      };
    } catch (parseError) {
      console.error('Failed to parse NFT data:', parseError);
      return {
        hasExternalNFT: false,
        error: 'Invalid NFT data format'
      };
    }

    // Validate key fields
    if (!nftData.originalContract || !nftData.ipfsCID) {
      return {
        hasExternalNFT: false,
        error: 'Missing required NFT data (contract address or IPFS CID)'
      };
    }

    return {
      hasExternalNFT: true,
      action,
      source,
      nftData
    };

  } catch (error) {
    console.error('URL parsing error:', error);
    return {
      hasExternalNFT: false,
      error: 'Failed to parse URL parameters'
    };
  }
}

// Clear parameters from the URL (to avoid reprocessing on refresh)
export function clearURLParams(): void {
  try {
    const url = new URL(window.location.href);
    
    // Remove NFT-related parameters
    url.searchParams.delete('action');
    url.searchParams.delete('source');
    url.searchParams.delete('data');

    // Update the URL without reloading the page
    window.history.replaceState({}, document.title, url.toString());
    
    console.log('URL parameters cleared successfully');
  } catch (error) {
    console.error('Failed to clear URL parameters:', error);
  }
}

// Check the source platform
export function checkSourcePlatform(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get('source');
  
  if (source === 'nfc-dx-platform') {
    return source;
  }
  
  return null;
}

// Get a safe summary of NFT data (for logging)
export function getNFTDataSummary(nftData: ExternalNFTData): string {
  return `NFT: ${nftData.name} | Token ID: ${nftData.originalTokenId} | Creator: ${nftData.creator} | Transfer ID: ${nftData.transferId || 'N/A'}`;
}

// Generate a test URL (for development)
export function generateTestURL(baseUrl: string = window.location.origin): string {
  const testData: ExternalNFTData = {
    originalTokenId: "1",
    originalContract: "0x742d35Cc60C2f2f13C4D7c20c2C2b5B5E3F6C8A1",
    ipfsCID: "QmYwAPJzv5CZsnA1bFKRqLdB1NpbCiDHjx5HLJ9MvMhQfM",
    name: "Test Modern Office Complex - Toda Digital Gift",
    description: "A 3D model for testing. This is sample data for testing the NFT receiving function in the development environment.",
    category: "Architecture",
    creator: "Toda Corporation",
    originalPlatform: "NFC-DX-Platform",
    blockchain: "Nero Chain",
    modelFile: "building-model.glb",
    modelSize: "1.2MB",
    ipfsUrl: "https://ipfs.io/ipfs/QmYwAPJzv5CZsnA1bFKRqLdB1NpbCiDHjx5HLJ9MvMhQfM",
    attributes: [
      { trait_type: "Provider", value: "Toda Corporation" },
      { trait_type: "Rights", value: "Commercial Use" },
      { trait_type: "Source", value: "NFC DX Platform" },
      { trait_type: "Type", value: "Test Data" }
    ],
    giftType: "free",
    price: "0",
    timestamp: Date.now(),
    transferId: `transfer_${Date.now()}_test12345`
  };

  const params = new URLSearchParams({
    action: 'mint',
    source: 'nfc-dx-platform',
    data: JSON.stringify(testData)
  });

  return `${baseUrl}?${params.toString()}`;
}