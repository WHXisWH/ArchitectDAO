import { NFTAsset } from '@/types';

export const MOCK_NFTS: NFTAsset[] = [
  {
    id: 1,
    name: 'モダン邸宅の設計プラン',
    author: '0x1234...abcd',
    price: '1.5',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop',
    description: 'BIMモデルとPDF提案書を含む、モダンな二階建てヴィラの完全な設計案です。高級住宅のインスピレーションを求めるデベロッパーに最適です。',
    fileType: 'RVT, PDF',
    createdAt: '2025-01-15'
  },
  {
    id: 2,
    name: 'パラメトリック・ファサードのGrasshopperスクリプト',
    author: '0x5678...efgh',
    price: '0.5',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
    description: 'ダイナミックな波形パターンのファサードを生成するための効率的なGrasshopperスクリプト。詳細な使用説明書が付属しています。',
    fileType: 'GH, PDF',
    createdAt: '2025-01-10'
  },
  {
    id: 3,
    name: 'コミュニティセンターのコンセプトデザイン',
    author: '0x9abc...ijkl',
    price: '2.0',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=800&auto=format&fit=crop',
    description: 'SketchUpモデル、レンダリング画像、デザイン説明PPTを含む、コミュニティセンターの完全なコンセプトデザインです。',
    fileType: 'SKP, JPG, PPT',
    createdAt: '2025-01-08'
  },
  {
    id: 4,
    name: '都市公園のランドスケープ設計',
    author: '0xdef0...mnop',
    price: '1.2',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
    description: '持続可能性をテーマにした都市公園のランドスケープ設計一式。AutoCAD図面とコンセプト資料が含まれます。',
    fileType: 'DWG, PDF',
    createdAt: '2025-01-05'
  },
  {
    id: 5,
    name: 'Modern Office Complex Design',
    author: '0xabc1...def2',
    price: '3.5',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    description: 'A comprehensive design package for a modern office complex including BIM models, technical drawings, and sustainability analysis.',
    fileType: 'RVT, DWG, PDF',
    createdAt: '2025-01-12'
  },
  {
    id: 6,
    name: 'Parametric Bridge Structure',
    author: '0x2345...6789',
    price: '2.8',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=800&auto=format&fit=crop',
    description: 'Innovative parametric bridge design with structural analysis and Grasshopper definition files for customizable span lengths.',
    fileType: 'GH, SAP, PDF',
    createdAt: '2025-01-14'
  }
];