'use client';

import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Navbar from './Navbar';

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
  hideFooter?: boolean;
  mainClassName?: string;
};

export default function Layout({
  children,
  title = 'Vibement',
  hideFooter = false,
  mainClassName = 'flex-1 w-full px-4 pt-20 pb-32',
}: LayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) router.push('/login');
  }, [router]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />

        <main className={mainClassName}>
          {children}
        </main>

        {!hideFooter && (
          <footer className="w-full pb-28 pt-4 text-center">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Vibement. All rights reserved by{' '}
              <span className="font-medium text-emerald-600">Sudip Koirala</span>.
            </p>
          </footer>
        )}
      </div>
    </>
  );
}
