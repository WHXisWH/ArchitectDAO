import React, { useRef, useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface ModelViewerProps {
  modelUrl?: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackMessage?: string;
}

export const ModelViewer: React.FC<ModelViewerProps> = ({
  modelUrl,
  className = '',
  width = 300,
  height = 200,
  fallbackMessage,
}) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  const finalFallbackMessage = fallbackMessage || t('modelViewer.noPreview');

  useEffect(() => {
    if (!modelUrl) {
      setIsLoading(false);
      return;
    }

    // Check if <model-viewer> Web Component is supported
    if (typeof window !== 'undefined' && !customElements.get('model-viewer')) {
      // Dynamically load model-viewer library
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      script.onload = () => {
        console.log('Model viewer loaded successfully');
        setIsLoading(false);
      };
      script.onerror = () => {
        console.error('Failed to load model viewer');
        setHasError(true);
        setIsLoading(false);
      };
      document.head.appendChild(script);

      return () => {
        // Cleanup script (optional)
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } else {
      setIsLoading(false);
    }
  }, [modelUrl]);

  // If there is no model URL
  if (!modelUrl) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ width, height }}
      >
        <div className="text-center text-gray-500">
          <AlertCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm">{finalFallbackMessage}</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">{t('modelViewer.loading')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-red-50 border border-red-200 rounded-lg ${className}`}
        style={{ width, height }}
      >
        <div className="text-center text-red-600">
          <AlertCircle className="mx-auto h-8 w-8 mb-2" />
          <p className="text-sm">{t('modelViewer.loadFailed')}</p>
        </div>
      </div>
    );
  }

  // Render 3D model viewer
  return (
    <div 
      ref={viewerRef}
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <model-viewer
        src={modelUrl}
        alt="3D Model Preview"
        auto-rotate
        camera-controls
        style={{ 
          width: '100%', 
          height: '100%',
          backgroundColor: '#f8f9fa'
        }}
        loading="eager"
        reveal="interaction"
        onLoad={() => console.log('3D model loaded successfully')}
        onError={(e: any) => {
          console.error('3D model load error:', e);
          setHasError(true);
        }}
      />
    </div>
  );
};

// Simplified version for card preview
export const ModelViewerCard: React.FC<{
  modelUrl?: string;
  className?: string;
}> = ({ modelUrl, className = '' }) => {
  const { t } = useLanguage();
  return (
    <ModelViewer
      modelUrl={modelUrl}
      className={`border border-gray-200 ${className}`}
      width={300}
      height={200}
      fallbackMessage={t('modelViewer.noPreviewShort')}
    />
  );
};

// TypeScript declaration for model-viewer element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        'auto-rotate'?: boolean;
        'camera-controls'?: boolean;
        loading?: 'auto' | 'lazy' | 'eager';
        reveal?: 'auto' | 'interaction' | 'manual';
        onLoad?: (event: Event) => void;
        onError?: (event: Event) => void;
      };
    }
  }
}

export default ModelViewer;