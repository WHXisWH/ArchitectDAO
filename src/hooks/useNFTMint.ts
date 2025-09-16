import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/contexts/Web3Context';
import { uploadNFTToIPFS } from '@/utils/ipfs';

interface MintFormData {
  name: string;
  description: string;
  price: string;
  file: File | null;           // Main file (uploaded to IPFS)
  previewFile: File | null;    // 3D preview file (stored locally)
}

export const useNFTMint = () => {
  const { t } = useTranslation();
  const { executeGaslessMint } = useWeb3();

  const [isMinting, setIsMinting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const mintNFT = async (formData: MintFormData) => {
    if (!formData.file) return;

    setIsMinting(true);
    setError('');
    setStatus(t('mint.preparing'));

    try {
      setStatus(t('mint.uploading'));
      
      // Handle preview file if it exists
      let previewModelUrl = null;
      if (formData.previewFile) {
        // Create a temporary URL for 3D preview
        previewModelUrl = URL.createObjectURL(formData.previewFile);
        console.log('Preview file created:', previewModelUrl);
      }
      
      const { metadataHash } = await uploadNFTToIPFS(
        formData.file,
        formData.name,
        formData.description,
        'ArchitectDAO User', // Placeholder
        [
          { trait_type: 'Price', value: `${formData.price} NERO` },
          { trait_type: 'Category', value: 'Architecture' },
          ...(formData.previewFile ? [
            { trait_type: 'Has 3D Preview', value: 'Yes' },
            { trait_type: 'Preview File Type', value: formData.previewFile.type }
          ] : [])
        ],
        previewModelUrl // Pass the preview model URL
      );

      setStatus(t('mint.sending'));
      const result = await executeGaslessMint(metadataHash);

      if (result?.success) {
        setStatus(`${t('mint.success')} Token ID: ${result.tokenId || 'N/A'}`);
        
        // TODO: Save preview file info to a database or local storage.
        // For now, storing in localStorage as a demo.
        if (previewModelUrl && result.tokenId) {
          const previewData = {
            tokenId: result.tokenId,
            previewUrl: previewModelUrl,
            fileName: formData.previewFile?.name,
            fileType: formData.previewFile?.type
          };
          localStorage.setItem(`nft_preview_${result.tokenId}`, JSON.stringify(previewData));
        }
      } else {
        throw new Error(t('mint.failed'));
      }
    } catch (err: any) {
      console.error('Mint error:', err);
      const errorMessage = err.message || t('mint.failed');
      setError(`${t('mint.failed')}: ${errorMessage}`);
      setStatus('');
    } finally {
      setIsMinting(false);
    }
  };

  const resetMintStatus = () => {
    setIsMinting(false);
    setStatus('');
    setError('');
  };

  return { isMinting, status, error, mintNFT, resetMintStatus };
};