'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (locale: 'cs' | 'uk') => {
    // For now, just store in localStorage
    // In production, you'd handle this with proper i18n routing
    localStorage.setItem('locale', locale);
    window.location.reload();
  };

  return (
    <div className="relative group">
      <button className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
        <Globe className="w-4 h-4 mr-1" />
        <span className="text-sm">CS</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          <button
            onClick={() => switchLanguage('cs')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            🇨🇿 Čeština
          </button>
          <button
            onClick={() => switchLanguage('uk')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            🇺🇦 Українська
          </button>
        </div>
      </div>
    </div>
  );
}