/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next/image-types/global" />

declare module "next-themes" {
  export interface ThemeProviderProps {
    children: React.ReactNode;
    forcedTheme?: string;
    defaultTheme?: string;
    attribute?: string;
    value?: { [themeName: string]: string };
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    storageKey?: string;
  }
  export function ThemeProvider(props: ThemeProviderProps): JSX.Element;
  export function useTheme(): {
    theme: string | undefined;
    setTheme: (theme: string) => void;
    forcedTheme: string | undefined;
    resolvedTheme: string | undefined;
    themes: string[];
    systemTheme: "dark" | "light" | undefined;
  };
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "next/font/google" {
  interface FontOptions {
    weight?: string | number | Array<string | number>;
    style?: string;
    subsets?: string[];
  }

  export function Inter(options?: FontOptions): {
    className: string;
    style: { fontFamily: string };
  };
}
