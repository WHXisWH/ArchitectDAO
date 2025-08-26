import React from 'react';
import { Building } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LoadingScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-toda-blue/5">
      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-toda-blue to-toda-blue/80 rounded-full shadow-lg mb-6">
        <Building className="h-8 w-8 text-white animate-pulse" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          ArchitectDAO
        </h2>
        <p className="text-slate-500 animate-pulse">
          {t('loading')}
        </p>
      </div>
      <div className="flex space-x-1 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-toda-blue rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};