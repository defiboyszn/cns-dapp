import { useRouter } from "next/router"
import { useSearchParams } from 'next/navigation';
import React, { ReactElement, useEffect, useState } from 'react';
// import { ethers } from "ethers";
// import { useContractRead } from 'wagmi'
import { CNS } from "../../contracts/CNS"
import Input from "@/components/UI/Input";
import { Badge, Button } from "@/components/UI";
import Layout from "@/layouts/default";
import { readContract } from '@wagmi/core'
import { useAccount } from "wagmi";
import { useNetwork } from 'wagmi'

const CONTRACT_ADDRESS = { 80001: "0x4Ad97a7F369234eBD3BA881A5e1A454a8f5FDC01", 7001: "0x2354e4bd732bCac3c16F78F10f2fef8E081Cf94e" };
const tld = process.env.TLD || ".card";

const Search = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { isConnected } = useAccount()
    const { chain } = useNetwork()


    const _search = searchParams.get('keywords');
    const [domain, setDomain] = useState(_search as string);
    const [price, setPrice] = useState('');
    useEffect(() => {
        setDomain(_search as string);
    }, [])
    useEffect(() => {
        const price = domain?.length === 3 ? '0.10' : domain?.length === 4 ? '0.4' : '0.2';

        setPrice(price)
    }, [domain])
    const [minted_domain, setMintedDomain] = useState({} as {
        name: string;
        owner: string;
        avatar: string;
        image: string;
    });

    const getDomain = async (name: string) => {
        const data = await readContract({
            // @ts-ignore
            address: CONTRACT_ADDRESS[chain?.id as number],
            abi: CNS.abi,
            functionName: 'getDomain',
            args: [name]
        })

        return data as any;
    }
    useEffect(() => {
        const init = async () => {
            const data__ = await readContract({
                // @ts-ignore
                address: CONTRACT_ADDRESS[chain?.id as number],
                abi: CNS.abi,
                functionName: 'getAllNames',
            });

            const _data = await Promise.all((data__ as any).map(async (data$: string) => {
                const data_ = await getDomain(data$.split(".")[0])
                let dataa = {} as {
                    name: string;
                    owner: string;
                    avatar: string;
                    image: string;
                };
                dataa.owner = data_.owner;
                dataa.name = data_.name;
                dataa.image = data_.image;
                dataa.avatar = data_.avatar;
                return dataa
            }))

            const filtered = _data.filter(data => data.name === domain + tld)[0]
            setMintedDomain(filtered)
        }
        init()
    }, [chain?.id, domain, getDomain, minted_domain])

    const search = async (name: string) => {
        let domain = await getDomain(name);
        if (domain) {
            console.log(domain);
        } else {
            alert("dey play, big boys don buy em");
        }
    }


    // Form to enter domain name and data
    const renderInputForm = () => {
        return (
            <div className="flex flex-col justify-center items-center gap-5 mt-10">
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                    <div className="flex flex-row">
                        <Input value={domain}
                            placeholder='Enter Domain name'
                            onChange={e => setDomain(e.target.value)} />
                        <p className='bg-white px-5 text-black h-10 font-Tanker rounded-r-lg flex flex-col justify-center items-center'>{tld}</p>
                    </div>
                    <div className="button-container">
                        <Button text="Search" on_click={() => search(domain)} />
                    </div>
                </div>

                <div onClick={() => {
                    router.push(`/dapp/names/${domain + tld}`)
                }} className="cursor-pointer rounded-[10px] mx-0 px-0 bg-white/50 border-2 border-white/[0.10] w-[305px] md:w-[779px] flex flex-col h-[125px]">
                    <div className="rounded-t-[10px] px-10 bg-[#fcfcfc] border-2 flex flex-col justify-center border-white w-[300px] md:w-[775px] h-[34px]">
                        <p className="text-[13px] text-[#bebebe] leading-[18px]">Exactly match</p>
                    </div>
                    <div className="px-10 h-[60px] w-[20px] flex flex-row justify-between items-center">
                        <h1 className="mr-3 mb-0 text-3xl font-extrabold text-white leading-[41px]">{minted_domain?.name || domain + tld}</h1>
                        <Badge available={minted_domain?.name ? false : true} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-cover h-screen w-full" style={{
                background: "linear-gradient(159.24deg,#202020 52.47%,#050505 192.07%)"
            }}>
                <div className="bg-[url('/images/bg.svg')] gap-10 h-screen w-full flex flex-col justify-center items-center">
                    {isConnected && renderInputForm()}
                </div>
            </div>
        </>
    )
}

Search.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}




export default Search;