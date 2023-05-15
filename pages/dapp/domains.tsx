import { useRouter } from "next/router"
import React, { ReactElement, useEffect, useState } from 'react';
import { ethers } from "ethers";
import CNS from "../../contracts/CNS.json"
import { readContract } from '@wagmi/core'
import { useAccount } from "wagmi";
import Card from "@/components/UI/Card";
import Layout from "@/layouts/default";
import Link from "next/link";
import { useContractWrite, useNetwork, usePrepareContractWrite } from 'wagmi'



// import { Button } from "../UI"
const CONTRACT_ADDRESS = { 80001: "0x4Ad97a7F369234eBD3BA881A5e1A454a8f5FDC01", 7001: "0x2354e4bd732bCac3c16F78F10f2fef8E081Cf94e" };

const tld = process.env.TLD || ".card";

const Domains = () => {


    const router = useRouter()
    const { chain } = useNetwork()

    const [minted_domain, setMintedDomain] = useState([] as {
        name: string;
        owner: string;
        resolver: string;
        image: string;
    }[]);
    // @ts-ignore
    const [connectedAddress, setConnectedAddress] = useState();

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
            const filtered = _data
            setMintedDomain(filtered)
        }
        init()

    }, [chain?.id, connectedAddress, getDomain, router]);
    return (
        <>
            <div className="bg-cover h-full w-full" style={{
                background: "linear-gradient(90deg,rgba(25,24,24,1.0),#005741)"
            }}>
                <div className="bg-[url('/images/bg.svg')] pt-40 pb-32 gap-10 h-full w-full flex flex-col justify-center items-center">

                    <div>
                        <div className="rounded-[10px] mx-0 py-5 px-5 bg-white/30 border-2 border-white/[0.10] w-[779px] h-[fit]">
                            <h1 className="mr-3 mb-0 text-3xl font-extrabold text-white leading-[41px]">Domains</h1>
                            <div className="rounded-[10px] mx-0 px-0 mt-5 bg-white/50 border-2 border-white/[0.10] w-[720px] h-[fit]">
                                <div className="px-10 h-[fit] py-10 flex flex-col gap-5 justify-center">
                                    <h1 className="mr-3 mb-0 text-3xl font-extrabold text-white leading-[41px]">All Domains</h1>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                        {minted_domain.length < 1 ? (
                                            <>
                                                <h1 className="font-Helvetica_Now text-2xl">No Domains Registered!</h1>
                                            </>
                                        ) : minted_domain.map((data: any, i) => {
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