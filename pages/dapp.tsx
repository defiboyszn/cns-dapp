import React, { ReactElement, useEffect, useState } from 'react';
import { Button } from '@/components/UI';
import Input from '@/components/UI/Input';
import { useRouter } from "next/router"
import Layout from '@/layouts/default';
import { useAccount,useNetwork } from 'wagmi'


const tld = process.env.TLD || ".card";
const CONTRACT_ADDRESS = "0xC571c33E97c0C64af44549268ddfC998b49Fe225";

const Dapp = () => {
    const router = useRouter();
    const [domain, setDomain] = useState('');
    const search = (name: string) => {
        router.push(`/dapp/search?keywords=${name}`);
    }
    const { isConnected } = useAccount();
    
    const renderInputForm = () => {
        return (
            <div className="flex flex-col justify-center items-center gap-5 mt-10">
                <div className="flex flex-row">
                    <Input value={domain}
                        placeholder='Enter Domain name'
                        onChange={e => setDomain(e.target.value)} />
                    <p className='bg-white px-5 text-black h-10 rounded-r-lg flex flex-col justify-center items-center'>{tld}</p>
                </div>

                <div className="button-container">
                    <Button text="Search" on_click={() => {
                        if (domain.length < 1) return;
                        else
                            search(domain)
                    }} />
                </div>
                <div className="button-container">
                    <Button text="Listed Domains" on_click={() => {
                        router.push(`/dapp/domains`)
                    }} />
                </div>

            </div>
        );
    }

    return (
        <div className="bg-[linear-gradient(90deg,rgba(25,24,24,1.0),#005741)] h-screen">
            <div className="flex flex-col justify-center items-center h-screen">

                <div>
                    <header>
                        <div className="">
                            <h1 className="font-Tanker text-4xl md:text-8xl text-white">Get your .card domain</h1>
                        </div>
                    </header>
                </div>
                {isConnected && renderInputForm()}
            </div>
        </div>
    );
}

Dapp.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}


export default Dapp;