import './globals.css';

import { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Event Scheduling Analysis',
  description: 'Choose optimal dates and venues using historical event data'
};

const RootLayout = ({ children }: PropsWithChildren) => 
  (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );

export default RootLayout;

