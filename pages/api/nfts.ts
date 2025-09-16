import type { NextApiRequest, NextApiResponse } from 'next';

// 模拟真实NFT数据 - 实际应用中应该从区块链或数据库获取
const mockNFTData = [
  {
    tokenId: "1",
    name: "Modern Office Complex - Phase 1", 
    description: "革新的なオフィス複合施設の3Dモデル。サステナブルデザインと最新のスマートビルディング技術を融合させた次世代建築です。エネルギー効率を最大化し、働く人々の快適性を追求した設計となっています。",
    creator: "戸田建設株式会社",
    contractAddress: "0x742d35Cc60C2f2f13C4D7c20c2C2b5B5E3F6C8A1",
    ipfsCID: "QmYwAPJzv5CZsnA1bFKRqLdB1NpbCiDHjx5HLJ9MvMhQfM",
    glbFile: "building-model.glb",
    imageUrl: "https://ipfs.io/ipfs/QmYwAPJzv5CZsnA1bFKRqLdB1NpbCiDHjx5HLJ9MvMhQfM/preview.jpg",
    attributes: [
      { trait_type: "Type", value: "Office Complex" },
      { trait_type: "Style", value: "Modern" },
      { trait_type: "Floors", value: "15" },
      { trait_type: "Area", value: "25000 sqm" },
      { trait_type: "Certification", value: "LEED Gold" },
      { trait_type: "Smart Features", value: "IoT Enabled" },
      { trait_type: "Year", value: "2024" },
      { trait_type: "Location", value: "Tokyo" }
    ],
    blockchain: "Nero Chain",
    network: "mainnet",
    price: "0",
    giftType: "free",
    royalty: "5%",
    status: "active",
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z"
  },
  {
    tokenId: "2", 
    name: "Sustainable Residential Tower",
    description: "環境に配慮した高層住宅タワーの設計。再生可能エネルギーシステムと緑化屋上を特徴とする未来志向の住宅建築です。",
    creator: "戸田建設株式会社",
    contractAddress: "0x742d35Cc60C2f2f13C4D7c20c2C2b5B5E3F6C8A1",
    ipfsCID: "QmXpL8j9kFd2N7vHfVtQ5mKpGrE8WxCzRsAe4ThYqUi6bN",
    glbFile: "residential-tower.glb",
    attributes: [
      { trait_type: "Type", value: "Residential" },
      { trait_type: "Style", value: "Sustainable" },
      { trait_type: "Floors", value: "25" },
      { trait_type: "Units", value: "180" },
      { trait_type: "Certification", value: "LEED Platinum" },
      { trait_type: "Energy", value: "Net Zero" }
    ],
    blockchain: "Nero Chain",
    network: "mainnet", 
    price: "0.5",
    giftType: "paid",
    royalty: "7.5%",
    status: "active",
    createdAt: "2024-01-20T14:15:00.000Z",
    updatedAt: "2024-01-20T14:15:00.000Z"
  },
  {
    tokenId: "3",
    name: "Smart Factory Design",
    description: "Industry 4.0対応のスマートファクトリー設計。AIとIoTを活用した次世代製造施設の建築モデルです。",
    creator: "戸田建設株式会社",
    contractAddress: "0x742d35Cc60C2f2f13C4D7c20c2C2b5B5E3F6C8A1",
    ipfsCID: "QmRtY7uP3cVbNmLkTsE9qWzHdKjFx8GnAo5IpVs2BfMxQw",
    glbFile: "smart-factory.glb",
    attributes: [
      { trait_type: "Type", value: "Industrial" },
      { trait_type: "Style", value: "Smart Factory" },
      { trait_type: "Area", value: "15000 sqm" },
      { trait_type: "Technology", value: "Industry 4.0" },
      { trait_type: "Automation", value: "Full" },
      { trait_type: "Efficiency", value: "95%" }
    ],
    blockchain: "Nero Chain",
    network: "mainnet",
    price: "1.2", 
    giftType: "paid",
    royalty: "10%",
    status: "active",
    createdAt: "2024-01-25T09:45:00.000Z",
    updatedAt: "2024-01-25T09:45:00.000Z"
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      // 实际应用中，这里应该从区块链或数据库获取真实数据
      // const nfts = await fetchNFTsFromBlockchain();
      
      res.status(200).json({
        success: true,
        data: mockNFTData,
        count: mockNFTData.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch NFTs',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed`
    });
  }
}