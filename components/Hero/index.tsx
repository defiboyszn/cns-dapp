import { useRouter } from "next/router"
import { Button } from "../UI"

export const Hero = () => {

    const router = useRouter()
    return (
        <>
            <div className="bg-cover h-screen w-full" style={{
                background: "linear-gradient(159.24deg,#202020 52.47%,#050505 192.07%)"
            }}>
                <div className="bg-[url('/images/bg.svg')] gap-10 h-screen w-full flex flex-col justify-center items-center">
                    <h1 className="font-Tanker text-[30px] md:text-[60px] text-white">Ditch .eth and get .card</h1>
                    <Button text="Launch App" on_click={()=> {
                        router.push("/dapp")
                    }} />
                </div>
            </div>
        </>
    )
}