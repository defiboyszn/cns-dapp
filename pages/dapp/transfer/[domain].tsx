import { useRouter } from "next/router"
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { ethers } from "ethers";
import CNS from "@/contracts/CNS.json"
import Input from "@/components/UI/Input";
import { Badge, Button } from "@/components/UI";
import { useDollar } from "@/utils/useDollar";
import Card from "@/components/UI/Card";
import { truncateAddress } from "@/utils/truncate";
import Link from "next/link";
import Layout from "@/layouts/default";
import { useAccount, useNetwork,useContractWrite } from "wagmi";
import { readContract, writeContract } from '@wagmi/core'




const CONTRACT_ADDRESS = { 80001: "0x4Ad97a7F369234eBD3BA881A5e1A454a8f5FDC01", 7001: "0x2354e4bd732bCac3c16F78F10f2fef8E081Cf94e" };
const tld = process.env.TLD || ".card";

const Transfer = () => {
    const router = useRouter();
    const [domain, setDomain] = useState("");


    const [minted_domain, setMintedDomain] = useState([] as {
        name: string;
        owner: string;
        resolver: string;
        image: string;
    }[]);
    // @ts-ignore
    const [connectedAddress, setConnectedAddress] = useState();
    const { isConnected, address } = useAccount();
    const { chain } = useNetwork();
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

            const filtered = _data.filter(data => data?.owner?.toUpperCase() === (address as any)?.toUpperCase())
            setMintedDomain(filtered)
        }
        init()
    }, [address, chain?.id, getDomain, router]);

    useEffect(() => {
        const emptyAddress = ethers.constants.AddressZero;
        getDomain((router.query.domain as string)?.split('.')[0]).then((data) => {
            if (data[0] === emptyAddress) {
                router.push("/dapp/names/" + router.query.domain)
            }
        })
    }, [getDomain, router]);
    const { writeAsync } = useContractWrite({
        // @ts-ignore
        address: CONTRACT_ADDRESS[chain?.id as number],
       abi: CNS.abi,
       functionName: "transfer",
       // @ts-ignore
       // value: parseGwei(price)
   })

    async function transfer(name: string, address: string) {
        await writeAsync({
            args: [name, address]
        })
    }








    return (
        <>
            <div className="bg-cover h-full w-full" style={{
                background: "linear-gradient(90deg,rgba(25,24,24,1.0),#005741)"
            }}>
                <div className="bg-[url('/images/bg.svg')] pt-32 pb-32  gap-10 h-full w-full flex flex-col justify-center items-center">

                    <div>
                        <div className="rounded-[10px] mx-0 py-5 px-5 bg-white/30 border-2 border-white/[0.10] w-[330px] md:w-[779px] h-[fit]">
                            <h1 className="mr-3 mb-0 text-3xl font-extrabold text-white leading-[41px]">Transfer Domain</h1>
                            <div className="flex flex-row justify-between items-center">
                                <div className="flex md:flex-row flex-col justify-start md:justify-between items-start md:items-center gap-1 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path d="M2.273 5.625A4.483 4.483 0 015.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 3H5.25a3 3 0 00-2.977 2.625zM2.273 8.625A4.483 4.483 0 015.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 6H5.25a3 3 0 00-2.977 2.625zM5.25 9a3 3 0 00-3 3v6a3 3 0 003 3h13.5a3 3 0 003-3v-6a3 3 0 00-3-3H15a.75.75 0 00-.75.75 2.25 2.25 0 01-4.5 0A.75.75 0 009 9H5.25z" />
                                    </svg>

                                    <h1 className="mr-3 mb-0 text-xl font-normal text-white leading-[21px]">Domain owner address: <Link href={chain?.id === 80001 ? `https://mumbai.polygonscan.com/address/${address}` : chain?.id === 7001 ? `https://explorer.zetachain.com/address/${address}` : `${null}`}>{truncateAddress(address as any)}</Link></h1>
                                </div>
                            </div>
                            <div className="rounded-[10px] mx-0 px-0 mt-5 bg-white/50 border-2 border-white/[0.10] w-[290px] md:w-[720px] h-[fit]">
                                <div className="px-2 md:px-10 h-[fit] py-10 flex flex-col gap-5 justify-center">
                                    <h1 className="mr-3 mb-0 text-3xl font-extrabold text-white leading-[41px]">{router.query.domain}</h1>
                                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                                        <div className="flex flex-row">
                                            <Input value={domain}
                                                placeholder='Enter Wallet Address'
                                                onChange={e => setDomain(e.target.value)} />
                                            <p className='bg-white px-5 text-black h-10 font-Tanker rounded-r-lg flex flex-col justify-center items-center'></p>
                                        </div>
                                        <div className="button-container">
                                            <Button text="Transfer" on_click={() => {
                                                transfer(router.query.domain as string, domain)
                                            }
                                                // 
                                            } />
                                        </div>
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

Transfer.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}



export default Transfer;