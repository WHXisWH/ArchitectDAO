import axios from 'axios';

// Pinata IPFS service configuration
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

// Pinata endpoints
const PINATA_FILE_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const PINATA_JSON_URL = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  fileType?: string;
  fileSize?: number;
  creator?: string;
  previewModel?: string;
}

// Upload file to IPFS via Pinata
export const uploadFileToIPFS = async (file: File): Promise<string> => {
  if (!PINATA_JWT && (!PINATA_API_KEY || !PINATA_SECRET_KEY)) {
    throw new Error('Pinata API credentials not configured');
  }

  const formData = new FormData();
  formData.append('file', file);

  // Optional: Add metadata about the file
  const pinataMetadata = JSON.stringify({
    name: file.name,
    keyvalues: {
      fileType: file.type,
      fileSize: file.size.toString(),
      uploadDate: new Date().toISOString(),
    }
  });
  formData.append('pinataMetadata', pinataMetadata);

  // Optional: Pinata options
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  formData.append('pinataOptions', pinataOptions);

  try {
    const headers = PINATA_JWT 
      ? { 'Authorization': `Bearer ${PINATA_JWT}` }
      : {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        };

    const response = await axios.post(PINATA_FILE_URL, formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    if (response.data && response.data.IpfsHash) {
      return `ipfs://${response.data.IpfsHash}`;
    } else {
      throw new Error('Failed to get IPFS hash from Pinata');
    }
  } catch (error: any) {
    console.error('Error uploading file to IPFS:', error);
    if (error.response) {
      console.error('Pinata API Error:', error.response.data);
      throw new Error(`Pinata API Error: ${error.response.data.error || error.response.statusText}`);
    }
    throw new Error('Failed to upload file to IPFS');
  }
};

// Upload JSON metadata to IPFS
export const uploadMetadataToIPFS = async (metadata: NFTMetadata): Promise<string> => {
  if (!PINATA_JWT && (!PINATA_API_KEY || !PINATA_SECRET_KEY)) {
    throw new Error('Pinata API credentials not configured');
  }

  const pinataMetadata = {
    name: `${metadata.name} - NFT Metadata`,
    keyvalues: {
      nftName: metadata.name,
      creator: metadata.creator || 'Unknown',
      uploadDate: new Date().toISOString(),
    }
  };

  const pinataOptions = {
    cidVersion: 0,
  };

  try {
    const headers = PINATA_JWT 
      ? { 'Authorization': `Bearer ${PINATA_JWT}` }
      : {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        };

    const response = await axios.post(PINATA_JSON_URL, {
      pinataContent: metadata,
      pinataMetadata,
      pinataOptions,
    }, {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });

    if (response.data && response.data.IpfsHash) {
      return `ipfs://${response.data.IpfsHash}`;
    } else {
      throw new Error('Failed to get IPFS hash from Pinata');
    }
  } catch (error: any) {
    console.error('Error uploading metadata to IPFS:', error);
    if (error.response) {
      console.error('Pinata API Error:', error.response.data);
      throw new Error(`Pinata API Error: ${error.response.data.error || error.response.statusText}`);
    }
    throw new Error('Failed to upload metadata to IPFS');
  }
};

// Complete NFT upload process
export const uploadNFTToIPFS = async (
  file: File, 
  name: string, 
  description: string,
  creator?: string,
  attributes?: Array<{ trait_type: string; value: string | number }>,
  previewModelUrl?: string | null
): Promise<{ fileHash: string; metadataHash: string; metadata: NFTMetadata }> => {
  try {
    // Step 1: Upload the file
    console.log('Uploading file to IPFS...');
    const fileHash = await uploadFileToIPFS(file);
    
    // Step 2: Create metadata object
    const metadata: NFTMetadata = {
      name,
      description,
      image: fileHash,
      external_url: `https://gateway.pinata.cloud/ipfs/${fileHash.replace('ipfs://', '')}`,
      fileType: file.type || 'application/octet-stream',
      fileSize: file.size,
      creator,
      previewModel: previewModelUrl || undefined,  // Add the 3D preview model URL
      attributes: attributes || [
        { trait_type: 'File Type', value: file.type || 'Unknown' },
        { trait_type: 'File Size', value: `${(file.size / 1024 / 1024).toFixed(2)} MB` },
        { trait_type: 'Upload Date', value: new Date().toLocaleDateString() },
      ],
    };

    // Step 3: Upload metadata
    console.log('Uploading metadata to IPFS...');
    const metadataHash = await uploadMetadataToIPFS(metadata);

    return {
      fileHash,
      metadataHash,
      metadata,
    };
  } catch (error) {
    console.error('Error in complete NFT upload process:', error);
    throw error;
  }
};

// Helper function to get IPFS gateway URL
export const getIPFSGatewayURL = (ipfsHash: string): string => {
  const hash = ipfsHash.replace('ipfs://', '');
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};

// Test Pinata connection
export const testPinataConnection = async (): Promise<boolean> => {
  try {
    const headers = PINATA_JWT 
      ? { 'Authorization': `Bearer ${PINATA_JWT}` }
      : {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        };

    const response = await axios.get('https://api.pinata.cloud/data/testAuthentication', {
      headers,
    });

    return response.status === 200;
  } catch (error) {
    console.error('Pinata connection test failed:', error);
    return false;
  }
};