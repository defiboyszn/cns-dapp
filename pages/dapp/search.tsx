import { useRouter } from "next/router"
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import CNS from "../../contracts/CNS.json"
import Input from "@/components/UI/Input";
import { Badge, Button } from "@/components/UI";
// import { Button } from "../UI"
const CONTRACT_ADDRESS = "0xC571c33E97c0C64af44549268ddfC998b49Fe225";
const tld = process.env.TLD || ".card";

const Search = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [currentAccount, setCurrentAccount] = useState('');

    const _search = searchParams.get('keywords');
    const [domain, setDomain] = useState(_search as string);
    const [price, setPrice] = useState('');
    useEffect(() => {
        const price = domain?.length === 3 ? '0.10' : domain?.length === 4 ? '0.4' : '0.2';

        setPrice(price)
    }, [domain])
    const [minted_domain, setMintedDomain] = useState({} as {
        name: string;
        owner: string;
        resolver: string;
        image: string;
    });

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
                        avatar: string;
                        image: string;
                    };
                    dataa.owner = data_[0];
                    dataa.name = data_[1];
                    dataa.image = data_[2];
                    dataa.avatar = data_[3];
                    return dataa
                }))

                const filtered = _data.filter(data => data.name === domain + tld)[0]
                setMintedDomain(filtered)
            })
        }
        init()
    }, [domain, minted_domain])

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
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log('Found an authorized account:', account);
            setCurrentAccount(account);
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
                    {currentAccount && renderInputForm()}
                </div>
            </div>
        </>
    )
}





export default Search;