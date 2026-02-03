'use client';

import { useTheme } from '@/components/ThemeProvider.tsx'; 
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-10 h-10" />;

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-zinc-500 hover:text-indigo-600 dark:hover:text-white border border-zinc-200 dark:border-white/5 transition-all shadow-sm flex items-center gap-3"
    >
      <div className="relative h-5 w-5 flex items-center justify-center">
        <Sun className={`h-5 w-5 transition-all transform duration-500 ${isDark ? 'scale-100 rotate-0' : 'scale-0 -rotate-90 absolute'}`} />
        <Moon className={`h-5 w-5 transition-all transform duration-500 ${!isDark ? 'scale-100 rotate-0' : 'scale-0 rotate-90 absolute'}`} />
      </div>
      <span className="text-[10px] font-black uppercase italic tracking-widest hidden md:block">
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </span>
    </button>
  );
}