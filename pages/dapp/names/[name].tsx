import { useRouter } from "next/router"
import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import CNS from "../../../contracts/CNS.json"
import Input from "@/components/UI/Input";
import { Badge, Button } from "@/components/UI";
import { useDollar } from "../../../utils/useDollar";
import Link from "next/link";
import { truncateAddress } from "@/utils/truncate";
// import { Button } from "../UI"
const CONTRACT_ADDRESS = "0xC571c33E97c0C64af44549268ddfC998b49Fe225";
const tld = process.env.TLD || ".card";

const Names = () => {


    const router = useRouter()
    const _domain = router.query.name;
    const [domain, setDomain] = useState(_domain?.toString().split(".")[0] as string);
    const [price, setPrice] = useState(0);
    const [price_usd, setPriceUsd] = useState(0);
    useEffect(() => {
        const init = async () => {
            const maticPrice = 0.9531;
            const price = domain.length === 3 ? Number('0.10') : domain.length === 4 ? Number('0.4') : Number('0.2');
            const usdAmount = price * maticPrice;
            setPrice(price)
            setPriceUsd(usdAmount)
        }
        init()
    }, [domain, _domain])

    const [minted_domain, setMintedDomain] = useState({} as {
        name: string;
        owner: string;
        resolver: string;
        image: string;
    });
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
                    const data_ = await getDomain(data$.split(".")[0])
                    let dataa = {} as {
                        name: string;
                        owner: string;
                        resolver: string;
                        image: string;
                    };
                    dataa.name = data_[1];
                    dataa.owner = data_[0];
                    dataa.resolver = data_[2];
                    dataa.image = data_[3];
                    return dataa
                }))

                const filtered = _data.filter(data => data.name === router.query.name)[0]
                setMintedDomain(filtered)
            })
        }
        init()

    }, [connectedAddress, router.query.name, domain])
    const purchaseDomain = async () => {
        if (!domain) { return }
        if (domain.length < 3) {
            alert('Domain must be at least 3 characters long');
            return;
        }
        const price = domain.length === 3 ? '0.10' : domain.length === 4 ? '0.4' : '0.2';
        try {
            // @ts-ignore
            const { ethereum } = window;
            if (ethereum) {
                // @ts-ignore
                const provider = new ethers.BrowserProvider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS as string, CNS.abi, await signer);

                console.log("Going to pop wallet now to pay gas...")
                // @ts-ignore
                let tx = await contract.register(domain, { value: ethers.parseEther(price) });
                const receipt = await tx.wait();

                if (receipt.status === 1) {
                    console.log("Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash);
                    await tx.wait();

                    console.log("Record set! https://mumbai.polygonscan.com/tx/" + tx.hash);
                    setDomain('');
                }
                else {
                    alert("Transaction failed! Please try again");
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const checkIfWalletIsConnected = async () => {
        // @ts-ignore
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have MetaMask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log('Found an authorized account:', account);
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
                            <h1 className="mr-3 mb-0 text-3xl font-extrabold text-white leading-[41px]"><Link href={`/profile`}>{minted_domain?.name}</Link></h1>
                            <div className="rounded-[10px] mx-0 px-0 mt-5 bg-white/50 border-2 border-white/[0.10] w-[280px] md:w-[720px] h-[fit]">
                                <div className="px-10 h-[fit] py-10 flex flex-col gap-5 justify-center">
                                    {minted_domain?.name ? (
                                        <>
                                            <span className="text-[13px] text-[#fff] leading-[18px] font-bold">
                                                <span className="uppercase">Owner:</span> {"\n"}
                                                <Link href={`https://mumbai.polygonscan.com/address/${minted_domain?.owner}`} className="hover:underline hover:text-[#171717]">{truncateAddress(minted_domain?.owner)}</Link>
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
                                            <p className="md:text-[25px] text-[#fff] leading-[18px] font-bold"><span className="uppercase">Purchase Amount:</span> {price} MATIC / {useDollar(price_usd)}</p>
                                            <div className="button-container">
                                                <Button text="Purchase" on_click={() => purchaseDomain()} />
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

export default Names;