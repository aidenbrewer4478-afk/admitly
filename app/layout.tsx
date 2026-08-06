import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admitly — AI Essay Feedback for Students',
  description:
    'Admitly gives students AI-generated feedback on college essays and school writing — clichés flagged, specific rewrites, a score, and version history. Free plan available, $12/month for unlimited reviews.',
  applicationName: 'Admitly',
  openGraph: {
    title: 'Admitly — AI Essay Feedback for Students',
    description:
      'Admitly gives students AI-generated feedback on college essays and school writing — clichés flagged, specific rewrites, a score, and version history.',
    siteName: 'Admitly',
    url: 'https://admitlyapp.com',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
