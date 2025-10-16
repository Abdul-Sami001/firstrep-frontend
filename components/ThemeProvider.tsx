import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'training' | 'yoga' | 'running' | 'studio';

interface ThemeColors {
  primary: string;
  accent: string;
  name: string;
}

const themeColors: Record<Theme, ThemeColors> = {
  'training': {
    primary: '220 15% 15%',
    accent: '0 80% 50%',
    name: 'Training'
  },
  'yoga': {
    primary: '150 40% 35%',
    accent: '280 70% 60%',
    name: 'Yoga'
  },
  'running': {
    primary: '210 100% 45%',
    accent: '45 90% 55%',
    name: 'Running'
  },
  'studio': {
    primary: '25 30% 20%',
    accent: '200 60% 50%',
    name: 'Studio'
  }
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('training');

  useEffect(() => {
    const root = document.documentElement;
    const colors = themeColors[theme];
    
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--ring', colors.primary);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: themeColors[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
