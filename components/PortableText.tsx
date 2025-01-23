import { PortableText as SanityPortableText } from '@portabletext/react';
import { PortableTextComponents } from '@portabletext/types';

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4">{children}</p>,
    h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold mb-3">{children}</h2>,
  },
};

export default function PortableText({ value }: { value: any }) {
  return <SanityPortableText value={value} components={components} />;
}
