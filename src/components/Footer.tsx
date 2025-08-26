import React from 'react';
import { Building, Github, Twitter, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-toda-blue rounded-lg">
                <Building className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-800">
                {t('app.title')}
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('app.tagline')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-toda-blue transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-toda-blue transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-toda-blue transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Platform</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="#" className="hover:text-toda-blue transition-colors">Marketplace</a></li>
              <li><a href="#" className="hover:text-toda-blue transition-colors">Mint NFT</a></li>
              <li><a href="#" className="hover:text-toda-blue transition-colors">Collections</a></li>
              <li><a href="#" className="hover:text-toda-blue transition-colors">Analytics</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="#" className="hover:text-toda-blue transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-toda-blue transition-colors">Tutorials</a></li>
              <li><a href="#" className="hover:text-toda-blue transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-toda-blue transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="#" className="hover:text-toda-blue transition-colors">About</a></li>
              <li><a href="#" className="hover:text-toda-blue transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-toda-blue transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-toda-blue transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-slate-500">
            {t('footer.copyright')}
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-sm text-slate-500 hover:text-toda-blue transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-toda-blue transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};