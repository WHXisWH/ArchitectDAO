import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NFTAsset } from '@/types';
import { MOCK_NFTS } from '@/data/mockNFTs';
import { NFTCard } from './NFTCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const Marketplace: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [nfts] = useState<NFTAsset[]>(MOCK_NFTS);

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    
    return matchesSearch && nft.fileType.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  const uniqueFileTypes = Array.from(
    new Set(nfts.flatMap(nft => nft.fileType.split(', ')))
  ).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800 border-b-2 border-toda-blue pb-2">
          {t('marketplace.title')}
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search NFTs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('all')}
              size="sm"
            >
              All
            </Button>
            {uniqueFileTypes.slice(0, 4).map((type) => (
              <Button
                key={type}
                variant={selectedFilter === type ? 'default' : 'outline'}
                onClick={() => setSelectedFilter(type)}
                size="sm"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {filteredNFTs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">
            No NFTs found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNFTs.map(nft => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      )}
    </div>
  );
};