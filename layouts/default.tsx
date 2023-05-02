import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ReactElement } from 'react'
import Head from 'next/head'

export default function Layout({ children }: { children: ReactElement }) {
    return (
        <>
            <Head>
                <meta name="description" content="$endTokens" />
                <title>Card Name Service</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="font-DM_Sans">
                <Navbar />
                {children}
                <Footer />
            </div>
        </>
    )
}