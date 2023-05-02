import { Features } from '@/components/Features';
import {Hero} from '@/components/Hero';
import Layout from '@/layouts/default';
import { ReactElement } from 'react';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
    </>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
