import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building, LogOut, Globe, Users, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/contexts/Web3Context';
import { useLanguage } from '@/hooks/useLanguage';
import { shortAddress } from '@/utils';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2',
        isActive
          ? 'bg-slate-100 text-toda-blue'
          : 'hover:bg-transparent hover:text-toda-blue/80 text-slate-600'
      )}
    >
      {children}
    </Link>
  );
};

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { login, logout, isAuthenticated, userAddress, safeAddress, isLoggingIn } = useWeb3();
  const { currentLanguage, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    changeLanguage(currentLanguage === 'ja' ? 'en' : 'ja');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-luxury-silver/20 premium-card backdrop-blur-xl shadow-xl">
      <div className="container mx-auto flex h-20 items-center px-6">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-luxury-gold to-luxury-purple rounded-xl luxury-glow group-hover:scale-110 transition-all duration-300">
              <Building className="h-7 w-7 text-white animate-float" />
            </div>
            <div>
              <span className="h4 text-slate-800 group-hover:text-luxury-purple transition-colors duration-300">
                {t('app.title')}
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 items-center justify-center hidden md:flex ml-10">
            <div className="flex items-center space-x-2 bg-slate-50/50 p-1 rounded-lg">
                <NavLink to="/">{t('header.marketplace')}</NavLink>
                <NavLink to="/community"><Users className="w-4 h-4 mr-2"/>{t('header.community')}</NavLink>
                <NavLink to="/custom-order"><ShoppingCart className="w-4 h-4 mr-2"/>{t('header.customOrder')}</NavLink>
            </div>
        </nav>
        
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