import React, { useState } from 'react';
import { Upload, Loader2, FileText, Pilcrow, CircleDollarSign, ArrowLeft, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNFTMint } from '@/hooks/useNFTMint';

interface MintFormData {
  name: string;
  description: string;
  price: string;
  file: File | null;           // Main file (uploaded to IPFS)
  previewFile: File | null;    // 3D preview file (stored locally)
}

export const MintNFTForm: React.FC = () => {
  const { t } = useTranslation();
  const { isMinting, status, error, mintNFT, resetMintStatus } = useNFTMint();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MintFormData>({
    name: '',
    description: '',
    price: '',
    file: null,
    previewFile: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const { name } = e.target;
      const file = e.target.files[0];
      
      if (name === 'file') {
        setFormData(prev => ({ ...prev, file }));
      } else if (name === 'previewFile') {
        setFormData(prev => ({ ...prev, previewFile: file }));
      }
    }
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleMint = () => {
    mintNFT(formData);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', file: null, previewFile: null });
    setCurrentStep(1);
    resetMintStatus();
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Upload formData={formData} onFileChange={handleFileChange} onNext={nextStep} />;
      case 2:
        return <Step2Details formData={formData} onInputChange={handleInputChange} onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <Step3Preview formData={formData} onBack={prevStep} onMint={handleMint} isMinting={isMinting} status={status} error={error} onReset={resetForm} />;
      default:
        return <div>Error: Unknown Step</div>;
    }
  };

  return (
    <Card className="sticky top-24 border-toda-blue/20 transition-all duration-500">
      <CardHeader>
        <CardTitle className="h4 text-toda-blue">{t('mint.title')}</CardTitle>
        <CardDescription>{t('mint.step', { current: currentStep, total: 3 })}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
};

const Step1Upload = ({ formData, onFileChange, onNext }: any) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6 animate-in fade-in-0">
      {/* Main file upload */}
      <div className="space-y-2">
        <Label className="text-base">📁 {t('mint.file')} {t('common.required')}</Label>
        
        <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-toda-blue transition-colors">
          <Input 
            id="file-upload" 
            name="file" 
            type="file" 
            required 
            onChange={onFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".zip,.rar,.7z,.dwg,.rvt,.skp,.pdf,.ppt,.pptx,.gh"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-8 w-8 text-slate-400" />
            <Label htmlFor="file-upload" className="text-primary font-semibold cursor-pointer">
              {t('mint.chooseFile')}
            </Label>
            <p className="caption text-slate-500">{t('mint.mainFileDescription')}</p>
          </div>
        </div>

        {formData.file && (
          <div className="p-2 bg-green-50 border border-green-200 rounded-md">
            <p className="caption text-green-700 truncate" title={formData.file.name}>
              <Check className="h-4 w-4 inline mr-2 text-green-600"/>
              {formData.file.name}
            </p>
          </div>
        )}
      </div>

      {/* 3D preview file upload (optional) */}
      <div className="space-y-2">
        <Label className="text-base">{t('mint.previewFileLabel')}</Label>
        
        <div className="relative border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-purple-300 transition-colors">
          <Input 
            id="preview-upload" 
            name="previewFile" 
            type="file" 
            onChange={onFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".glb,.gltf,.obj,.fbx"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <FileText className="h-6 w-6 text-slate-400" />
            <Label htmlFor="preview-upload" className="text-sm text-slate-600 cursor-pointer">
              {t('mint.previewFileDescription')}
            </Label>
            <p className="caption text-slate-400">{t('mint.previewFileFormats')}</p>
          </div>
        </div>

        {formData.previewFile && (
          <div className="p-2 bg-purple-50 border border-purple-200 rounded-md">
            <p className="caption text-purple-700 truncate" title={formData.previewFile.name}>
              <Check className="h-4 w-4 inline mr-2 text-purple-600"/>
              {t('mint.previewFileSelected', { fileName: formData.previewFile.name })}
            </p>
          </div>
        )}
      </div>

      <Button onClick={onNext} disabled={!formData.file} className="w-full" size="lg">
        {t('mint.next')} <ArrowLeft className="h-4 w-4 ml-2 transform rotate-180" />
      </Button>
    </div>
  );
};

const Step2Details = ({ formData, onInputChange, onNext, onBack }: any) => {
  const { t } = useTranslation();
  const isFormValid = formData.name && formData.description && formData.price;
  return (
    <div className="space-y-6 animate-in fade-in-0">
      <div className="space-y-2">
        <Label htmlFor="name">{t('mint.assetName')}</Label>
        <Input id="name" name="name" value={formData.name} onChange={onInputChange} placeholder={t('mint.assetNamePlaceholder')} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">{t('mint.assetDescription')}</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={onInputChange} placeholder={t('mint.assetDescriptionPlaceholder')} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">{t('mint.price')}</Label>
        <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={onInputChange} placeholder={t('mint.pricePlaceholder')} required />
      </div>
      <div className="flex justify-between space-x-4">
        <Button onClick={onBack} variant="outline" className="w-1/3"><ArrowLeft className="h-4 w-4 mr-2" /> {t('mint.back')}</Button>
        <Button onClick={onNext} disabled={!isFormValid} className="w-2/3">{t('mint.next')} <ArrowLeft className="h-4 w-4 ml-2 transform rotate-180" /></Button>
      </div>
    </div>
  );
};

const Step3Preview = ({ formData, onBack, onMint, isMinting, status, error, onReset }: any) => {
  const { t } = useTranslation();
  const hasSucceeded = status.includes(t('mint.success'));

  if (isMinting || status) {
    return (
      <div className="text-center space-y-4 py-8 animate-in fade-in-0">
        {isMinting && <Loader2 className="mx-auto h-12 w-12 animate-spin text-toda-blue" />}
        {!isMinting && hasSucceeded && <Check className="mx-auto h-12 w-12 text-green-500" />}
        {!isMinting && error && <X className="mx-auto h-12 w-12 text-red-500" />}
        <p className={`body-lg ${error ? 'text-red-500' : 'text-slate-600'}`}>{status || error}</p>
        {(!isMinting && (hasSucceeded || error)) && (
          <Button onClick={onReset} variant="outline">{t('mint.mintAnother')}</Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0">
      <h3 className="h4">{t('mint.preview')}</h3>
      <div className="border rounded-lg p-4 space-y-2 bg-toda-light-blue/20">
        <p><strong className="text-toda-blue/80"><FileText size={16} className="inline mr-2"/>{t('mint.assetName')}:</strong> {formData.name}</p>
        <p><strong className="text-toda-blue/80"><Pilcrow size={16} className="inline mr-2"/>{t('mint.assetDescription')}:</strong> {formData.description}</p>
        <p><strong className="text-toda-blue/80"><CircleDollarSign size={16} className="inline mr-2"/>{t('mint.price')}:</strong> {formData.price} NERO</p>
        <p><strong className="text-toda-blue/80"><Upload size={16} className="inline mr-2"/>{t('mint.file')}:</strong> {formData.file?.name}</p>
      </div>
      <div className="flex justify-between space-x-4">
        <Button onClick={onBack} variant="outline" className="w-1/3" disabled={isMinting}><ArrowLeft className="h-4 w-4 mr-2" /> {t('mint.back')}</Button>
        <Button onClick={onMint} className="w-2/3 bg-toda-red hover:bg-toda-red/90" disabled={isMinting}>{t('mint.mintButton')}</Button>
      </div>
    </div>
  );
};