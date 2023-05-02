import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import CNS from "../contracts/CNS.json"
import { Button } from '@/components/UI';
import Input from '@/components/UI/Input';
import { useRouter } from "next/router"


const tld = process.env.TLD || ".card";
const CONTRACT_ADDRESS = "0xC571c33E97c0C64af44549268ddfC998b49Fe225";

const Dapp = () => {
    const router = useRouter()

    const [currentAccount, setCurrentAccount] = useState('');
    const [domain, setDomain] = useState('');


    //    const mintDomain = async () => {
    //     // Don't run if the domain is empty
    //     if (!domain) { return }
    //     // Alert the user if the domain is too short
    //     if (domain.length < 3) {
    //         alert('Domain must be at least 3 characters long');
    //         return;
    //     }
    //     // Calculate price based on length of domain (change this to match your contract)	
    //     // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
    //     const price = domain.length === 3 ? '0.5' : domain.length === 4 ? '0.3' : '0.1';
    //     console.log("Minting domain", domain, tld, "with price", price);
    //     try {
    //         // @ts-ignore
    //         const { ethereum } = window;
    //         if (ethereum) {
    //             // @ts-ignore
    //             const provider = new ethers.providers.Web3Provider(ethereum);
    //             const signer = provider.getSigner();
    //             const contract = new ethers.Contract(CONTRACT_ADDRESS as string, CNS.abi, signer);

    //             console.log("Going to pop wallet now to pay gas...")
    //             // await ethers.utils.
    //             // @ts-ignore
    //             let tx = await contract.register(domain, { value: ethers.utils.parseEther(price) });
    //             // Wait for the transaction to be mined
    //             const receipt = await tx.wait();

    //             // Check if the transaction was successfully completed
    //             if (receipt.status === 1) {
    //                 console.log("Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash);

    //                 // // Set the record for the domain
    //                 // tx = await contract.setRecord(domain, record);
    //                 await tx.wait();

    //                 console.log("Record set! https://mumbai.polygonscan.com/tx/" + tx.hash);
    //                 setDomain('');
    //             }
    //             else {
    //                 alert("Transaction failed! Please try again");
    //             }
    //         }
    //     }
    //     catch (error) {
    //         console.log(error);
    //     }
    // }

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

    // Create a function to render if wallet is not connected yet
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
                    <Button text="Search" on_click={()=> search(domain)} />
                </div>

            </div>
        );
    }

    // This runs our function when the page loads.
    useEffect(() => {
        checkIfWalletIsConnected();
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

export default Dapp;