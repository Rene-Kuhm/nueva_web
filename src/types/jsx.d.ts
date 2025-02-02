import React from 'react';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { ErrorBoundaryProps } from '@/components/error-boundary';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
      script: React.DetailedHTMLProps<React.ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;
      link: React.DetailedHTMLProps<React.LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
      meta: React.DetailedHTMLProps<React.MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
    }

    interface ElementChildrenAttribute {
      children: {};
    }
  }

  interface ThemeProviderExtendedProps extends ThemeProviderProps {
    children?: React.ReactNode;
  }

  interface ErrorBoundaryExtendedProps extends ErrorBoundaryProps {
    children?: React.ReactNode;
  }
}
