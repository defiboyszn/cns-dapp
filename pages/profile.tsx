import { useRouter } from "next/router"
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { ethers } from "ethers";
import CNS from "../contracts/CNS.json"
import Card from "@/components/UI/Card";
import { truncateAddress } from "@/utils/truncate";
import Link from "next/link";
import Layout from "@/layouts/default";
import { readContract } from '@wagmi/core'
import { useAccount, useNetwork } from "wagmi";
const CONTRACT_ADDRESS = { 80001: "0x4Ad97a7F369234eBD3BA881A5e1A454a8f5FDC01", 7001: "0x2354e4bd732bCac3c16F78F10f2fef8E081Cf94e" };

const tld = process.env.TLD || ".card";

const Profile = () => {
    const router = useRouter()
    const { chain } = useNetwork()
    const [minted_domain, setMintedDomain] = useState([] as {
        name: string;
        owner: string;
        resolver: string;
        image: string;
    }[]);

    const account = useAccount();

    const getDomain = useCallback(async (name: string) => {
        const data = await readContract({
            // @ts-ignore
            address: CONTRACT_ADDRESS[chain?.id as number],
            abi: CNS.abi,
            functionName: 'getDomain',
            args: [name]
        })

        return data as any;
    }, [chain?.id])
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

            const filtered = _data.filter(data => data?.owner?.toUpperCase() === (account.address as any)?.toUpperCase())
            setMintedDomain(filtered)

        }
        init()

    }, [account.address, chain?.id, getDomain, router]);
    return (
        <>
            <div className="bg-cover h-full w-full" style={{
                background: "linear-gradient(90deg,rgba(25,24,24,1.0),#005741)"
            }}>
                <div className="bg-[url('/images/bg.svg')] pt-32 pb-32 gap-10 h-full w-full flex flex-col justify-center items-center">

                    <div>
                        <div className="rounded-[10px] mx-0 py-5 px-5 bg-white/30 border-2 border-white/[0.10] w-[330px] md:w-[779px] h-[fit]">
                            <h1 className="mr-3 mb-0 text-3xl font-extrabold text-white leading-[41px]">Profile</h1>
                            <div className="flex flex-row justify-between items-center">
                                <div className="flex md:flex-row flex-col justify-start md:justify-between items-start md:items-center gap-1 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path d="M2.273 5.625A4.483 4.483 0 015.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 3H5.25a3 3 0 00-2.977 2.625zM2.273 8.625A4.483 4.483 0 015.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 6H5.25a3 3 0 00-2.977 2.625zM5.25 9a3 3 0 00-3 3v6a3 3 0 003 3h13.5a3 3 0 003-3v-6a3 3 0 00-3-3H15a.75.75 0 00-.75.75 2.25 2.25 0 01-4.5 0A.75.75 0 009 9H5.25z" />
                                    </svg>

                                    <h1 className="mr-3 mb-0 text-xl font-normal text-white leading-[21px]">Domain owner address: <Link href={chain?.id === 80001 ? `https://mumbai.polygonscan.com/address/${account.address}` : chain?.id === 7001 ? `https://explorer.zetachain.com/address/${account.address}` : `${null}`}>{truncateAddress(account.address as any)}</Link></h1>
                                </div>
                                <div className="flex flex-row justify-between gap-6 items-center">
                                    <button className="text-white disabled">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M14.47 2.47a.75.75 0 011.06 0l6 6a.75.75 0 010 1.06l-6 6a.75.75 0 11-1.06-1.06l4.72-4.72H9a5.25 5.25 0 100 10.5h3a.75.75 0 010 1.5H9a6.75 6.75 0 010-13.5h10.19l-4.72-4.72a.75.75 0 010-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <Link className="text-white" href={"/dapp"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0z" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                            <div className="rounded-[10px] mx-0 px-0 mt-5 bg-white/50 border-2 border-white/[0.10] w-[290px] md:w-[720px] h-[fit]">
                                <div className="px-2 md:px-10 h-[fit] py-10 flex flex-col gap-5 justify-center">
                                    <h1 className="mr-3 mb-0 text-3xl font-extrabold text-white leading-[41px]">Your Domains</h1>
                                    <div className="grid md:grid-cols-2 gap-10 items-center">
                                        {minted_domain.map((data: any, i) => {
                                            return <Link href={`/dapp/names/${data?.name}`} className="cursor-pointer" key={i}>
                                                <Card title={data?.name?.toUpperCase()} />
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


Profile.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}


export default Profile;