import { useRouter } from "next/router"
import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import CNS from "@/contracts/CNS.json"
import Input from "@/components/UI/Input";
import { Badge, Button } from "@/components/UI";
import { useDollar } from "@/utils/useDollar";
import Card from "@/components/UI/Card";
import { truncateAddress } from "@/utils/truncate";
import Link from "next/link";
// import { Button } from "../UI"
const CONTRACT_ADDRESS = "0xC571c33E97c0C64af44549268ddfC998b49Fe225";
const tld = process.env.TLD || ".card";

const Transfer = () => {
    const router = useRouter();
    // const [domain, setDomain] = useState("");


    const [minted_domain, setMintedDomain] = useState([] as {
        name: string;
        owner: string;
        resolver: string;
        image: string;
    }[]);
    // @ts-ignore
    const [connectedAddress, setConnectedAddress] = useState();

    const getDomain = async (name: string) => {
        // @ts-ignore
        const { ethereum } = window;
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS as string, CNS.abi, await signer);
        const domain = await contract.getDomain(name);

        return domain;
    }
    useEffect(() => {
        const init = async () => {
            // @ts-ignore
            const { ethereum } = window;
            const provider = new ethers.BrowserProvider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS as string, CNS.abi, await signer);
            contract.getAllNames().then(async data => {
                const _data = await Promise.all(data.map(async (data$: string) => {
                    const data_ = await getDomain(data$.split('.')[0])
                    let dataa = {} as {
                        name: string;
                        owner: string;
                        avatar: string;
                        image: string;
                    };
                    dataa.owner = data_[0];
                    dataa.name = data_[1];
                    dataa.image = data_[2];
                    dataa.avatar = data_[3];
                    return dataa
                }))
                const filtered = _data.filter(data => data?.owner?.toUpperCase() === (connectedAddress as any)?.toUpperCase())
                setMintedDomain(filtered)
                console.log(contract);

            })
        }
        init()

    }, [connectedAddress, router]);

    const checkIfWalletIsConnected = async () => {
        // First make sure we have access to window.ethereum
        // @ts-ignore
        const { ethereum } = window;

        if (!ethereum) {
            alert("Make sure you have MetaMask!");
            return;
        } else {
        }
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length !== 0) {
            const account = accounts[0];
            setConnectedAddress(account);
        } else {
            console.log('No authorized account found');
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])
    return (
        <>
            <div className="bg-cover pt-32 pb-32 h-full w-full" style={{
                background: "linear-gradient(90deg,rgba(25,24,24,1.0),rgba(131,107,245,1.0))"
            }}>
                <div className="bg-[url('/images/bg.svg')] gap-10 h-full w-full flex flex-col justify-center items-center">

                    <div>
                        <div className="rounded-[10px] mx-0 py-5 px-5 bg-white/30 border-2 border-white/[0.10] w-[330px] md:w-[779px] h-[fit]">
                            <h1 className="mr-3 mb-0 text-3xl font-extrabold text-white leading-[41px]">Transfer Domain</h1>
                            <div className="flex flex-row justify-between items-center">
                                <div className="flex md:flex-row flex-col justify-start md:justify-between items-start md:items-center gap-1 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path d="M2.273 5.625A4.483 4.483 0 015.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 3H5.25a3 3 0 00-2.977 2.625zM2.273 8.625A4.483 4.483 0 015.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 6H5.25a3 3 0 00-2.977 2.625zM5.25 9a3 3 0 00-3 3v6a3 3 0 003 3h13.5a3 3 0 003-3v-6a3 3 0 00-3-3H15a.75.75 0 00-.75.75 2.25 2.25 0 01-4.5 0A.75.75 0 009 9H5.25z" />
                                    </svg>

                                    <h1 className="mr-3 mb-0 text-xl font-normal text-white leading-[21px]">Domain owner address: <Link href={`https://mumbai.polygonscan.com/address/${connectedAddress}`}>{truncateAddress(connectedAddress as any)}</Link></h1>
                                </div>
                                {/* <div className="flex flex-row justify-between items-center">
                                    <Link className="text-white" href={"/dapp/transfer"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M14.47 2.47a.75.75 0 011.06 0l6 6a.75.75 0 010 1.06l-6 6a.75.75 0 11-1.06-1.06l4.72-4.72H9a5.25 5.25 0 100 10.5h3a.75.75 0 010 1.5H9a6.75 6.75 0 010-13.5h10.19l-4.72-4.72a.75.75 0 010-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </Link>
                                </div> */}
                            </div>
                            <div className="rounded-[10px] mx-0 px-0 mt-5 bg-white/50 border-2 border-white/[0.10] w-[290px] md:w-[720px] h-[fit]">
                                <div className="px-2 md:px-10 h-[fit] py-10 flex flex-col gap-5 justify-center">
                                    <h1 className="mr-3 mb-0 text-3xl font-extrabold text-white leading-[41px]">Your Domains</h1>
                                    <div className="grid md:grid-cols-2 gap-10 items-center">
                                        {minted_domain.map((data: any, i) => {
                                            return <Link href={`/dapp/transfer/${data?.name}`} className="cursor-pointer" key={i}>
                                                <Card imageSrc={data.image} title={data?.name?.toUpperCase()} />
                                            </Link>
                                        })}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Transfer;