import Image from "next/image"
import { Button } from "../UI"
import { useRouter } from "next/router"

export const Features = () => {
    const router = useRouter()

    return (
        <>
            <div className="bg-cover h-full w-full" style={{
                background: "linear-gradient(159.24deg,#202020 52.47%,#050505 192.07%)"
            }}>
                <div className="bg-[url('/images/bg.svg')] pb-10 gap-10 pt-10 h-full w-full flex flex-col justify-center items-center">
                    <h1 className="font-Tanker text-[30px] md:text-[60px] text-white">Your username as wallet address</h1>
                    <p className="font-Helvetica_Now text-xl md:text-3xl w-[280px] md:w-[800px] text-center text-white">No more long address. Own your username, store an avatar and other profile data, and use it across services.</p>
                    <div className="px-10 border border-white/40 flex flex-row justify-center gap-7 items-center bg-white/[.03] w-[280px] md:w-[537px] rounded-[100px] h-[75px] md:h-[126px]">
                        <Image className="w-[45px] h-[45px] md:w-[75px] md:h-[75px]" src={"/images/cns_img.png"} alt="cns_img" width={75} height={75} />
                        <h1 className="font-Tanker text-[28px] text-white">tobi.card</h1>

                    </div>
                    <Button text="Launch App" on_click={()=> {
                        router.push("/dapp")
                    }}  />


                    <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center md:justify-between text-center md:text-left items-center w-full px-12">
                        <div>
                            <h1 className="font-Tanker text-[30px] md:text-[60px] w-[385px] text-white">A username for getting paid</h1>
                            <p className="font-Helvetica_Now text-[22px] w-[fit] md:w-[385px] text-center md:text-left text-white">Make sending and receiving crypto simple. Replace long, complicated wallet addresses with your domain.</p>

                        </div>
                        <Image src={"/images/phone.png"} alt="phone" width={393} height={586} />
                    </div>












                    <div className="flex flex-col justify-center gap-12 items-center px-12">

                        <h1 className="font-Tanker text-[27px] text-center md:text-[60px] text-white">One domain for all your addresses</h1>
                        <p className="font-Helvetica_Now text-[22px] w-[280px] md:w-[604px] text-center text-white">No more copying and pasting long addresses. Use your CNS to store all of your addresses and receive any cryptocurrency, token, or NFT</p>
                        <Image src={"/images/chains.png"} alt="chains" width={380} height={102} />


                    </div>






                    <div className="flex flex-col justify-center gap-12 items-center px-12">

                        <h1 className="font-Tanker text-[27px] md:text-[60px] text-white">Join Our Community</h1>
                        {/*
                        <Image src={"/images/chains.png"} alt="chains" width={380} height={102} />
                        
                    */}


                        <div className="px-10 border-2 border-white/50 flex flex-col justify-center gap-7 items-center bg-white/[.2] w-[270px] md:w-[893px] rounded-[25px] h-[341.6px]">
                            <p className="font-Helvetica_Now text-[20px] md:text-[34px] w-fit md:w-[608px] text-center text-white">Join The CNS Community On Discord</p>
                            {/* <Image src={"/images/cns_img.png"} alt="cns_img" width={75} height={75} />
                            <h1 className="font-Tanker text-[28px] text-white">tobi.card</h1> */}

                            <Button text="Join Discord" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}