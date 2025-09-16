interface NFTData {
  tokenId: string;
  name: string;
  description: string;
  creator: string;
  contractAddress: string;
  ipfsCID: string;
  blockchain: string;
  attributes: Array<{ trait_type: string; value: string }>;
  previewModel?: {
    fileName: string;
    fileType: string;
    url: string;
  };
  giftType: 'free' | 'paid';
  price: string;
  timestamp: number;
}

// Mock database query - should be fetched from a database in a real application
const getMockNFTs = (): NFTData[] => {
  return [
    {
      tokenId: "1",
      name: "Smart Logistics Warehouse BIM Model - Toda Digital Gift",
      description: "A complete BIM model of a modern smart logistics warehouse, including detailed designs for automated storage systems, intelligent shelving layouts, and advanced temperature control systems.",
      creator: "Toda Corporation",
      contractAddress: "0x742d35Cc60C2f2f13C4D7c20c2C2b5B5E3F6C8A1",
      ipfsCID: "QmWarehouseBIMModel123456789",
      blockchain: "Nero Chain",
      attributes: [
        { trait_type: "Building Type", value: "Logistics Warehouse" },
        { trait_type: "Area", value: "15000 sqm" },
        { trait_type: "Height", value: "12m" },
        { trait_type: "Smart Systems", value: "Automated Storage" },
        { trait_type: "Provider", value: "Toda Corporation" },
        { trait_type: "Rights", value: "Commercial Use" },
        { trait_type: "Source", value: "ArchitectDAO Platform" }
      ],
      previewModel: {
        fileName: "warehouse_model.glb",
        fileType: "model/gltf-binary",
        url: "/models/warehouse_preview.glb"
      },
      giftType: "free",
      price: "0",
      timestamp: Date.now() - 86400000 // 1 day ago
    },
    {
      tokenId: "2", 
      name: "Green Data Center BIM Model - Toda Digital Gift",
      description: "A modern data center BIM model based on sustainable design principles, integrating green technologies like high-efficiency cooling systems, solar power generation, and rainwater harvesting.",
      creator: "Toda Corporation",
      contractAddress: "0x742d35Cc60C2f2f13C4D7c20c2C2b5B5E3F6C8A1",
      ipfsCID: "QmDataCenterBIMModel987654321",
      blockchain: "Nero Chain", 
      attributes: [
        { trait_type: "Building Type", value: "Data Center" },
        { trait_type: "Area", value: "8000 sqm" },
        { trait_type: "Energy Rating", value: "LEED Platinum" },
        { trait_type: "PUE Rating", value: "1.2" },
        { trait_type: "Green Features", value: "Solar + Cooling Optimization" },
        { trait_type: "Provider", value: "Toda Corporation" },
        { trait_type: "Rights", value: "Commercial Use" },
        { trait_type: "Source", value: "ArchitectDAO Platform" }
      ],
      previewModel: {
        fileName: "datacenter_model.glb", 
        fileType: "model/gltf-binary",
        url: "/models/datacenter_preview.glb"
      },
      giftType: "free",
      price: "0", 
      timestamp: Date.now() - 43200000 // 12 hours ago
    }
  ];
};

export const fetchNFTs = (tokenId?: string, limit: number = 10) => {
    const nfts = getMockNFTs();
    let filteredNFTs = nfts;

    if (tokenId) {
        filteredNFTs = nfts.filter(nft => nft.tokenId === tokenId);
    }

    if (limit && limit > 0) {
        filteredNFTs = filteredNFTs.slice(0, limit);
    }

    return {
        success: true,
        data: filteredNFTs,
        total: nfts.length,
        timestamp: new Date().toISOString()
    };
}