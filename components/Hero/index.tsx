import { useRouter } from "next/router"
import { Button } from "../UI"

export const Hero = () => {

    const router = useRouter()
    return (
        <>
            <div className="bg-cover h-screen w-full" style={{
                background: "linear-gradient(159.24deg,#111 52.47%,#171717 192.07%)"
            }}>
                <div className="bg-[url('/images/noise.svg')] absolute left-0 top-0 bg-contain bg-repeat bg-gray-900 h-full w-full [background-position:_50%] [opacity:_.12]" />
                    <div className="bg-[url('/images/bg.svg')] relative gap-10 h-screen w-full flex flex-col justify-center items-center">
                        <h1 className="font-Tanker text-[30px] text-center md:text-[60px] text-white">Unleash Your Digital Identity: Introducing CNS </h1>
                        <Button text="Launch App" on_click={() => {
                            router.push("/dapp")
                        }} />
                    </div>
                {/* </div> */}
            </div>
        </>
    )
}