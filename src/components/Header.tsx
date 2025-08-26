import React from 'react';
import { Building, LogOut, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/contexts/Web3Context';
import { useLanguage } from '@/hooks/useLanguage';
import { shortAddress } from '@/utils';
import { Button } from '@/components/ui/Button';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { login, logout, isAuthenticated, userAddress, safeAddress, isLoggingIn } = useWeb3();
  const { currentLanguage, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    changeLanguage(currentLanguage === 'ja' ? 'en' : 'ja');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur-lg">
      <div className="container mx-auto flex h-20 items-center px-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-toda-blue rounded-lg">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl text-slate-800">
              {t('app.title')}
            </span>
            <div className="text-xs text-toda-grey">
              {t('app.tagline')}
            </div>
          </div>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-slate-600 hover:text-toda-blue"
          >
            <Globe className="h-4 w-4 mr-1" />
            {currentLanguage === 'ja' ? 'EN' : 'JA'}
          </Button>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex flex-col items-end text-xs">
                <span className="font-mono text-slate-500">
                  {t('header.eoa')} {shortAddress(userAddress)}
                </span>
                <span className="font-mono font-semibold text-slate-800">
                  {t('header.smartWallet')} {shortAddress(safeAddress)}
                </span>
              </div>
              <Button 
                onClick={logout} 
                variant="outline" 
                size="sm"
                className="border-toda-grey hover:bg-toda-grey/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t('header.logout')}
              </Button>
            </div>
          ) : (
            <Button 
              onClick={login}
              disabled={isLoggingIn}
              className="bg-toda-blue hover:bg-toda-blue/90"
            >
              {t('header.login')}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};