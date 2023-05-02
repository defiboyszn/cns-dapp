import { useRouter } from "next/router"
import React, { ReactElement, useEffect, useState } from 'react';
import { ethers } from "ethers";
import CNS from "../../contracts/CNS.json"
import Input from "@/components/UI/Input";
import { Badge, Button } from "@/components/UI";
import { useDollar } from "../../utils/useDollar";
import Card from "@/components/UI/Card";
import Layout from "@/layouts/default";
import Link from "next/link";
import { checkAndSwitchToMumbai } from "@/utils/network_check";
// import { Button } from "../UI"
const CONTRACT_ADDRESS = "0xC571c33E97c0C64af44549268ddfC998b49Fe225";
const tld = process.env.TLD || ".card";

const Domains = () => {


    const router = useRouter()
    // const _domain = router.query.name;
    // const [domain, setDomain] = useState(_domain?.toString().split(".")[0] as string);

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
                const filtered = _data
                setMintedDomain(filtered)
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
        checkAndSwitchToMumbai();
    }, [])
    return (
        <>
            <div className="bg-cover pt-32 h-full w-full" style={{
                background: "linear-gradient(90deg,rgba(25,24,24,1.0),rgba(131,107,245,1.0))"
            }}>
                <div className="bg-[url('/images/bg.svg')] pb-32 gap-10 h-full w-full flex flex-col justify-center items-center">

                    <div>
                        <div className="rounded-[10px] mx-0 py-5 px-5 bg-white/30 border-2 border-white/[0.10] w-[779px] h-[fit]">
                            <h1 className="mr-3 mb-0 text-3xl font-extrabold text-white leading-[41px]">Domains</h1>
                            <div className="rounded-[10px] mx-0 px-0 mt-5 bg-white/50 border-2 border-white/[0.10] w-[720px] h-[fit]">
                                <div className="px-10 h-[fit] py-10 flex flex-col gap-5 justify-center">
                                    <h1 className="mr-3 mb-0 text-3xl font-extrabold text-white leading-[41px]">All Domains</h1>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                        {minted_domain.map((data: any, i) => {
                                            return <Link href={`/dapp/names/${data?.name}`} className="cursor-pointer" key={i}>
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

Domains.getLayout = function getLayout(page: ReactElement) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }
  


export default Domains;