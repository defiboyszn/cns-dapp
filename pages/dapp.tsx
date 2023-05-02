import React, { ReactElement, useEffect, useState } from 'react';
import { ethers } from "ethers";
import CNS from "../contracts/CNS.json"
import { Button } from '@/components/UI';
import Input from '@/components/UI/Input';
import { useRouter } from "next/router"
import Layout from '@/layouts/default';
import { checkAndSwitchToMumbai } from '@/utils/network_check';


const tld = process.env.TLD || ".card";
const CONTRACT_ADDRESS = "0xC571c33E97c0C64af44549268ddfC998b49Fe225";

const Dapp = () => {
    const router = useRouter()

    const [currentAccount, setCurrentAccount] = useState('');
    const [domain, setDomain] = useState('');
    const search = (name: string) => {
        router.push(`/dapp/search?keywords=${name}`);
    }

    const connectWallet = async () => {
        try {
            // @ts-ignore
            const { ethereum } = window;

            if (!ethereum) {
                alert("Get MetaMask -> https://metamask.io/");
                return;
            }

            // Fancy method to request access to account.
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });

            // Boom! This should print out public address once we authorize Metamask.
            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error)
        }
    }

    // Gotta make sure this is async.
    const checkIfWalletIsConnected = async () => {
        // First make sure we have access to window.ethereum
        // @ts-ignore
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have MetaMask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        // Check if we're authorized to access the user's wallet
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        // Users can have multiple authorized accounts, we grab the first one if its there!
        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log('Found an authorized account:', account);
            setCurrentAccount(account);
        } else {
            console.log('No authorized account found');
        }
    }
    const renderNotConnectedContainer = () => (
        <div className="connect-wallet-container">
            <h2 style={{
                fontSize: "100px"
            }}>💳</h2>
            <button onClick={connectWallet} className="cta-button connect-wallet-button">
                Connect Wallet
            </button>
        </div>
    );

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

    useEffect(() => {
        checkIfWalletIsConnected();
        checkAndSwitchToMumbai();
    }, [])
    return (
        <div className="bg-[linear-gradient(159.24deg,#191919_52.47%,#0B3D91_192.07%)] h-screen">
            <div className="flex flex-col justify-center items-center h-screen">

                <div>
                    <header>
                        <div className="">
                            <h1 className="font-Tanker text-4xl md:text-8xl text-white">Get your .card domain</h1>
                        </div>
                    </header>
                </div>

                {!currentAccount && renderNotConnectedContainer()}
                {currentAccount && renderInputForm()}
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