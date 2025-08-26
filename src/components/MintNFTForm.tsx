import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/contexts/Web3Context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';

export const MintNFTForm: React.FC = () => {
  const { t } = useTranslation();
  const { executeGaslessMint } = useWeb3();
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsMinting(true);
    setMintStatus(t('mint.preparing'));
    
    const formData = new FormData(event.target as HTMLFormElement);
    const nftData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: formData.get('price') as string,
      file: formData.get('file') as File,
    };

    try {
      setMintStatus(t('mint.uploading'));
      await new Promise(resolve => setTimeout(resolve, 1500));
      const metadataUri = `ipfs://bafybeicw2bivsbvt43lq23n2n2j3g2pzg2j3g2pzg2j3g2pzg/${nftData.file.name}`;
      
      setMintStatus(t('mint.sending'));
      const result = await executeGaslessMint(metadataUri);
      
      if (result?.success) {
        setMintStatus(`${t('mint.success')} ${result.hash.substring(0, 20)}...`);
      } else {
        setMintStatus(t('mint.failed'));
      }
      
      setTimeout(() => {
        setIsMinting(false);
        setMintStatus('');
      }, 5000);
      
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Mint error:', error);
      setMintStatus(t('mint.failed'));
      setTimeout(() => {
        setIsMinting(false);
        setMintStatus('');
      }, 3000);
    }
  };

  return (
    <Card className="sticky top-24 border-toda-blue/20">
      <CardHeader>
        <CardTitle className="text-toda-blue">{t('mint.title')}</CardTitle>
        <CardDescription>{t('mint.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">{t('mint.assetName')}</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder={t('mint.assetNamePlaceholder')} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t('mint.assetDescription')}</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder={t('mint.assetDescriptionPlaceholder')} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">{t('mint.price')}</Label>
            <Input 
              id="price" 
              name="price" 
              type="number" 
              step="0.01" 
              placeholder={t('mint.pricePlaceholder')} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">{t('mint.file')}</Label>
            <Input 
              id="file" 
              name="file" 
              type="file" 
              required 
              className="pt-2"
              accept=".zip,.rar,.7z,.dwg,.rvt,.skp,.pdf,.ppt,.pptx,.gh"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-toda-red hover:bg-toda-red/90" 
            disabled={isMinting} 
            size="lg"
          >
            {isMinting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                {t('mint.minting')}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" /> 
                {t('mint.mintButton')}
              </>
            )}
          </Button>
          {mintStatus && (
            <p className="text-sm text-center text-slate-600 mt-2 animate-in fade-in-0">
              {mintStatus}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};