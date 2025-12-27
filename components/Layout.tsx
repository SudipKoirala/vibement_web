import { ReactNode } from "react";
import Head from "next/head";

type LayoutProps = {
  children: ReactNode;
  title?: string;
};

export default function Layout({ children, title }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title || "Vibement"}</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        {children}
      </div>
    </>
  );
}
