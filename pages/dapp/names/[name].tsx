import { useRouter } from "next/router"
import React, { ReactElement, useEffect, useState, Fragment, useCallback } from 'react';
import web3 from "web3"
import { CNS } from "../../../contracts/CNS"
import CNS_ from "../../../contracts/CNS.json"
import Input from "@/components/UI/Input";
import { Badge, Button } from "@/components/UI";
import { useDollar } from "../../../utils/useDollar";
import Link from "next/link";
import { truncateAddress } from "@/utils/truncate";
import Layout from "@/layouts/default";
import { Dialog, Transition } from '@headlessui/react'
import { readContract, writeContract } from '@wagmi/core'
import { useAccount } from "wagmi";
import { useContractWrite, useNetwork, usePrepareContractWrite } from 'wagmi'
import { parseEther } from "ethers/lib/utils";


const CONTRACT_ADDRESS = { 80001: "0x4Ad97a7F369234eBD3BA881A5e1A454a8f5FDC01", 7001: "0x2354e4bd732bCac3c16F78F10f2fef8E081Cf94e" };
const tld = process.env.TLD || ".card";


const Names = () => {
    const router = useRouter()
    const { chain } = useNetwork()
    const _domain = router.query.name;
    const [domain, setDomain] = useState(_domain?.toString().split(".")[0] as string);
    const [price, setPrice] = useState(0);
    const [price_usd, setPriceUsd] = useState(0);
    let [purchased, setPurchased] = useState(false);
    let [loading, setLoading] = useState(false);
    let [purchased_text, setPurchasedText] = useState("");
    const { isConnected, address, connector } = useAccount()


    useEffect(()=> {
        setDomain(_domain?.toString().split(".")[0] as string)
    } ,[_domain, router])

    useEffect(() => {
        const init = async () => {
            const maticPrice = 0.9531;
            const zetaPrice = 0;
            const price = chain?.id  === 80001 ? (domain.length === 3 ? Number('0.10') : domain.length === 4 ? Number('0.4') : Number('0.2')) : chain?.id  === 7001 ? (domain.length === 3 ? Number('0.40') : domain.length === 4 ? Number('0.6') : Number('0.3')) : 0;
            const usdAmount = chain?.id  === 80001 ? (price * maticPrice) : chain?.id  === 7001 ? (price * zetaPrice) : 0;
            setPrice(price)
            setPriceUsd(usdAmount)
        }
        init()
    }, [domain, _domain, chain?.id])

    const [minted_domain, setMintedDomain] = useState({} as {
        name: string;
        owner: string;
        resolver: string;
        image: string;
    });
    // @ts-ignore
    const [connectedAddress, setConnectedAddress] = useState();

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

            const filtered = _data.filter(data => data.name === router.query.name)[0]
            setMintedDomain(filtered)
        }
        init()

    }, [connectedAddress, router.query.name, domain, getDomain, chain?.id])
    const { writeAsync } = useContractWrite({
         // @ts-ignore
         address: CONTRACT_ADDRESS[chain?.id as number],
        abi: CNS.abi,
        functionName: "register",
        // @ts-ignore
        // value: parseGwei(price)
    })
    const purchaseDomain = async () => {
        if (!domain) { return }
        if (domain.length < 3) {
            alert('Domain must be at least 3 characters long');
            return;
        } else if (domain.length >= 7) {
            alert('Domain must not be higher than 6 characters long');
            return;
        }
        const price = chain?.id  === 80001 ? (domain.length === 3 ? Number('0.10') : domain.length === 4 ? Number('0.4') : Number('0.2')) : chain?.id  === 7001 ? (domain.length === 3 ? Number('0.40') : domain.length === 4 ? Number('0.6') : Number('0.3')) : 0;
        try {
            if (isConnected) {
                setLoading(true);

                writeAsync({
                    args: [domain],
                    // @ts-ignore
                    value: parseEther(`${price}` as any),
                }).then((data) => {
                    setPurchasedText(`Domain minted! \n\n\n\n ${chain?.id  === 80001 ? "https://mumbai.polygonscan.com/tx/" : chain?.id  === 7001 ? "https://explorer.zetachain.com/evm/tx/" : ""}${data?.hash}`);
                    setPurchased(true);
                    setDomain('');
                    setLoading(false);
                    setTimeout(() => {
                        router.push("/profile")
                    }, 5000)
                }).catch(() => {
                    setPurchasedText("Transaction failed! Please try again");
                    setPurchased(true);
                    setLoading(false);
                })
            }
        }
        catch (error) {
            setLoading(false);
            console.log(error);
        }
    }
    return (
        <>
            <Transition appear show={purchased} as={Fragment}>
                <Dialog as="div" className="relative h-72 z-10" onClose={() => setPurchased(!purchased)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full h-72 max-w-md transform overflow-hidden flex flex-col justify-center items-center rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    {/* <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Payment successful
                                    </Dialog.Title> */}
                                    <div className="mt-2">
                                        <p className="text-xl text-center text-gray-500">
                                            {purchased_text}
                                        </p>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <div className="bg-cover h-screen w-full" style={{
                background: "linear-gradient(159.24deg,#202020 52.47%,#050505 192.07%)"
            }}>
                <div className="bg-[url('/images/bg.svg')] gap-10 h-screen w-full flex flex-col justify-center items-center">
                    <div className="flex flex-row">
                        <Input value={domain}
                            placeholder='Enter Domain name'
                            onChange={e => setDomain(e.target.value)} />
                        <p className='bg-white px-5 text-black h-10 font-Tanker rounded-r-lg flex flex-col justify-center items-center'>{tld}</p>
                    </div>
                    <div>
                        <div className="rounded-[10px] mx-0 py-5 px-3 md:px-5 bg-white/30 border-2 border-white/[0.10] w-[305px] md:w-[779px] h-[fit]">
                            <h1 className="mr-3 mb-0 text-3xl font-extrabold text-white leading-[41px]"><Link href={`${minted_domain?.owner === address ? "/profile" : "#"}`}>{minted_domain?.name}</Link></h1>
                            <div className="rounded-[10px] mx-0 px-0 mt-5 bg-white/50 border-2 border-white/[0.10] w-[280px] md:w-[720px] h-[fit]">
                                <div className="px-10 h-[fit] py-10 flex flex-col gap-5 justify-center items-center">
                                    {minted_domain?.name ? (
                                        <>
                                            <span className="text-[13px] text-[#fff] leading-[18px] font-bold">
                                                <span className="uppercase">Owner:</span> {"\n"}
                                                
                                                <Link href={chain?.id  === 80001 ? `https://mumbai.polygonscan.com/address/${minted_domain?.owner}` : chain?.id  === 7001 ? `https://explorer.zetachain.com/address/${minted_domain?.owner}` : `${null}`} className="hover:underline hover:text-[#171717]">{truncateAddress(minted_domain?.owner)}</Link>
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
                                            <p className="md:text-[25px] text-[#fff] leading-[18px] font-bold"><span className="uppercase">Purchase Amount:</span> {price} {chain?.id  === 80001 ? "MATIC" : chain?.id  === 7001 ? "ZETA" : ""} / {useDollar(price_usd)}</p>
                                            <div className="button-container">
                                                <Button text={loading ? "Loading.." : "Purchase"} on_click={() => purchaseDomain()} />
                                            </div>
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

Names.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}


export default Names;