import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ReactElement, useEffect } from 'react'
import Head from 'next/head'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'


export default function Layout({ children }: { children: ReactElement }) {
    const { isConnected } = useAccount()
    const router = useRouter();
    // useEffect(()=> {
    //     if (!isConnected) {
    //         router.push("/")
    //     }
    // },[router])
    return (
        <>
            <Head>
                <title>Card Name Service</title>
                <meta name="title" content="Card Name Service" />
                <meta name="description" content="CNS - Decentralized Identity" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://trycns.vercel.app/" />
                <meta property="og:title" content="Card Name Service" />
                <meta property="og:description" content="CNS - Decentralized Identity" />
                <meta property="og:image" content="/images/cns-post.png" />
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://trycns.vercel.app/" />
                <meta property="twitter:title" content="Card Name Service" />
                <meta property="twitter:description" content="CNS - Decentralized Identity" />
                <meta property="twitter:image" content="/images/cns-post.png" />
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