import { Metadata } from 'next';

export interface PageProps<T extends Record<string, string> = {}> {
  params: T;
  searchParams?: { 
    [key: string]: string | string[] | undefined; 
  };
}

// Simplificar al máximo
export interface GenerateMetadataProps {
  params: any;
  searchParams?: { 
    [key: string]: string | string[] | undefined; 
  };
}

export type GenerateMetadataFunction = (
  props: GenerateMetadataProps
) => Promise<Metadata>;
